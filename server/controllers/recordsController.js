const odbc = require('odbc');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx')

const connection = odbc.connect(process.env.DB_CONNECTION);
const bookmarkDB = odbc.connect(process.env.BOOKMARKDB_CONNECTION)

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const getTables = async (req, res, next) => {
    try {
        const conn = await connection;

        const tableNames = await conn.tables(null, null, null, 'TABLE');
        const tables = tableNames
            .filter(table => table.TABLE_TYPE === 'TABLE' && !table.TABLE_NAME.startsWith('~') && !table.TABLE_NAME.startsWith('Metadata'))
            .map(table => table.TABLE_NAME)

        // console.log('tables are: ', tables)

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .setHeader('Cache-Control', 'no-cache')
            .json({ tables });


    } catch (err) {
        throw new Error(`Failed to get all tables: ${err.message}`);
    }
}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------


const getAllColumns = async (req, res, next) => {
    try {

        const conn = await connection;

        const getColumns = await conn.columns(null, null, req.params.tableName, 'COLUMN_NAME');
        const columnNames = getColumns
            .map(column => column.COLUMN_NAME)

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({ columnNames })

    } catch (err) {
        console.log(err);
    }
};

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

// display dropdown based on the column selected
const getMetadatas = async (req, res, next) => {
    try {

        const conn = await connection;

        // from front end, after selecting table get all columns
        const tableName = req.params.tableName;
        const getColumns = await conn.columns(null, null, tableName, 'COLUMN_NAME');

        let columnNames = getColumns
            .map(column => column.COLUMN_NAME)

        // only return the necesary columns
        if (tableName === 'Assets') {
            columnNames = columnNames.filter(columnName => ['AssetsType', 'CompetencyLevel'].includes(columnName));
        } else if (tableName === 'ConsultantInfo') {
            columnNames = columnNames.filter(columnName => ['EmployeeContractor', 'YearsITExperience'].includes(columnName));
        } else if (tableName === 'Engagements') {
            columnNames = columnNames.filter(columnName => ['EngagementTypes', 'CompetencyLevel'].includes(columnName));
        } else if (tableName === 'Industries') {
            columnNames = columnNames.filter(columnName => ['Industries', 'CompetencyLevel'].includes(columnName));
        } else if (tableName === 'Skills') {
            columnNames = columnNames.filter(columnName => ['SkillRole', 'SkillArea', 'CompetencyLevel'].includes(columnName));
        } else if (tableName === 'Technologies') {
            columnNames = columnNames.filter(columnName => ['Platforms', 'PlatformsCompetencyLevel', 'Databases', 'DatabaseCompetencyLevel', 'DataIntegrationTools', 'DataIntegrationCompetencyLevel', 'BIAnalyticTools', 'BIAnalyticCompetencyLevel', 'DevelopmentToolsLanguages', 'DevelopmentToolsCompetencyLevel'].includes(columnName));
        }

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({ columnNames })



    } catch (err) {
        console.log(err)
    }
}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const getValues = async (req, res, next) => {
    try {
        const conn = await connection;

        const columnName = req.params.columnName

        let metadatas = []

        // once necessary columns is selected, only return the metadatas of the selected column, 

        if (columnName === 'AssetsType') {
            const query = `SELECT Type FROM Metadata_Asset`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'EmployeeContractor') {
            const type = ['E', 'C']
            metadatas = type.map(row => ({ value: row, label: row }));
        } else if (columnName === 'YearsITExperience') {
            const type = ['E', 'C']
            metadatas = type.map(row => ({ value: row, label: row }));
        } else if (columnName === 'EngagementTypes') {
            const query = `SELECT Type FROM Metadata_Engagement`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'Industries') {
            const query = `SELECT Type FROM Metadata_Industry`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'SkillRole') {
            const query = `SELECT Type FROM Metadata_SkillRole`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'SkillArea') {
            const query = `SELECT Type FROM Metadata_SkillArea`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'Platforms') {
            const query = `SELECT Type FROM Metadata_Technology WHERE TypeCode = 'Platforms'`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))

        } else if (columnName === 'Databases') {
            const query = `SELECT Type FROM Metadata_Technology WHERE TypeCode = 'Databases'`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'DataIntegrationTools') {
            const query = `SELECT Type FROM Metadata_Technology WHERE TypeCode = 'Data Integration Tools'`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'BIAnalyticTools') {
            const query = `SELECT Type FROM Metadata_Technology WHERE TypeCode = 'BI/Analytic Tools'`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (columnName === 'DevelopmentToolsLanguages') {
            const query = `SELECT Type FROM Metadata_Technology WHERE TypeCode = 'Development Tools & Languages'`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }))
        } else if (
            columnName === 'CompetencyLevel' ||
            columnName === 'PlatformsCompetencyLevel' ||
            columnName === 'DatabaseCompetencyLevel' ||
            columnName === 'DataIntegrationCompetencyLevel' ||
            columnName === 'BIAnalyticCompetencyLevel' ||
            columnName === 'DevelopmentToolsCompetencyLevel'
        ) {
            const query = `SELECT Type FROM Metadata_CompetencyLevel`
            const result = await conn.query(query);
            metadatas = result.map(row => ({ value: row.Type, label: row.Type }));
            // metadatas = result.map(row => ({ value: row.Type.split('-')[0].trim(), label: row.Type }));
        }

        // once metadatas are selected, send back to frontend
        res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json({ metadatas })

    } catch (error) {
        res
            .status(500)
            .json({ error: `Error creating query: ${err.message}` });
    }

}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

