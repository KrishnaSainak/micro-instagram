
const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3');

// Connect to a database (in this example, a new file-based database)
const db = new sqlite3.Database('instagram.db');

// Define the SQL statement to create a table
const createTableSql = `
    CREATE TABLE IF NOT EXISTS USERS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT NOT NULL,
        PhoneNumber TEXT UNIQUE NOT NULL,
        ADDRESS TEXT NOT NULL,
        POST_COUNT INTEGER NOT NULL
    )
`;

// Execute the SQL statement to create the table
db.run(createTableSql, function (err) {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Table1 created successfully');
});

const createTableSql2 = `
    CREATE TABLE IF NOT EXISTS POSTS (
        POST_id INTEGER PRIMARY KEY AUTOINCREMENT,
        TITLE TEXT NOT NULL,
        DESCRIPTION TEXT NOT NULL,
        IMAGES JSON_ARRAY,
        USER_ID INTEGER NOT NULL,
        FOREIGN KEY(USER_ID) REFERENCES USERS(id)
        
    )
`;

// Execute the SQL statement to create the table
db.run(createTableSql2, function (err) {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Table2 created successfully');
});



const app = express()
app.use(express.json())

dbPath = path.join(__dirname, 'instagram.db')


app.post('/USERS/', async (req, res) => {
    const {Username, PhoneNumber, ADDRESS, POST_COUNT } = req.body;
    const query = `INSERT INTO USERS (Username, PhoneNumber, ADDRESS, POST_COUNT) values (${Username},${PhoneNumber},${ADDRESS},${POST_COUNT});`
    const data = await db.run(query);
    res.status(201).json({ message: 'User created successfully', data });
});

app.post('/POSTS/'),async(req,res)=> {
    const {TITLE,DESCRIPTION,IMAGES,USER_ID} = req.body;
    const query = `INSERT INTO POSTS (TITLE,DESCRIPTION,IMAGES) values (${TITLE},${DESCRIPTION},${IMAGES}) where user_id = ${USER_ID};`;
    const data = await db.run(query);
    res.status(201).json({ message: 'Post created successfully', data });
}

app.get('/USERS/', async (req, res) => {
    const query = `SELECT * FROM USERS ;`;
    const data = await db.get(query);
    if (!data) {
        return res.status(404).json({ message: 'User table not found' });
    }
    res.json(data);
});

app.get('/POSTS/:id', async (req, res) => {
    const user_id = req.params.id;
    const query = `SELECT * FROM POSTS WHERE USER_id = ${user_id}`;
    const data = await db.get(query);
    if (!data) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(data);
})

app.put('/POSTS/:id', async (req, res) => {
    const id = req.params.id;
    const {TITLE, DESCRIPTION, IMAGES} = req.body;
    const query = `UPDATE POSTS SET TITLE = ${TITLE}, DESCRIPTION = ${DESCRIPTION}, IMAGES = ${IMAGES} WHERE POST_id = ${id}`;
    const data = await db.run(query);
    if (!data.changes) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post updated successfully' });
});

app.delete('/POSTS/:id', async (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM POSTS WHERE POST_id = ${id};`;
    const data = await db.run(query);
    if (!data.changes) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000')
})

module.exports = app



 
