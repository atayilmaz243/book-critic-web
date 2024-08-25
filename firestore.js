const db = require("./firebase.js")
const bcrypt = require('bcrypt');

const { collection, query, where, addDoc,getDocs , getDoc,deleteDoc, setDoc, doc , limit ,updateDoc,arrayUnion,arrayRemove,serverTimestamp,orderBy} = require("firebase/firestore")

async function getUserRating({username,bookId})
{
  const ref = collection(db,'ratings')

  const q = query(ref,where('username','==',username),where('bookId','==',bookId))

  const snapshot = await getDocs(q)

  if (snapshot.empty)
  {
    return null
  }
  else
  {
    const data = snapshot.docs[0].data()
    return {rating:data.rating, id:snapshot.docs[0].id }
  }
}

async function getBookRating(bookId)
{
  const ref = doc(db,'books',bookId)
  const snapshot = await getDoc(ref)

  if (snapshot.empty)
  {
    throw new Error('bookId is invalid')
  }

  const data = snapshot.data()

  if (!data.rating)
  {
      return ({rating:0, rating_total: 0, rating_usercount: 0})
  }

  return ({rating:data.rating, rating_total: data.rating_total, rating_usercount: data.rating_usercount})
}


async function updateRating({username,rating,bookId})
{
  if (rating < 0 || rating > 5)
  {
    throw new Error('invalid rating range')
  }

  const promises = [getBookRating(bookId),getUserRating({username,bookId})]
  const [bookRating,userRating] = await Promise.all(promises)

  const old_rating = userRating ? userRating.rating : null;

  const new_ratingTotal = bookRating.rating_total + rating - (old_rating ? old_rating : 0)
  const new_ratingUsercount = bookRating.rating_usercount + (old_rating ? 0 : 1)

  const result = new_ratingTotal/new_ratingUsercount
  const new_rating = parseFloat(result.toFixed(1));


  const bookRef = doc(db,'books',bookId)
  await updateDoc(bookRef,{rating:new_rating, rating_total:new_ratingTotal, rating_usercount:new_ratingUsercount})

  if (userRating)
  {
    updateDoc(doc(db,'ratings',userRating.id),{rating})
  }
  else
  {
    addDoc(collection(db,'ratings'),{ 
      bookId,
      username,
      rating
    });
  }

  return new_rating
}



async function deleteComment({username,id})
{
  const ref = doc(db,'comments',id)
  const snapshot = await getDoc(ref)

  const data = snapshot.data()

  if (data.user === username)
  {
    await deleteDoc(ref)
  }
  else
  {
    throw new Error("username not mached with comment user")
  }



}


async function updateProfile({username,img,description})
{
  const docRef = doc(db,'users',username)

  const toUpdate = {}

  if (img)
  {
    toUpdate.img = img
  }

  if (description)
  {
    toUpdate.description = description
  }

  await updateDoc(docRef,toUpdate)

}



async function getComments({id})
{

  const q = query(collection(db,'comments'),where('bookId','==',id),orderBy('date', 'desc'))
  // const q = query(collection(db,'comments'),where('bookId','==',id))
  const querySnapshot = await getDocs(q)

  const results = {}
  querySnapshot.forEach(doc => {
    results[doc.id] = doc.data()
  })

  return results;

}



async function addComment({bookId,username,comment})
{
  const docRef = await addDoc(collection(db,'comments'),{ 
    bookId ,
    user: username,
    comment,
    date: serverTimestamp(),
  });

  return docRef.id
}



async function favoriteInclude({id,username})
{
    const usersRef = collection(db,"users")

    const user = await getDoc(doc(usersRef,username))

    const userData = user.data()

      if (userData.favorites && userData.favorites.includes(id)) {
        return true
      } else {
        return false
      }
}

async function addFavorite({username,id})
{
  const check = await favoriteInclude({username,id})

  if (!check)
  {
    const userRef = doc(db,'users',username)

    await updateDoc(userRef, {
      favorites: arrayUnion(id)
    });
  }

}

async function removeFavorite({username,id})
{
  const check = await favoriteInclude({username,id})

  if (check)
  {
    const userRef = doc(db,'users',username)

    await updateDoc(userRef, {
      favorites: arrayRemove(id)
    });
  }

}

async function getUser({username})
{
    const usersRef = collection(db,"users")

    const user = await getDoc(doc(usersRef,username))
    const userData = user.data()

    if (userData) 
      delete userData.password

    // console.log(userData)  
    return userData;
}




async function registerUser({username,password})
{

    const usersRef = collection(db,"users")

    const user = doc(usersRef,username)

    const userDoc = await getDoc(user)

    if (userDoc.exists())
    {
      throw new Error('User already exists.')
    }

    const hashedPassword = await bcrypt.hash(password,10);
    await setDoc(user,{username:username,password:hashedPassword});

}

async function loginCheck({username,password})
{

    const usersRef = collection(db,"users")

    const user = doc(usersRef,username)

    const userDoc = await getDoc(user)

    if (userDoc.exists())
    {
      const data = userDoc.data()

      const match = await bcrypt.compare(password, data.password);

      if (match)
      {
        return true
      }
      else return false
    }
    else
    {
      throw new Error('User not exists.')
    }

}



async function fetchByCategory(category)
{
  try {

    const booksRef = collection(db,'books')

    const q = query(booksRef,where('category','array-contains',category))

    const results = {}

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      results[doc.id] = doc.data()
    })

    return results

  } catch(error) {
      console.error("Error searching query / category:", error);
      return null;
  }
}




async function searchQuery(input) {
  try {
    const booksRef = collection(db,'books')

    const q = query(booksRef,where('title','>=',input),where('title','<=',input + '\uf8ff'),limit(5))

    const querySnapshot = await getDocs(q)

    const results = {}


    querySnapshot.forEach(doc => {
      const data = doc.data()
      results[doc.id] = data
    })
    return results

  } catch (error) {
        console.error("Error searching query:", error);
    // Handle error, e.g., retry, display error message to user
    return null
  }
}

async function getAllBooks() {
  try {
    const booksRef = collection(db, 'books');
    const q = query(booksRef,orderBy('creation','desc'))
    const querySnapshot = await getDocs(q);

    const books = {}
    querySnapshot.forEach((doc) => {
      books[doc.id] = doc.data()
    });

    return books

  } catch (error) {
    console.error("Error fetching books:", error);
    // Handle error, e.g., retry, display error message to user
    return null
  }

}

async function getBooksByRating() {
  try {
    const booksRef = collection(db, 'books');
    const q = query(booksRef,orderBy('rating','desc'))
    const querySnapshot = await getDocs(q);

    const books = {}
    querySnapshot.forEach((doc) => {
      books[doc.id] = doc.data()
    });

    return books

  } catch (error) {
    console.error("Error fetching books by rating order:", error);
    // Handle error, e.g., retry, display error message to user
    return null
  }

}

async function getBook(id)
{
  try {
    const bookRef = doc(db,"books",id)
    const book = await getDoc(bookRef)
    // console.log(book.data())
    return book.data()
   
  } catch (error) {

    console.log(error)
    return null

  }

}


module.exports = {updateRating,getUserRating,getBookRating,getBooksByRating,deleteComment,updateProfile,getComments,getAllBooks,getBook,searchQuery,fetchByCategory,registerUser,loginCheck,getUser,addFavorite,removeFavorite,addComment}