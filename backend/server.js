require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', require('./routes/patient.js'));
app.use('/', require('./routes/admin.js'));
app.use('/', require('./routes/doctor.js'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server connected on port ${PORT}!!!`);
});
