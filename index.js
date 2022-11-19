const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");
const multer = require("multer")
const upload = multer({dest: "uploads"})
const bcrypt =  require('bcrypt');
const File = require("./models/File");

const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}))

app.set('view engine','ejs');
app.set('views','./views');

const userRoute = require('./routes/userRoute');
const passport = require("passport");
app.use('/',userRoute);

app.listen(3000,function(){
    console.log("server is running....");
});

app.post("/upload", upload.single("file"), async (req,res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    if(req.body.password != null && req.body.password !== ""){
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }

    const file = await File.create(fileData)
    res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}`})
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
    const file = await File.findById(req.params.id)
    
    if(file.password != null) {
        if(req.body.password == null) {
            res.render("password")
            return
        }

        if(!(await bcrypt.compare(req.body.password, file.password))) {
            res.render("password", {error: true})
            return
        }
    }

    file.downloadCount++
    await file.save()
    console.log(file.downloadCount)

    res.download(file.path, file.originalName)
}