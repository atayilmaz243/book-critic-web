const express = require('express');
const router = express.Router();
const rating = require('../firestore/rating.js')

function isAuthorized(req, res, next) {
    if (req.session.username) {
        next(); 
    } else {
        res.status(403).json({message:'User not authorized'}); 
    }
}


router.get('/getUserRating',isAuthorized, async (req, res) => {
    const username  = req.session.username
    const {id} = req.query

    const data = await rating.getUserRating({username,bookId:id})
    res.json(data)
});


router.get('/getBookRating',async (req, res) => {
    const {id} = req.query
    const data = await rating.getBookRating(id)
    res.json(data)
});


router.post('/updateRating',isAuthorized,async (req, res) => {

  try {
    const {point,bookId} = req.body;
    const username = req.session.username


    // console.log({point,bookId,username})
    const new_rating = await rating.updateRating({username,rating:Number(point) ,bookId})


    res.status(200).json({success: true,message:"successful update rating",new_rating})   


  }  catch (error) {
    console.log(error)
    res.status(500).json({message:"error happened on server"})
  }
});








module.exports = router;