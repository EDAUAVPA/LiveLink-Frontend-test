const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

app.set('port', process.env.PORT || 3500);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.json({message: 'hello world'});
})

app.use('/api/user', require('./routes/user.js'));
app.use('/api/trackRecord', require('./routes/trackRecord.js'));


app.use(express.static(path.join(__dirname, '/public')));


app.listen(app.get('port'), () => {
    console.log(`Servidor conectado correctamente a http://localhost:${app.get('port')}`)
});
