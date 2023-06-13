import express from 'express'
import fs from 'fs';
import multer from 'multer'
import cors from 'cors'

import mongoose from 'mongoose'

import {registerValidator, loginValidator, postCreateValidator} from "./validations/validations.js";
import {handleValidationErrors, checkAuth} from "./utils/index.js";


import {UserController, PostController} from './controllers/index.js'



mongoose.connect('mongodb+srv://admin:PcdrmzRZMMmkQ8dm@blog.klusu9f.mongodb.net/blog ')
    .then(()=> console.log('DB Ok'))
    .catch((err)=> console.log('DB error', err))

const app = express();
app.use(cors())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload= multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'));


app.post('/auth/login', loginValidator,handleValidationErrors, UserController.login)
app.post('/auth/register',registerValidator,handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts',  PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id',  PostController.getOne)

app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostController.create)
app.delete('/posts/:id',checkAuth,  PostController.remove)
app.patch('/posts/:id', checkAuth,postCreateValidator, handleValidationErrors,  PostController.update)




app.listen(4444, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log('Server OK')
})