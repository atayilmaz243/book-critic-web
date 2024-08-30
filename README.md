<a href="http://bookcritic.ata243y.com/">Demo for the project</a>

<h2>About the Project</h2>
The purpose of the project is to create a platform for critiquing, rating, and sharing books.

<br>
<br>

The project currently has 6 pages:
<br>
- **Main Page**
  - Users can search for the book they are looking for using the search bar (*note: the search bar is case-sensitive) and view the latest books added to the website.
- **User Profile Page**
   - Users can upload a profile picture and edit their description.
   - A person's favorite books can be viewed here.
   - To visit another user's profile, use the comment section on the book page and click on the specific username.
- **Book Page**
   - Authenticated users can rate and comment on books and add them to their favorites.
- **Top Rated Page**
   - Books rated on the book page are ordered from highest to lowest overall rating. This can be interpreted as a book version of IMDb's Top 100 films.
- **Login/Register Page**
    - Users must register to rate and comment on books and upload a profile picture.
    - I used password hashing before storing the passwords, but nevertheless, please do not use your real password.
- **Category/Search Page**
   - Users can search for a book by its category or by its name via the search bar.

 
The website is responsive and can be used on both mobile devices and computers.
      
<h2>How I Created the App / Technologies Used</h2>

I created the app using HTML, CSS, and JavaScript on the client side, and Node.js on the backend.

The client side communicates with the backend via Express.js APIs to fetch data. The backend fetches some of the data from the Firestore database and sends the response to the client side.
For the user login/register system, I used express-session and stored the users' usernames and hashed passwords in Firestore.
