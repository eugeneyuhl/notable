const express = require('express');
const path = require('path');

const app = express();
// Body Parser Middle for Post request. (ex. members.js POST request)
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

// Routing api calls.
app.use('/api/doctors', require('./routes/api/doctors'));
app.use('api/demo', require('./routes/api/demo'));

// Set static folder (Choose this or Homepage Route)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));