const db = require("../firebase.js")
const bcrypt = require('bcrypt');

const { collection, query, where, addDoc,getDocs , getDoc, setDoc, doc , limit ,updateDoc,arrayUnion,arrayRemove} = require("firebase/firestore")


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

module.exports = {updateRating,getUserRating,getBookRating}