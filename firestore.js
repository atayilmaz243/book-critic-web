const db = require("./firebase.js")
const { collection, query, where, getDocs , getDoc,doc , limit } = require("firebase/firestore")

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
    const querySnapshot = await getDocs(booksRef);

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


module.exports = {getAllBooks,getBook,searchQuery,fetchByCategory}