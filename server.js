const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ratingRoutes = require('./routes/rating');
require('dotenv').config();


const {getBooksByRating,deleteComment,updateProfile,addComment,getAllBooks,getBook,searchQuery,fetchByCategory,registerUser,loginCheck,getUser,addFavorite,removeFavorite,getComments} = require('./firestore.js');

const app = express();

app.use(express.json());

app.use(express.static(__dirname + '/public'))



app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day expiration
  }
}));


app.use('/', ratingRoutes);




const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it does not exist
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const username = req.session.username; 
        const ext = path.extname(file.originalname); 
        cb(null, `${username}${ext}`);
    }
});

const upload = multer({ storage: storage });



app.post('/editProfile',isAuthorized,upload.single('profilePicture'),async (req, res) => {

  try {
    const file = req.file;
    const description = req.body.description;
    const username = req.session.username
    const filename = file ? `${username}${path.extname(file.originalname)}` : undefined;


    await updateProfile({username,img:filename,description})

    res.status(200).json({success: true,message:"successful uploading file"})   


  }  catch (error) {
    console.log(error)
    res.status(500).json({message:"error happened on server"})
  }
});
app.post('/delete-comment',isAuthorized,async (req, res) => {

  try {
    const {id} = req.body;
    const username = req.session.username

    await deleteComment({id,username})
    res.status(200).json({message:"successful"})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


app.post('/comment', async (req, res) => {

  try {
    const { id, comment} = req.body;
    const username = req.session.username

    if (!comment)
    {
      throw new Error('Comment empty')
    }


    if(username)
    {
      const comment_id = await addComment({bookId:id,username,comment})
      res.status(201).json({message: 'Adding comment successful',comment_id});
    }
    else
    {
      throw new Error(`user not exists.`)
    }

  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



app.post('/add-favorite', async (req, res) => {

  try {
    const { id } = req.body;
    const username = req.session.username

    if(username)
    {
      await addFavorite({id,username})

      res.status(201).json({message: 'Adding favorite successful' });
    }
    else
    {
      throw new Error(`user not exists.`)
    }

  } catch (error) {
    res.status(500).json({message: error.message});
  }
});




app.post('/remove-favorite', async (req, res) => {

  try {
    const { id } = req.body;
    const username = req.session.username

    if(username)
    {
      await removeFavorite({id,username})

      res.status(201).json({message: 'Removing favorite successful' });
    }
    else
    {
      throw new Error(`user not exists.`)
    }

  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



function validateCredentials(username, password) {
    // Regular expression to match 4-10 characters, no spaces, no special characters, no emoji
    const usernameRegex = /^[a-zA-Z0-9]{4,10}$/;
    
    // Regular expression to match 4-16 characters, no spaces, no special characters, no emoji
    const passwordRegex = /^[a-zA-Z0-9]{4,16}$/;

    // Test username and password against their respective regex patterns
    const isUsernameValid = usernameRegex.test(username);
    const isPasswordValid = passwordRegex.test(password);

    // Return true if both are valid, otherwise false
    return isUsernameValid && isPasswordValid;
}


app.post('/register', async (req, res) => {

  try {
    const { username, password } = req.body;

    if (!validateCredentials(username,password))
    {
      throw new Error('Username or password doesnt obey the criterias.')
    }

    await registerUser({username,password});
    req.session.username = username

    res.status(201).json({message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


app.post('/login', async (req, res) => {

  try {
    const { username, password } = req.body;
    const infoValidation = await loginCheck({username,password});

    if (infoValidation)
    {
      req.session.username = username
      res.status(201).json({message: 'Registration successful' });
    }
    else
    {
      res.status(500).json({message: "Password is invalid"});
    }

  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.status(200).send('Logout successful');
  });
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.get('/search-results', (req, res) => {
  res.sendFile(__dirname + '/public/search.html');
});



app.get('/book', (req, res) => {
  res.sendFile(__dirname + '/public/book-page/book.html');
});


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/auth/auth.html');
});

app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/public/user/profile.html');
});


app.get('/image', (req, res) => {
    const {path} = req.query
    const filePath = __dirname +  `/uploads/${path}`

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send({ success: false, message: 'Image not found.' });
    }
});




app.get('/getComments', async (req, res) => {
    const {id} = req.query
    const comments = await getComments({id})
    res.json(comments)
});


app.get('/getUsername', (req, res) => {
  if (req.session.username)
  {
    res.json({username: req.session.username})
  }
  else
  {
    res.json({})
  }
});

app.get('/getUser', async (req, res) => {
  if (req.session.username)
  {
    const {id} = req.query
    const userData = await getUser({username:req.session.username})
    res.json(userData)
  }
  else
  {
    res.json({username:undefined})
  }
});

app.get('/get-books-rating-order', async (req, res) => {
    const books = await getBooksByRating()
    res.json(books)
});

app.get('/getUserProfile', async (req, res) => {
    const {id,user} = req.query
    const userData = await getUser({username:user})
    res.json(userData)
});

app.get('/fetch-all-books', async (req,res) => {
  const books = await getAllBooks()
  // console.log(books)
  res.json(books)
});

app.get('/fetch-book', async (req,res) => {
  const {id} = req.query;
  // console.log(id)
  const book = await getBook(id)
  res.json(book)
});

app.get('/search',async (req,res) => {
  const {query} = req.query
  const results = await searchQuery(query)
  // console.log(results)
  res.json(results)
})

app.get('/search-category',async (req,res) => {
  const {query} = req.query
  const results = await fetchByCategory(query)
  // console.log(results)
  res.json(results)
})

function isAuthorized(req, res, next) {
    if (req.session.username) {
        next(); 
    } else {
        res.status(403).json({message:'User not authorized'}); 
    }
}

app.listen(3000,() => {
  console.log('server running at http://localhost:3000');
});