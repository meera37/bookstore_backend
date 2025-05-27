const books = require("../model/bookModel");
const stripe = require('stripe')('sk_test_51RT3LwQSAWDde2Ly1KPLkn7JGUWHZTrfRIuCLeTaIblWcoKTuZI1HQ0WfG0r88DDoX0O3dXkRpLUmDM8ezhsBx8z00ZH2nnpur')

//to add books
exports.addBookController = async (req, res) => {
    console.log('inside addbookcontroller');
    // console.log(req.body);
    // console.log(req.files);
    const { title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category);

    uploadedImg = []
    req.files.map((item) => uploadedImg.push(item.filename))
    console.log(uploadedImg);

    const email = req.payload
    console.log(email);

    // res.status(200).json('request recieved')

    try {
        const existingBook = await books.findOne({ title, userMail: email })

        if (existingBook) {
            res.status(401).json('You have already added the book')
        }
        else {
            const newBook = new books({
                title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category,
                uploadedImg, userMail: email   //model key: value here req.body
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

//to get home books
exports.getHomeBookController = async (req, res) => {
    try {

        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}
//to get all books
exports.getAllBookController = async (req, res) => {
    // console.log(req.query);
    const searchkey = req.query.search
    const email = req.payload

    try {

        const query = {
            title: {
                $regex: searchkey, $options: "i"
            },
            userMail: { $ne: email }
        }
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get a particular book
exports.getABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        const aBook = await books.findOne({ _id: id })
        res.status(200).json(aBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books added by user
exports.getAllUserBookController = async (req, res) => {
    const email = req.payload
    console.log(email);

    try {
        const alluserBook = await books.find({ userMail: email })
        res.status(200).json(alluserBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books bought by user
exports.getAllUserBroughtBookController = async (req, res) => {
    const email = req.payload
    console.log(email);

    try {
        const alluserBroughtBook = await books.find({ brought: email })
        res.status(200).json(alluserBroughtBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to delete a user book
exports.deleteAUserBookController = async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('deleted successfully')

    } catch (error) {
        res.status(500).json(error)
    }

}

//payment controller
exports.makepaymentController = async (req, res) => {
    const { booksDetails } = req.body
    const email = req.payload
    // email eduthu vekkum
    try {

        const existingBook = await books.findByIdAndUpdate({ _id: booksDetails._id }, {
            title: booksDetails.title,
            author: booksDetails.author,
            noofpages: booksDetails.noofpages,
            imageurl: booksDetails.imageurl,
            price: booksDetails.price,
            dprice: booksDetails.dprice,
            abstract: booksDetails.abstract,
            publisher: booksDetails.publisher,
            language: booksDetails.language,
            isbn: booksDetails.isbn,
            category: booksDetails.category,
            uploadedImg: booksDetails.uploadedImg,
            status: 'sold',
            userMail: booksDetails.userMail,
            brought: email
        }, { new: true })

        const line_item = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: booksDetails.title,
                    description: `${booksDetails.author} | ${booksDetails.publisher}`,
                    images: [booksDetails.imageurl],
                    metadata: {
                        title: booksDetails.title,
                        author: booksDetails.author,
                        noofpages: booksDetails.noofpages,
                        imageurl: booksDetails.imageurl,
                        price: `${booksDetails.price}`,
                        dprice: `${booksDetails.dprice}`,
                        abstract: booksDetails.abstract.slice(0,20),
                        publisher: booksDetails.publisher,
                        language: booksDetails.language,
                        isbn: booksDetails.isbn,
                        category: booksDetails.category,
                       // uploadedImg: booksDetails.uploadedImg,
                        status: 'sold',
                        userMail: booksDetails.userMail,
                        brought: email

                    }
                },
                unit_amount:Math.round(booksDetails.dprice*100) //cents to dollars to conversion *100 ,rounded to nearest value
            },
            quantity:1
        }]
        //create stripe checkout section
        const session = await stripe.checkout.sessions.create({
            //purchased using card
            payment_method_types: ["card"],
            //details of product that is purchasing
            line_items: line_item,
            //make payment
            mode: "payment",
            //if the payment is successful,url to be shown
            success_url: 'http://localhost:5173/payment-success',
            //if the payment is failed,url to be shown
            cancel_url: 'http://localhost:5173/payment-error'
        });
        console.log(session);

        res.status(200).json({ sessionId: session.id })

    } catch (error) {
        res.status(500).json(error)
    }
}
//-------------------------------------------------------------------------------
//------------------------------------------ADMIN---------------------------------

//to get all books

exports.getAllBookAdminController = async (req, res) => {
    try {
        const allExistingBooks = await books.find()
        res.status(200).json(allExistingBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to approve book

exports.approveBookController = async (req, res) => {
    const { _id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status, userMail, brought } = req.body

    console.log(_id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status, userMail, brought);

    try {
        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status: "approved", userMail, brought }, { new: true })

        // await existingBook.save()
        res.status(200).json(existingBook)

    } catch (error) {
        res.status(500).json(error)
    }
}