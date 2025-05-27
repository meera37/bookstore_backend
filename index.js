//import dotenv file
// const dotenv = require('dotenv')
// dotenv.config()
require('dotenv').config() // load environment variables 
//1.import express library
const express = require('express')

//5import cors
const cors = require('cors')

//8.import route after creating
const route = require('./routes')

//import db connection file
require('./databaseconnection')

//2.create the server -express() method
const bookstoreServer = express()

//6.server using cors    //6,7,8 should always in this order
bookstoreServer.use(cors())

//7.parse -json middleware
bookstoreServer.use(express.json()) //it parses json to js(our backend lang) middlevare-break req-res cycle express.json instead of default
//8.then use 
bookstoreServer.use(route)
//export the uploads folder from the server side
bookstoreServer.use('/upload', express.static('./uploads'))
//export the uploads folder from the server side
bookstoreServer.use('/pdfUploads', express.static('./pdfUploads'))

//3.create port
PORT =4000 || process.env.PORT

//4.listen
bookstoreServer.listen(PORT, ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})