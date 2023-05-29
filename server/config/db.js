const odbc = require('odbc');

const connectDB = async () => {
    try {
        const conn = await odbc.connect(process.env.DB_CONNECTION);
        console.log('Connection successful!')
        return conn
    } catch (error) {
        console.log('Connection unsuccessful!')
        console.log(error)
    }

}


module.exports = connectDB;