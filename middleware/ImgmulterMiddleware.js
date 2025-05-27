//import multer
const multer = require('multer')

const storage = multer.diskStorage({
    //path to store file
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    //name to store the file
    filename: (req, file, callback) => {
        const fname = `image-${file.originalname}`  //how you want to store the filename
        callback(null, fname)
    }
})

const fileFilter = (req, file, callback) => {
    //accepts only png,jpg,jpeg
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        callback(null, true)
    }
    else {
        callback(null, false)
        return callback(new Error('accepts only png,jpg,jpeg files'))
    }
}

//create config

const multerConfig = multer({
    storage,  //key:value storage:storage
    fileFilter
})

module.exports = multerConfig