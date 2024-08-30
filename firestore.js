const {db,admin} = require('./firebase.js');
const bcrypt = require('bcrypt');

async function getUserRating({username, bookId}) {
  const ref = db.collection('ratings');
  const q = ref.where('username', '==', username).where('bookId', '==', bookId);
  const snapshot = await q.get();

  if (snapshot.empty) {
    return null;
  } else {
    const data = snapshot.docs[0].data();
    return {rating: data.rating, id: snapshot.docs[0].id};
  }
}

async function getBookRating(bookId) {
  const ref = db.collection('books').doc(bookId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error('bookId is invalid');
  }

  const data = snapshot.data();

  if (!data.rating) {
    return {rating: 0, rating_total: 0, rating_usercount: 0};
  }

  return {rating: data.rating, rating_total: data.rating_total, rating_usercount: data.rating_usercount};
}

async function updateRating({username, rating, bookId}) {
  if (rating < 0 || rating > 5) {
    throw new Error('invalid rating range');
  }

  const promises = [getBookRating(bookId), getUserRating({username, bookId})];
  const [bookRating, userRating] = await Promise.all(promises);

  const old_rating = userRating ? userRating.rating : null;

  const new_ratingTotal = bookRating.rating_total + rating - (old_rating ? old_rating : 0);
  const new_ratingUsercount = bookRating.rating_usercount + (old_rating ? 0 : 1);

  const result = new_ratingTotal / new_ratingUsercount;
  const new_rating = parseFloat(result.toFixed(1));

  const bookRef = db.collection('books').doc(bookId);
  await bookRef.update({rating: new_rating, rating_total: new_ratingTotal, rating_usercount: new_ratingUsercount});

  if (userRating) {
    await db.collection('ratings').doc(userRating.id).update({rating});
  } else {
    await db.collection('ratings').add({
      bookId,
      username,
      rating
    });
  }

  return new_rating;
}

async function deleteComment({username, id}) {
  const ref = db.collection('comments').doc(id);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error('Comment not found');
  }

  const data = snapshot.data();

  if (data.user === username) {
    await ref.delete();
  } else {
    throw new Error("username not matched with comment user");
  }
}

async function updateProfile({username, img, description}) {
  const docRef = db.collection('users').doc(username);

  const toUpdate = {};

  if (img) {
    toUpdate.img = img;
  }

  if (description) {
    toUpdate.description = description;
  }

  await docRef.update(toUpdate);
}

async function getComments({id}) {
  const q = db.collection('comments').where('bookId', '==', id).orderBy('date', 'desc');
  const querySnapshot = await q.get();

  const results = {};
  querySnapshot.forEach(doc => {
    results[doc.id] = doc.data();
  });

  return results;
}

async function addComment({bookId, username, comment}) {
  const docRef = await db.collection('comments').add({
    bookId,
    user: username,
    comment,
    date: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

async function favoriteInclude({id, username}) {
  const userRef = db.collection('users').doc(username);
  const user = await userRef.get();

  if (!user.exists) {
    return false;
  }

  const userData = user.data();

  if (userData.favorites && userData.favorites.includes(id)) {
    return true;
  } else {
    return false;
  }
}

async function addFavorite({username, id}) {
  const check = await favoriteInclude({username, id});

  if (!check) {
    const userRef = db.collection('users').doc(username);

    await userRef.update({
      favorites: admin.firestore.FieldValue.arrayUnion(id)
    });
  }
}

async function removeFavorite({username, id}) {
  const check = await favoriteInclude({username, id});

  if (check) {
    const userRef = db.collection('users').doc(username);

    await userRef.update({
      favorites: admin.firestore.FieldValue.arrayRemove(id)
    });
  }
}

async function getUser({username}) {
  const userRef = db.collection('users').doc(username);
  const user = await userRef.get();

  if (!user.exists) {
    return null;
  }

  const userData = user.data();

  if (userData) {
    delete userData.password;
  }

  return userData;
}

async function registerUser({username, password}) {
  const userRef = db.collection('users').doc(username);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    throw new Error('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userRef.set({username: username, password: hashedPassword});
}

async function loginCheck({username, password}) {
  const userRef = db.collection('users').doc(username);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User not exists.');
  }

  const data = userDoc.data();
  const match = await bcrypt.compare(password, data.password);

  return match;
}

async function fetchByCategory(category) {
  try {
    const booksRef = db.collection('books');
    const q = booksRef.where('category', 'array-contains', category);

    const results = {};
    const querySnapshot = await q.get();

    querySnapshot.forEach(doc => {
      results[doc.id] = doc.data();
    });

    return results;

  } catch (error) {
    console.error("Error searching query / category:", error);
    return null;
  }
}

async function searchQuery(input) {
  try {
    const booksRef = db.collection('books');
    const q = booksRef
      .where('title', '>=', input)
      .where('title', '<=', input + '\uf8ff')
      .limit(5);

    const querySnapshot = await q.get();

    const results = {};
    querySnapshot.forEach(doc => {
      const data = doc.data();
      results[doc.id] = data;
    });

    return results;

  } catch (error) {
    console.error("Error searching query:", error);
    return null;
  }
}

async function getAllBooks() {
  try {
    const booksRef = db.collection('books');
    const q = booksRef.orderBy('creation', 'desc');
    const querySnapshot = await q.get();

    const books = {};
    querySnapshot.forEach((doc) => {
      books[doc.id] = doc.data();
    });

    return books;

  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}

async function getBooksByRating() {
  try {
    const booksRef = db.collection('books');
    const q = booksRef.orderBy('rating', 'desc');
    const querySnapshot = await q.get();

    const books = {};
    querySnapshot.forEach((doc) => {
      books[doc.id] = doc.data();
    });

    return books;

  } catch (error) {
    console.error("Error fetching books by rating order:", error);
    return null;
  }
}

async function getBook(id) {
  try {
    const bookRef = db.collection('books').doc(id);
    const book = await bookRef.get();
    return book.data();

  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  updateRating,
  getUserRating,
  getBookRating,
  getBooksByRating,
  deleteComment,
  updateProfile,
  getComments,
  getAllBooks,
  getBook,
  searchQuery,
  fetchByCategory,
  registerUser,
  loginCheck,
  getUser,
  addFavorite,
  removeFavorite,
  addComment
};