const mongoose = require('mongoose');
const grid = require('gridfs-stream')
let  gfs = {};

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

mongoose.connect(process.env.mongo_uri,options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
    gfs.gridfsBucket = new mongoose.mongo.GridFSBucket(db.db, {
      bucketName: 'profilePhotos'
    });
    gfs.gfs = grid(db.db, mongoose.mongo);
    gfs.gfs.collection('profilePhotos');
});


module.exports = {db,gfs};