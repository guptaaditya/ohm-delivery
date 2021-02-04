var express = require('express');
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const controllers = require('./controller');


function serve() {
    app.get('/ohms/:id', controllers.getOhm);
    app.put('/ohms/:id/status/', controllers.updateOhm);

    app.listen(3000, () => console.log('listening on port 3000'));
}

serve();