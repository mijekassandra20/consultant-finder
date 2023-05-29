const express = require('express')
const router = express.Router()

const reqLogger = require('../middlewares/reqLogger')

const {
    getTables,
    getAllColumns,
    getMetadatas,
    getValues,
    createTableQuery,
    download,
    deleteImport,
    insertNewImport,
    getBookmarks,
    postBookmark,
    createDisplayBookmark,
    deleteBookmark
} = require('../controllers/recordsController')

const {
    tableColumnValidator, filterValidator, queryValidator, importExists
} = require('../middlewares/utils/validators')


//1. GET all tables in DB
router.route('/tables')
    .get(reqLogger, getTables)

//2. GET Columns when a table is selected
router.route('/columns/:tableName')
    .get(reqLogger, getAllColumns)

//3. GET metadata based on the table and column selected
router.route('/columns/:tableName/metadata')
    .get(reqLogger, getMetadatas)

//3.1 GET 
router.route('/columns/:tableName/metadata/:columnName')
    .get(reqLogger, getValues)

//4.1 CREATE
router.route('/query')
    .post(reqLogger, tableColumnValidator, filterValidator, queryValidator, createTableQuery)

//5.1 DOWNLOAD DATABASE
router.route('/download')
    .get(reqLogger, download)

//6.1 CREATE BOOKMARK 
router.route('/bookmark')
    .get(reqLogger, getBookmarks)
    .post(reqLogger, postBookmark)

//7.1 RETRIEVE BOOKMARK
router.route('/retrieve-bookmark')
    .post(reqLogger, createDisplayBookmark)

//8.1 DELETE BOOKMARK
router.route('/delete-bookmark')
    .post(reqLogger, deleteBookmark)

//9.1 INSERT THE DATA IN DATABASE
router.route('/insert-newData')
    .get(reqLogger, importExists, insertNewImport)

// DELETE THE IMPORT
router.route('/delete-import')
    .delete(reqLogger, deleteImport)


module.exports = router;