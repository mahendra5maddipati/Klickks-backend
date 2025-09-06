const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
// const SQLiteStore = require('better-sqlite3-session-store')(session);
const path = require('path');


// using built-in sqlite session store via package above. It's optional; we can fall back to memory store for demo.


app.use(express.json());
app.use(cookieParser());


app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);


// session setup
app.use(
    session({
        name: 'sid',
        secret: 'change_this_secret_in_prod',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
// store: new SQLiteStore({ client: require('better-sqlite3')(path.join(__dirname, 'sessions.db')) })
    })
);


app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));