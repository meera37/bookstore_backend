//import express
const express = require('express')
//import userController
const userController = require('./controllers/userController')

//import bookcontroller
const bookcontroller = require('./controllers/bookController')
//import jwt middleware
const jwtMiddleware = require('./middleware/jwtMiddleware')
//import multerconfig
const multerConfig = require('./middleware/ImgmulterMiddleware')
//import pdfmulter
const pdfMulterConfig = require('./middleware/pdfmulterMiddleware')
//import job controller
const jobController = require('./controllers/jobController')

//import app controller
const appController = require('./controllers/appController')

//create object //instance
const route = new express.Router()

//path for register
route.post('/register', userController.registerController)

//path for login
route.post('/login',userController.loginController)

//path for google login
route.post('/google-login',userController.googleLoginController)

//path to all home book
route.get('/all-home-book',bookcontroller.getHomeBookController)

//path to get all jobs
route.get('/all-jobs',jobController.getAllJobsController)

//--------------------------------------------------------------------------------------------------
//----------------------------------user------------------------------------------------------------

//path to add books
route.post('/add-book',jwtMiddleware,multerConfig.array('uploadedImages',3), bookcontroller.addBookController)

//path to get all books
route.get('/all-books', jwtMiddleware ,bookcontroller.getAllBookController)

//path to view a Book
route.get('/view-book/:id',bookcontroller.getABookController)

//path to apply for a job
route.post('/apply-job',jwtMiddleware, pdfMulterConfig.single('resume'), appController.addApplicationController)

// edit user profile
route.put('/user-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.editUserProfileController)

//path to get all user added books
route.get('/user-books',jwtMiddleware,bookcontroller.getAllUserBookController)

//path to get all user brought books
route.get('/user-brought-books',jwtMiddleware,bookcontroller.getAllUserBroughtBookController)

//path to delete user books
route.delete('/delete-user-books/:id',bookcontroller.deleteAUserBookController)

//path to make payment
route.put('/make-payment',jwtMiddleware ,bookcontroller.makepaymentController)

//------------------------------------------------------------------------------------------------------
//-------------------------ADMIN------------------------------------------------------------------------

//path for all book admin
route.get('/admin-all-books',jwtMiddleware ,bookcontroller.getAllBookAdminController)

//path to approve a book
route.put('/approve-book',jwtMiddleware, bookcontroller.approveBookController)

//path to get all users
route.get('/all-users',jwtMiddleware,userController.getAllUsersController)

//path to add new job
route.post('/add-job',jobController.addJobController)

//path to delete job
route.delete('/delete-job/:id',jobController.deleteAJobController)

//path to get all application
route.get('/all-application',appController.getAllApplicationController)

//path to update the admin profile
route.put('/admin-profile-update',jwtMiddleware,multerConfig.single('profile'),userController.editAdminProfileController)

//export routes
module.exports = route