const fs = require('fs');
const path = require('path');

const tableColumnValidator = (req, res, next) => {
    if (!req.body) {
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`);
        return;
    }

    if (!req.body.selectedTable ||
        req.body.selectedColumns.length === 0
    ) {
        res
            .status(400)
            .setHeader("Content-Type", "text/plain")
            .json({ success: false, message: "Please select a table and columns" })

    } else {
        next();
    }
}


const filterValidator = (req, res, next) => {
    if (!req.body) {
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`);
        return;
    }

    if (req.body.filterValues[0].innerFilters.length === 0) {
        res
            .status(400)
            .setHeader("Content-Type", "text/plain")
            .json({ success: false, message: "Please select a filter" })
    } else {
        next()

    }
}


const queryValidator = (req, res, next) => {
    if (!req.body) {
        res.end(`Request for path: ${req.protocol} and method: ${req.method} is missing payload`);
        return;
    }

    if (req.body.filterValues.length >= 2) {
        let hasInvalidInnerFilter = false; //track invalid innerFilter

        req.body.filterValues.forEach((filterValue) => {
            filterValue.innerFilters.forEach((innerFilter) => {
                if (!innerFilter.selectedFilterTable ||
                    !innerFilter.selectedColumn ||
                    !innerFilter.operator ||
                    !innerFilter.inputValue
                ) {
                    hasInvalidInnerFilter = true;
                }
            });
        });

        if (hasInvalidInnerFilter) {
            res.status(400)
                .setHeader("Content-Type", "text/plain")
                .json({ success: false, message: "Incomplete fields, please select a column, operator and value." });
        } else {
            next(); // proceed to next middleware if all inner filters are valid
        }
    } else {
        next();
    }
}

const importExists = (req, res, next) => {
    const filePath = path.join('import', 'imported-excel.xlsx');

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) { // File does not exist
            return res
                .status(400)
                .setHeader("Content-Type", "text/plain")
                .json({ success: false, message: "No imported file found." });

        } else { // File exists, proceed to the next middleware
            next();
        }


    });
};

const databaseFileValidator = (req, res, next) => {

    if (req.files.file.mimetype === 'application/msaccess') {
        next();
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Invalid file format: Only (.accdb) file is allowed." });
    }

}


const excelFileValidator = (req, res, next) => {

    if (req.files.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // File is valid, proceed to the next middleware
        next();

    } else {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid file format: Only (.xlsx) file is allowed.' });
    }
}


module.exports = {
    tableColumnValidator,
    filterValidator,
    queryValidator,
    importExists,
    databaseFileValidator,
    excelFileValidator
}