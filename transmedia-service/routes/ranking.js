var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;

/* GET ranking page. */
router.get('/', async function (req, res, next) {
  const id = req.query.id;
  let users = {}

  if (id) {
    let query = 'function () { return (this._id.toString().includes("'+id+'"))}'
    let got = await req.db.collection('users').find({
      $where: query}, 
      { _id: 1, campQuantity: 1 }
    ).toArray()
    console.log(got)

    for (value of got){
      let pos = await req.db.collection('users').find({campQuantity: {$gte: value.campQuantity}, _id: {$gte: value._id}}).count()
      value.position = pos
    }
    
    users = got
  } else {
    let top = await req.db.collection('users').aggregate([
      { $sort: { campQuantity: 1 } },
      { $project: { _id: 1, campQuantity: 1 } },
      { $limit: 25 },
    ]).toArray()

    top.forEach(function (value, i) {
      value.position = i + 1
    });

    users = top;
  }

  res.render('ranking', { users: users });
});

module.exports = router;
