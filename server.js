const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/status', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/info', (req, res) => {
  var loginSuccess = '';

  console.log(req.body);
  
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    databaseConnection.query("SELECT * FROM login_information WHERE username = '" + req.body.username + "'", function(err,result,fields) {
      if (err) throw err;
      //console.log(result[0].username);
      //console.log(result[0].password);
      if (result.length != 0) {
        if ((req.body.username == result[0].username) && (req.body.password == result[0].password)) {
          console.log("Username and password match");
          res.send(result[0].role);
        } else {
          res.send('failed');
        }  
      } else {
        res.send('failed');
      }
    });
  });
});

app.post('/api/login', (req, res) => {
  console.log(req.body);
  res.send(
    `Username: ${req.body.post}`,
  );
});

app.post('/api/submitcourseinfo', (req, res) => {
  console.log(req.body);
  
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body.targetClass);
    databaseConnection.query("INSERT INTO course_information (course_creator, course_title, course_description, target_class_id, complete_in_order, hide_course) VALUES ('" + req.body.creator + "', '" + req.body.title + "', '" + req.body.description + "', '" + req.body.targetClass + "', '" + req.body.order + "', '" + req.body.hide + "')", function(err,result,fields) {
      if (err) throw err;
      res.send('successful insertion');
    });
  });
});

app.post('/api/updatecourseinfo', (req, res) => {
  console.log(req.body);
  
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    databaseConnection.query("UPDATE course_information SET course_title = '" + req.body.title + "', course_description = '" + req.body.description + "', target_class_id = '" + req.body.targetClass + "', complete_in_order = '" + req.body.order + "', hide_course = '" + req.body.hide + "' WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      res.send('successful update');
    });
  });
});

app.post('/api/getcourseinfo', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT * FROM course_information WHERE course_creator = '" + req.body.creator + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var rows = new Array(result.length);
        var test = {};
       

        for (let i=0; i < result.length; i++) {
          console.log("TEST: " + result[i].course_title);

          var row = [result[i].course_id, result[i].course_creator, result[i].course_title, result[i].course_description, result[i].target_class_id];
          rows[i] = row;

          /*var keyName = i;
          test[keyName] = {
            id : result[i].course_id, 
            creator : result[i].course_creator, 
            title : result[i].course_title, 
            description : result[i].course_description, 
            targetClass : result[i].target_class_id
          };*/
        }

        //res.send(test);
        res.send(rows);
        //res.send(result);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/getspecificcourseinfo', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT * FROM course_information WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var rows = new Array(result.length);
        var test = {};
       

        for (let i=0; i < result.length; i++) {
          console.log("TEST: " + result[i].course_title);

          var row = [result[i].course_id, result[i].course_creator, result[i].course_title, result[i].course_description, result[i].target_class_id];
          rows[i] = row;

          /*var keyName = i;
          test[keyName] = {
            id : result[i].course_id, 
            creator : result[i].course_creator, 
            title : result[i].course_title, 
            description : result[i].course_description, 
            targetClass : result[i].target_class_id
          };*/
        }

        //res.send(test);
        res.send(rows);
        //res.send(result);
      } else {
        //res.send('failed');
      }
    });
  });
});


app.post('/api/getteacherclass', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT class_id FROM course_teachers WHERE username = '" + req.body.teacherUsername + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var listOfIds = new Array(result.length);
       
        for (let i=0; i < result.length; i++) {
          console.log("TEST: " + result[i].class_id);
          listOfIds[i] = result[i].class_id;
        }

        res.send(listOfIds);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/getclassstudents', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);

    var id = req.body.className.toLowerCase();
    databaseConnection.query("SELECT * FROM " + id + "_students", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var rows = new Array(result.length);
        var test = {};
       

        for (let i=0; i < result.length; i++) {
          console.log("TEST: " + result[i].student_id);

          var row = [result[i].student_id, result[i].first_name, result[i].last_name];
          rows[i] = row;
        }

        for (let i=0; i < result.length; i++) {
          console.log(rows);
        }

        res.send(rows);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/uploadtutorialcontent', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);

    databaseConnection.query("INSERT INTO tutorial_content (course_id, course_creator, content_title, content_type, content) VALUES ('" + req.body.id + "', '" + req.body.creator + "', '" + req.body.title + "', '" + req.body.type + "', '" + req.body.content + "')", function(err,result,fields) {
      if (err) throw err;
      res.send("successful insertion");
    });
  });
});

