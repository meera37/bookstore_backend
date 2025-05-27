//import multer
const multer = require('multer')

const storage = multer.diskStorage({
    //path to store file
    destination: (req, file, callback) => {
        callback(null, './pdfUploads')
    },
    //name to store the file
    filename: (req, file, callback) => {
        const fname = `resume-${file.originalname}`  //how you want to store the filename
        callback(null, fname)
    }
})

const fileFilter = (req, file, callback) => {
    //accepts only png,jpg,jpeg
    if (file.mimetype == 'application/pdf') {
        callback(null, true)
    }
    else {
        callback(null, false)
        return callback(new Error('accepts only pdf files'))
    }
}

//create config

const pdfmulterConfig = multer({
    storage,  //key:value storage:storage
    fileFilter
})

module.exports = pdfmulterConfig