const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
require('dotenv').config();

app.use(express.static(path.join(__dirname, '/')))

router.get('*',(req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
  });
//add the router
app.use('/', router);
const PORT = process.env.PORT || 8080;
app.listen(PORT);