app.post('/api/createcontentfile', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var fs = require('fs');
  var fileName = '';
  var id;
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);

    databaseConnection.query("SELECT content_id FROM tutorial_content WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      //console.log(result[0].content_id);

      const directory = "./tutorial_content/";
      id = result[0].content_id + "";
      fileName = id + '_' + req.body.title + '.txt';

      fs.writeFile(directory + fileName, "" + req.body.contentData + "", function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("File created");
      });
    });
  });
});

app.post('/api/retrievecontentid', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT content_id FROM tutorial_content WHERE course_id = '" + req.body.idToGet + "' AND content_title = '" + req.body.title + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {
        console.log(result);
        var id = result[0].content_id;
        res.send(id + "");
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/updatetutorialcontent', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);

    databaseConnection.query("UPDATE tutorial_content SET content_title = '" + req.body.title + "',  content = '" + req.body.content + "' WHERE course_id = '" + req.body.id + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      res.send("successful update");
    });
  });
});

/*app.post('/api/getcoursecontent', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT content_type, content FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var rows = new Array(result.length);
        var test = {};
       

        for (let i=0; i < result.length; i++) {
          console.log("TEST: " + result[i].course_title);

          var row = [result[i].course_id, result[i].course_creator, result[i].course_title, result[i].course_description, result[i].target_class_id];
          rows[i] = row;
        }

        res.send(rows);
      } else {
        //res.send('failed');
      }
    });
  });
});*/

app.post('/api/getallcoursetutorialcontent', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT content_title, content_type, content, content_order_position FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        /*console.log(result);
        var rows = new Array(result.length);
        //var data = new Array();
        for (let i=0; i < result.length; i++) {
          var row = [result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].content];
          rows[i] = row;
          //data.push(result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].content);
        }*/

        var data = [[result[0].content_order_position, result[0].content_title, result[0].content_type, result[0].content]];

        for (let i=1; i < result.length; i++) {
          var row = [result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].content];
          data.push(row);
        }

    
        res.send(data);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/getspecifictutorialcontent', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  //var fs = require('fs');
  //const fileName = "./client/src/tutorial_content/testing.txt";
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT content FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "' AND content_title = '" + req.body.title + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var rows = new Array(result.length);
        var test = {};
       

        for (let i=0; i < result.length; i++) {
          console.log("TEST: " + result[i].content);

          var row = [result[i].content];
          rows[i] = row;
        }

        //var data = fs.readFileSync(fileName);
        //console.log(data);

        res.send(result[0].content);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/getcontentfromfile', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var fs = require('fs');
  const directory = "./tutorial_content/";
  var fileName = '';
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT content_id, content_title FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "' AND content_title = '" + req.body.title + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {
        console.log(result);

        id = result[0].content_id;
        title = result[0].content_title;
        fileName = id + '_' + req.body.title + '.txt';

        var data = fs.readFileSync(directory + fileName);
        console.log(data);

        res.send(data);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.post('/api/getcoursecontentinfo', (req, res) => {

  console.log(req.body);
  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    console.log(req.body);
    databaseConnection.query("SELECT content_order_position, content_title, content_type FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var rows = new Array(result.length);
        var test = {};
       

        for (let i=0; i < result.length; i++) {
          var row = [result[i].content_order_position, result[i].content_title, result[i].content_type];
          rows[i] = row;
        }

        res.send(rows);
      } else {
        //res.send('failed');
      }
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));