let getRecords;

const createTableQuery = async (req, res, next) => {
    const {
        selectedTable, selectedColumns,
        filterValues, outerConditionState, order, sortedColumn, limit
    } = req.body

    try {
        const conn = await connection;

        let result = `SELECT DISTINCT`;

        let secondaryColumns = [] // this will hold the columns that is filtered
        let conditions = []; // this will hold all the base conditions

        // MAIN COLUMNS: map columns that will be selected to display 
        const mainColumns = selectedColumns.toString().split(',');
        const mappedMainColumns = mainColumns
            .map((col) => `${selectedTable}.${col}`)
            .join(', ')

        if (limit !== '') {
            result += ` TOP ${limit}`
        }

        // * FIRST IF: If there's one filter
        if (filterValues.length === 1) {
            console.log(`FIRST IF: If there's one filter`)

            console.log('test:', filterValues.length)
            console.log(`filterValues.length`, filterValues[0].innerFilters)

            // TODO: No selected filter, only table and column
            if (filterValues[0].innerFilters[0].selectedFilterTable === '' &&
                filterValues[0].innerFilters[0].selectedColumn === '' &&
                filterValues[0].innerFilters[0].operator === '' &&
                filterValues[0].innerFilters[0].inputValue === '') {

                console.log(`No selected filter, only table and column`)

                result += ` ${selectedColumns} FROM ${selectedTable}`;
                getRecords = await conn.query(result);
                console.log('result, ', result)

            }
            // TODO: Only one filter was selected
            else {
                console.log(`Only one filter was selected`)

                filterValues[0].condition.pop() // remove the default last condition AND
                let innerStateLength = filterValues[0].condition.length; // length of the condition

                // map out all the values by keys inside the innerfilter
                const selectedFilterTables = filterValues[0].innerFilters.map((filterValue) => filterValue.selectedFilterTable);
                const selectedFilterColumns = filterValues[0].innerFilters.map((filterValue) => filterValue.selectedColumn);
                const operators = filterValues[0].innerFilters.map((filterValue) => filterValue.operator)
                const inputValues = filterValues[0].innerFilters.map((filterValue) => filterValue.inputValue)
                console.log(`selectedFilterColumns`, selectedFilterColumns)

                for (let i = 0; i < selectedFilterColumns.length; i++) {
                    let filterColumn = `${selectedFilterTables[i]}.${selectedFilterColumns[i]}`; // columns ex. Engagements.EngagementTypes
                    let columnAlias;
                    let condition;

                    if (filterColumn === 'ConsultantInfo.YearsITExperience') {
                        condition = `(${filterColumn} ${operators[i]} ${inputValues[i]})`; // join the condition ex. Engagements.CompetencyLevel = '5 - Expert' IF NUM

                    } else {
                        condition = `(${filterColumn} ${operators[i]} '${inputValues[i]}')`; // join the condition ex. Engagements.CompetencyLevel = '5 - Expert' IF STRING
                    }

                    // create alias for similar column names
                    if (selectedFilterColumns[i] === 'CompetencyLevel') {
                        columnAlias = `${selectedFilterTables[i]}.${selectedFilterColumns[i]} AS ${selectedFilterTables[i]}${selectedFilterColumns[i]}`
                        secondaryColumns.push(columnAlias)
                    } else {
                        secondaryColumns.push(filterColumn)
                    }

                    conditions.push(condition);
                }

                // if more than one selected innerfilter
                if (filterValues[0].condition.length > 0) {

                    const finalFilterColumns = [... new Set(secondaryColumns)]
                    const finalFilterTable = [... new Set(selectedFilterTables)]

                    if (finalFilterTable.includes(selectedTable)) {
                        const index = finalFilterTable.indexOf(selectedTable);
                        finalFilterTable.splice(index, 1);

                        result += ` ${mappedMainColumns}, ${finalFilterColumns} FROM ${selectedTable} WHERE `

                    } else {
                        result += ` ${mappedMainColumns}, ${finalFilterColumns} FROM ${selectedTable} INNER JOIN ${finalFilterTable} ON ${selectedTable}.ExternalEmployeeID = ${finalFilterTable}.ExternalEmployeeID WHERE `
                    }
                    for (let i = 0; i < conditions.length; i++) {

                        if (i < innerStateLength) {
                            result += `${conditions[i]} ${filterValues[0].condition[i]} `;
                        } else {
                            result += `${conditions[i]}`;

                        }
                    }

                    // if only one selected innerfilter
                } else {

                    const finalFilterColumns = [... new Set(secondaryColumns)]
                    let finalFilterTable = [... new Set(selectedFilterTables)]

                    if (finalFilterTable.includes(selectedTable)) {
                        const index = finalFilterTable.indexOf(selectedTable);
                        finalFilterTable.splice(index, 1);

                        result += ` ${mappedMainColumns}, ${finalFilterColumns} FROM ${selectedTable} WHERE ${conditions}`;

                    } else {
                        result += ` ${mappedMainColumns}, ${finalFilterColumns} FROM ${selectedTable} INNER JOIN ${finalFilterTable} ON ${selectedTable}.ExternalEmployeeID = ${selectedFilterTables}.ExternalEmployeeID WHERE ${conditions}`;
                    }


                }

                console.log('1 OUTER FILTER QUERY: ', result)
            }

        }

        // * 2 OR MORE OUTERFILTER // INNER JOIN
        else {
            // console.log('test 2:', filterValues.length)

            outerConditionState.pop() // remove the last default AND condition at the end of OUTER CONDITION
            const finalSelectedFilterTables = [];
            const groupedConditions = []
            const tableConditions = [];

            console.log('outerConditionState:: ', outerConditionState)

            for (let i = 0; i < filterValues.length; i++) {
                const innerFilters = filterValues[i].innerFilters;
                const innerConditions = filterValues[i].condition;

                let currentCondition = '';
                let logicalOperator = '';

                for (let j = 0; j < innerFilters.length; j++) {
                    const selectedFilterTable = innerFilters[j].selectedFilterTable;
                    finalSelectedFilterTables.push(selectedFilterTable)
                    const selectedFilterColumn = innerFilters[j].selectedColumn;
                    const operator = innerFilters[j].operator;
                    const inputValue = innerFilters[j].inputValue;

                    const filterColumn = `${selectedFilterTable}.${selectedFilterColumn}`;
                    // const condition = `(${ filterColumn } ${ operator } '${inputValue}')`;

                    let condition;
                    let columnAlias;

                    if (filterColumn === 'ConsultantInfo.YearsITExperience') {
                        condition = `(${filterColumn} ${operator} ${inputValue})`; // join the condition ex. Engagements.CompetencyLevel = '5 - Expert'
                        // console.log('nisulod sa years it experience na part:')

                    } else {
                        condition = `(${filterColumn} ${operator} '${inputValue}')`; // join the condition ex. Engagements.CompetencyLevel = '5 - Expert'
                        // console.log('nisulod sa mga string na part')
                    }

                    // create alias for similar column names
                    if (selectedFilterColumn === 'CompetencyLevel') {
                        columnAlias = `${selectedFilterTable}.${selectedFilterColumn} AS ${selectedFilterTable}${selectedFilterColumn}`
                        secondaryColumns.push(columnAlias)
                    } else {
                        secondaryColumns.push(filterColumn)
                    }

                    if (currentCondition.length > 0) {
                        currentCondition += ` ${logicalOperator} `;
                    }
                    currentCondition += condition;

                    // save the logical operator for the next condition
                    logicalOperator = innerConditions[j];
                }

                // add the current condition to the corresponding table
                const selectedFilterTable = innerFilters[0].selectedFilterTable;

                if (!tableConditions[selectedFilterTable]) {
                    tableConditions[selectedFilterTable] = '';
                }

                if (tableConditions[selectedFilterTable].length > 0) {
                    tableConditions[selectedFilterTable] += ` ${innerConditions[0]} `;
                }
                tableConditions[selectedFilterTable] += `(${currentCondition})`;

                tableConditions[i] = `(${currentCondition})`;

                groupedConditions.push(tableConditions)
            }

            if (outerConditionState.length > 0) {
                const finalConditions = Object.values(tableConditions);
                const finalFilterColumns = [... new Set(secondaryColumns)];
                const finalFilterTable = [... new Set(finalSelectedFilterTables)];

                // console.log('tableConditions: ', tableConditions)
                // console.log('finalConditions', finalConditions)
                // console.log('finalFilterColumns', finalFilterColumns)
                // console.log('finalFilterTable', finalFilterTable)

                result += ` ${mappedMainColumns}, ${finalFilterColumns} `

                let openingParentheses = "";
                let closingParentheses = "";
                let partialResult = ''

                if (finalFilterTable.includes(selectedTable)) {
                    const index = finalFilterTable.indexOf(selectedTable);
                    finalFilterTable.splice(index, 1);
                }

                for (let i = 0; i < finalFilterTable.length; i++) {
                    if (i > 0) {
                        openingParentheses += "(";
                    }

                    if (i < finalFilterTable.length - 1) {
                        partialResult += `INNER JOIN ${finalFilterTable[i]} ON ${selectedTable}.ExternalEmployeeID = ${finalFilterTable[i]}.ExternalEmployeeID) `;
                        closingParentheses += ")";
                    } else {
                        partialResult += `INNER JOIN ${finalFilterTable[i]} ON ${selectedTable}.ExternalEmployeeID = ${finalFilterTable[i]}.ExternalEmployeeID `;
                        closingParentheses += ")";
                    }
                }

                let conditionResult = '';

                for (let i = 0; i <= outerConditionState.length; i++) {
                    if (i < outerConditionState.length) {
                        conditionResult += `${finalConditions[i]} ${outerConditionState[i]} `
                        console.log(`if ${i}: `, conditionResult)
                    } else {
                        conditionResult += `${finalConditions[i]} `;
                        console.log(`else ${i}: `, conditionResult)
                    }
                }

                const finalQuery = result + `FROM ` + openingParentheses + `${selectedTable} ` + partialResult + `WHERE` + conditionResult
                result = finalQuery;

            }

            console.log('MORE THAN 1 OUTER FILTER QUERY: ', result)

        }

        if (sortedColumn !== '') {
            const mainColumnsArray = mappedMainColumns.split(',').map((column) => column.trim());

            const holdAllColumns = [...mainColumnsArray, ...secondaryColumns]

            const matchedString = holdAllColumns.find(str => {
                const columnName = sortedColumn.value;
                return str.includes(columnName);
            });

            if (matchedString) {
                const extractedColumnName = matchedString.split(' AS ')[0];
                result += ` ORDER BY ${extractedColumnName} ${order}`
                getRecords = await conn.query(result);
            }

        } else {
            getRecords = await conn.query(result);
        }

        console.log('FINAL QUERY: ', result)

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json([getRecords, result]);


    } catch (error) {
        throw new Error(`Failed to execute query that will get the tables and columns: ${error.message} `)
    }
}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------


