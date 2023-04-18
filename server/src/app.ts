import express from 'express';
import './database';

const app = express();

app.use(express.json());
app.use('/api', require('./routes/index'));
app.listen(3000);


console.log('Server on port', 3000);
