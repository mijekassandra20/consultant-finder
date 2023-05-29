//modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path')
const fs = require('fs')
const xlxs = require('xlsx')

//file connections
dotenv.config({ path: './config/config.env' })
const connectDB = require('./config/db')
const record = require('./routes/recordRoutes')
const logger = require('./middlewares/logger')
const {
    databaseFileValidator, excelFileValidator
} = require('./middlewares/utils/validators')

const app = express();

// connectDB();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//upload file
app.use(fileUpload());

//parser
app.use(bodyParser.json());

//logger
app.use(logger);

//use cors protection
app.use(cors());

//hook up routes
app.use('/api/record', record)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})

// upload a new database file
app.post('/uploads', databaseFileValidator, async (req, res) => {
    try {
        // check if file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // get original file name and rename it
        const fileName = req.files.file.name;
        const newFileName = 'Consultants_DB.accdb';

        // create new file path with new file name
        const newFilePath = path.join('uploads', newFileName);

        // move file to uploads folder with new file name
        await req.files.file.mv(newFilePath);

        // update environment variable with new file path
        process.env.DB_CONNECTION = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${newFilePath};`;

        // initialize database connection
        await connectDB();

        // return success response
        res
            .status(200)
            .setHeader('Cache-Control', 'no-cache')
            .json({ message: 'File uploaded successfully' });
    } catch (err) {
        throw new Error(`Failed to upload file ${err.message}`)

    }
});

// import the excel file and extract the data
app.post('/import-excel', excelFileValidator, async (req, res) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res
                .status(400)
                .json({ message: 'No xlxs file imported' });
        }

        const fileName = req.files.file.name;
        const importFileName = 'imported-excel.xlsx';

        // create new file path with new file name
        const newFilePath = path.join('import', importFileName);

        console.log('importFileName: ', newFilePath)

        await req.files.file.mv(newFilePath);

        res
            .status(200)
            .setHeader('Cache-Control', 'no-cache')
            .json({ message: 'File imported successfully' });


    } catch (err) {
        throw new Error(`Failed to import xlsx file ${err.message}`)
    }

});


// handle rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
});