const download = async (req, res, next) => {
    try {
        const filePath = path.join('uploads', 'Consultants_DB.accdb');


        if (fs.existsSync(filePath)) {
            // Set appropriate headers for the response
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'filename.ext'); // Update 'filename.ext' with the actual file name and extension

            // Create a read stream from the file
            const fileStream = fs.createReadStream(filePath);

            // Pipe the file stream to the response object
            fileStream.pipe(res);
        } else {

            res
                .status(404)
                .send('File not found');
        }

    } catch (error) {
        throw new Error(`Failed to download file: ${error.message} `)
    }
}



// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const deleteImport = async (req, res, next) => {
    try {
        const filePath = path.join('import', 'imported-excel.xlsx');

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                res.status(500).json({ error: 'Failed to delete file' });
            } else {
                console.log('File deleted successfully');
                res.status(200).json({ message: 'File deleted successfully' });
            }
        });

    } catch (error) {
        throw new Error(`Error deleting the import: ${error.message} `)

    }
}


// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const insertNewImport = async (req, res, next) => {
    try {

        const conn = await connection;

        // initialized the variable for executing insert into query
        let executeQuery;

        const filePath = 'import/imported-excel.xlsx';

        // define worksheet name and their corresponding table names
        const workbook = xlsx.readFile(filePath);
        const worksheetNames = workbook.SheetNames;

        // Set the default value for empty cells to an empty string
        const options = {
            defval: ''
        };

        const tableNames = await conn.tables(null, null, null, 'TABLE');
        const tables = tableNames
            .filter(table => table.TABLE_TYPE === 'TABLE' && !table.TABLE_NAME.startsWith('~') && !table.TABLE_NAME.startsWith('Metadata'))
            .map(table => table.TABLE_NAME)

        // console.log('tables: ', tables)
        const worksheetData = {}; // array of object

        // instantiate 
        let FirstName;
        let LastName;
        let ExternalEmployeeID;

        // loop to clean the data
        for (let worksheetName of worksheetNames) {
            const trimmedWorksheetName = worksheetName.replace(/\s/g, '');

            for (let tableName of tables) {
                if (tableName === trimmedWorksheetName) {
                    const worksheet = workbook.Sheets[worksheetName];
                    const jsonData = xlsx.utils.sheet_to_json(worksheet, options);

                    const cleanedData = jsonData
                        .map(row => {
                            const cleanedRow = {};
                            let isEmptyRow = true;

                            for (const [key, value] of Object.entries(row)) {
                                const cleanedValue = (typeof value === 'string') ? value.trim() : value;
                                cleanedRow[key] = cleanedValue;

                                if (cleanedValue !== '') {
                                    isEmptyRow = false;
                                }
                            }

                            return isEmptyRow ? null : cleanedRow;
                        })
                        .filter(row => row !== null && Object.values(row).some(value => value !== ''));

                    worksheetData[trimmedWorksheetName] = cleanedData;
                }
            }
        }

        // get the names
        if ('ConsultantInfo' in worksheetData) {
            const consultantInfoArray = worksheetData['ConsultantInfo'];

            consultantInfoArray.forEach(consultantInfo => {
                FirstName = consultantInfo['First Name'];
                LastName = consultantInfo['Last Name'];
                ExternalEmployeeID = consultantInfo['APC Employee ID'];

            })
        }

        // inserting happens here
        for (let worksheetName in worksheetData) {
            const dataArray = worksheetData[worksheetName];
            const insertQuery = `INSERT INTO ${worksheetName} `;

            if (dataArray.length > 0) {

                const columns = Object.keys(dataArray[0]);

                if (worksheetName === 'ConsultantInfo') {
                    const values = dataArray
                        .filter(row => Object.values(row).some(value => value !== '')) // Filter out rows with all empty cells
                        .map(row => `(${columns.map(col => `'${row[col]}'`).join(', ')})`);

                    const insertStatement = `${insertQuery} VALUES ${values.join(', ')} `;
                    // console.log('Insert Statement:', insertStatement);
                    executeQuery = await conn.query(insertStatement);
                } else {
                    for (let row of dataArray) {
                        const values = columns.map(col => {
                            const escapedValue = row[col].replace(/'/g, "''"); // Escape single quotes by doubling them
                            return `'${escapedValue}'`;
                        });
                        const insertStatement = `${insertQuery} VALUES('${FirstName}', '${LastName}', '${ExternalEmployeeID}', ${values.join(', ')})`;
                        // console.log('Insert Statement:', insertStatement);
                        executeQuery = await conn.query(insertStatement);
                    }
                }
            }
        }

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({ message: 'Successfully imported the consultants data.' })

    } catch (error) {
        throw new Error(`Error inserting new data in the database: ${error.message} `)
    }
}


// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------


const postBookmark = async (req, res, next) => {

    try {
        const {
            saveQuery, bookmarkTitle, bookmarkDes
        } = req.body

        const conn = await bookmarkDB;

        const timestamp = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const readableDate = timestamp.toLocaleString('en-US', options);

        const queryValue = saveQuery.replace(/'/g, "''"); // Escape single quotes in the query

        const addBookmark = await conn.query(`INSERT INTO bookmark VALUES('${bookmarkTitle}', '${bookmarkDes}', '${queryValue}', '${readableDate}')`);

        await conn.commit();

        res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json({ addBookmark })

    } catch (error) {
        throw new Error(`Error saving the bookmark: ${error.message} `)
    }

}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const getBookmarks = async (req, res, next) => {

    try {

        const conn = await bookmarkDB;

        const bookmarkData = await conn.query(`SELECT * FROM bookmark`)

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(bookmarkData);

    } catch (error) {
        throw new Error(`Error retrieving the bookmarks: ${error.message} `)
    }

}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const createDisplayBookmark = async (req, res, next) => {
    try {
        const {
            selectedQuery
        } = req.body

        const conn = await connection;

        const getRecords = await conn.query(selectedQuery);

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({ getRecords });



    } catch (error) {
        throw new Error(`Error displaying the bookmarks: ${error.message} `)
    }
}

// ! ----------------------------------------------------------------------------------------------------------------------------------------------
// ! ----------------------------------------------------------------------------------------------------------------------------------------------

const deleteBookmark = async (req, res, next) => {

    try {
        const {
            selectedBookmark
        } = req.body

        const conn = await bookmarkDB;

        const bookmarkData = await conn.query(`DELETE * FROM bookmark WHERE Timestamp = '${selectedBookmark}'`)

        res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json(bookmarkData);


    } catch (error) {
        throw new Error(`Error deleting the bookmark ${error.message} `)
    }

}


module.exports = {
    getTables,
    getAllColumns,
    getMetadatas,
    getValues,
    createTableQuery,
    download,
    deleteImport,
    insertNewImport,
    postBookmark,
    getBookmarks,
    createDisplayBookmark,
    deleteBookmark
}
