
const express = require("express");
var fs = require('fs');
const multer = require('multer');

const app = express();
const db = require("./config/sequelize");
const Image = db.images;

app.use(express.static(__dirname + '/public'));
console.log(__dirname)
// assets/uploads/image-1622607466487.jpg
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
})

db.sequelize.sync();

app.get('/addImage', (req, res) => {
    res.render('uploadImage')
})


app.post('/addImage', upload.single("image"),  async(req, res) => {
          console.log(req.file);
      
          if (req.file == undefined) {
            return res.send(`You must select a file.`);
          }
      
         const result = await Image.create({
            type: req.file.mimetype,
            name: req.file.originalname,
            data: fs.readFileSync(
                __dirname + "/public/uploads/" + req.file.filename
            ),
          })
          
          if(result) {
            fs.writeFileSync(
                __dirname + "/public/uploads/" + result.name,
                result.data
            );
      
            return res.redirect('/');
          };
    
      });
 
app.get('/', async(req, res) => {
    const results = await Image.findAll()
        res.render('getList', {
            users: results
        })
    
});

app.get('/getImage', async(req, res) => {
    const id = req.query.id

    const results = await Image.findByPk(id)

   console.log(results)

            // const buffer = new Buffer.from(results.data.toString('base64'));
            const buffer = new Buffer( results.data);
      const bufferBase64 = buffer.toString('base64');
          
            // var bufferBase64 = buffer.toString();
            
            // const file = Buffer.from(buffer,'base64')
            // console.log("convert",file)
        res.render('getImage', {
            users: bufferBase64
        })
    

});

app.listen(4000, () => {
    // Listening to port
    console.log(`Listening to Port : 4000`);
});