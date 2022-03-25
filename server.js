const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// verifies that the login details entered are valid
app.post('/api/verifylogindetails', (req, res) => {
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
    console.log("Verifying login details");
    databaseConnection.query("SELECT * FROM login_information WHERE username = '" + req.body.username + "'", function(err,result,fields) {
      if (err) throw err;

      if (result.length != 0) {
        if ((req.body.username == result[0].username) && (req.body.password == result[0].password)) {
          console.log("Username and password match");
          res.send([result[0].user_id, result[0].role]);
        } else {
          res.send('failed');
        }  
      } else {
        res.send('failed');
      }
    });
  });
});

// inserts the information for a newly created course into the database
app.post('/api/submitcourseinformation', (req, res) => {
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
    console.log("Inserting course information");
    console.log(req.body.targetClass);
    databaseConnection.query("INSERT INTO course_information (course_creator, course_title, course_description, target_class_id, complete_in_order, hide_course) VALUES ('" + req.body.creator + "', '" + req.body.title + "', '" + req.body.description + "', '" + req.body.targetClass + "', '" + req.body.order + "', '" + req.body.hide + "')", function(err,result,fields) {
      if (err) throw err;
      res.send('successful insertion');
    });
  });
});

// gets the details of all courses created by a specific teacher
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
    console.log("Retrieving details for created courses");
    console.log(req.body);
    databaseConnection.query("SELECT * FROM course_information WHERE course_creator = '" + req.body.creator + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {
        console.log(result);

        var coursesInformation = [[result[0].course_id, result[0].course_title, result[0].course_description, result[0].target_class_id, result[0].last_modified]];

        for (let i=1; i < result.length; i++) {
          var information = [result[i].course_id, result[i].course_title, result[i].course_description, result[i].target_class_id, result[i].last_modified];
          coursesInformation[i] = information;
        }

        res.send(coursesInformation);
      } else {
        var failed = [['failed']];
        res.send(failed);
      }
    });
  });
});

// deletes a specific course
app.post('/api/deletecourse', (req, res) => {

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
    console.log("Retrieving details for created courses");
    console.log(req.body);
    databaseConnection.query("DELETE FROM course_information WHERE course_id = '" + req.body.courseId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

// deletes a specific piece of tutorial content
app.post('/api/deletetutorialcontent', (req, res) => {

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
    console.log("Retrieving details for created courses");
    console.log(req.body);
    databaseConnection.query("DELETE FROM tutorial_content WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

// deletes the answers for a specific piece of tutorial content
app.post('/api/deleteexerciseanswers', (req, res) => {

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
    console.log("Retrieving details for created courses");
    console.log(req.body);
    databaseConnection.query("DELETE FROM multiple_choice_exercises WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

// gets the details of a specific course
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
    console.log("Retrieving specific course information");
    console.log(req.body);
    databaseConnection.query("SELECT course_title, course_description, target_class_id, course_creator FROM course_information WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
        if (result.length != 0) {       
          var courseInformation = [result[0].course_title, result[0].course_description, result[0].target_class_id, result[0].course_creator];

          res.send(courseInformation);
        } else {
          var failed = ['failed'];
          res.send(failed);
        }
    });
  });
});

// updates the information for a specific course
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
    console.log("Updating course information");
    databaseConnection.query("UPDATE course_information SET course_title = '" + req.body.title + "', course_description = '" + req.body.description + "', target_class_id = '" + req.body.targetClass + "', complete_in_order = '" + req.body.order + "', hide_course = '" + req.body.hide + "' WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      res.send('successful update');
    });
  });
});

// gets the classes that are taught by a specific teacher
app.post('/api/getteacherclasses', (req, res) => {

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
        var listOfClasses = []
        for (let i=0; i < result.length; i++) {
          listOfClasses.push(result[i].class_id);
        }

        res.send(listOfClasses);
      } else {
        //res.send('failed');
      }
    });
  });
});

// gets the information about all students a class
app.post('/api/getclassstudents', (req, res) => {

  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Getting students in class");
    console.log(req.body);

    databaseConnection.query("SELECT student_school_id, first_name, last_name FROM students WHERE student_class = '" + req.body.classId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        var studentInformation = [[result[0].student_school_id, result[0].first_name, result[0].last_name]];

        for (let i=1; i < result.length; i++) {
          var information = [result[i].student_school_id, result[i].first_name, result[i].last_name];
          studentInformation.push(information);
        }

        res.send(studentInformation);
      } else {
        var failed = [['failed']];
        res.send(failed);
      }
    });
  });
});

// gets the class that a specific student is part of
app.post('/api/getstudentclass', (req, res) => {

  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Getting student class");
    console.log(req.body);

    databaseConnection.query("SELECT student_class FROM students WHERE username = '" + req.body.username + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        res.send(result[0].student_class);
      } else {
        //res.send('failed');
      }
    });
  });
});

// gets the courses made for a specific student's class
app.post('/api/getstudentcourses', (req, res) => {

  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Getting student courses");
    console.log(req.body);
    databaseConnection.query("SELECT course_information.course_id, course_information.course_title, course_information.course_description, course_information.hide_course, course_information.complete_in_order, students.student_class FROM course_information INNER JOIN students ON students.student_class=course_information.target_class_id WHERE students.student_school_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var courseInformation =  [[result[0].course_id, result[0].course_title, result[0].course_description, result[0].hide_course, result[0].complete_in_order, result[0].student_class]];
       
        for (let i=1; i < result.length; i++) {
          var data = [result[i].course_id, result[i].course_title, result[i].course_description, result[i].hide_course, result[i].complete_in_order, result[i].student_class];
          courseInformation.push(data);
        }

        res.send(courseInformation);
      } else {
        //res.send('failed');
      }
    });
  });
});

// inserts information about a peice of tutorial content into the database
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

    databaseConnection.query("INSERT INTO tutorial_content (course_id, course_creator, content_title, content_type, content, content_order_position) VALUES ('" + req.body.id + "', '" + req.body.creator + "', '" + req.body.title + "', '" + req.body.type + "', '" + req.body.content + "', '" + req.body.orderPosition + "')", function(err,result,fields) {
      if (err) throw err;
      res.send("successful insertion");
    });
  });
});

// inserts information about a peice of exercise content into the database
app.post('/api/uploadexercisecontent', (req, res) => {

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

    databaseConnection.query("INSERT INTO multiple_choice_exercises (content_id, course_id, course_creator, content_type, exercise_task, answer_1, answer_2, answer_3, answer_4, correct_answer) VALUES ('" + req.body.contentId + "', '" + req.body.courseId + "', '" + req.body.creator + "', '" + req.body.type + "', '" + req.body.task + "', '" + req.body.answer1 + "', '" + req.body.answer2 + "', '" + req.body.answer3 + "', '" + req.body.answer4 + "', '" + req.body.correct + "')", function(err,result,fields) {
      if (err) throw err;
      res.send("successful insertion");
    });
  });
});

// gets the content id for a specific piece of tutorial content
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
        console.log("WHYYYYYYYYYYYYYYYYYYY");
        console.log(result);
        var id = result[0].content_id;
        res.send(id + "");
      } else {
        //res.send('failed');
      }
    });
  });
});

// updates the information about a specific piece of tutorial content in the database
app.post('/api/updatetutorialcontent', (req, res) => {

  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Updating tutorial content");
    console.log(req.body);

    databaseConnection.query("UPDATE tutorial_content SET content_title = '" + req.body.title + "',  content = '" + req.body.content + "' WHERE course_id = '" + req.body.courseId + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      res.send("successful update");
    });
  });
});

// updates the information about a specific piece of exercise content in the database
app.post('/api/updateexerciseanswers', (req, res) => {

  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Updating exercise answers");
    console.log(req.body);

    databaseConnection.query("UPDATE multiple_choice_exercises SET exercise_task = '" + req.body.task + "',  answer_1 = '" + req.body.answer1 + "', answer_2 = '" + req.body.answer2 + "',  answer_3 = '" + req.body.answer3 + "',  answer_4 = '" + req.body.answer4 + "', correct_answer = '" + req.body.correctAnswer + "' WHERE course_id = '" + req.body.courseId + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      res.send("successful update");
    });
  });
});

// inserts information about an assignment into the database
app.post('/api/uploadassignmentsubmission', (req, res) => {

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

    databaseConnection.query("INSERT INTO assignment_submissions (student_id, username, course_id, assignment_content_id, assignment_submission) VALUES ('" + req.body.studentId + "', '" + req.body.username + "', '" + req.body.courseId + "', '" + req.body.contentId + "', '" + req.body.submission + "')", function(err,result,fields) {
      if (err) throw err;
      res.send("successful insertion");
    });
  });
});


// gets information about a specific student
app.post('/api/getspecificstudentinformation', (req, res) => {

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
    databaseConnection.query("SELECT first_name, last_name, student_class FROM students WHERE student_school_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        var data = [result[0].first_name, result[0].last_name, result[0].student_class];
        
        res.send(data);
      } else {
        var failed = ['failed'];
        res.send(failed);
      }
    });
  });
});

// gets assignment submissions for a specific student
app.post('/api/getstudentassignmentsubmissions', (req, res) => {

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
    databaseConnection.query("SELECT tutorial_content.content_title, assignment_submissions.assignment_content_id, course_information.course_title FROM assignment_submissions INNER JOIN tutorial_content ON tutorial_content.content_id=assignment_submissions.assignment_content_id INNER JOIN course_information ON tutorial_content.course_id=course_information.course_id WHERE assignment_submissions.student_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {
        console.log(result);

        var data = [[result[0].course_title, result[0].content_title, result[0].assignment_content_id]];

        for (let i=1; i < result.length; i++) {
          var row = [result[0].course_title, result[0].content_title, result[0].assignment_content_id];
          data.push(row);
        }
        
        res.send(data);
      } else {
        //res.send('failed');
      }
    });
  });
});

// gets a specific assignment submission for a specific student
app.post('/api/getspecificstudentassignmentsubmission', (req, res) => {

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
    databaseConnection.query("SELECT course_information.course_title, tutorial_content.content_title, assignment_submissions.assignment_submission FROM assignment_submissions INNER JOIN tutorial_content ON tutorial_content.content_id=assignment_submissions.assignment_content_id INNER JOIN course_information ON course_information.course_id=tutorial_content.course_id WHERE student_id = '" + req.body.studentId + "' AND assignment_content_id = '" + req.body.assignmentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        var data = [result[0].course_title, result[0].content_title, result[0].assignment_submission];
  
        res.send(data);
      } else {
        var failed= ['failed'];
        res.send(failed);
      }
    });
  });
});

// upload feedback for a student based on an assignment submission
app.post('/api/uploadteacherfeedback', (req, res) => {

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
    console.log("Inserting teacher feedback");
    console.log(req.body);
    databaseConnection.query("INSERT INTO teacher_feedback (assignment_id, student_id, feedback) VALUES ('" + req.body.assignmentId + "', '" + req.body.studentId + "', '" + req.body.feedback + "')", function(err,result,fields) {
      if (err) throw err;
      res.send('successful insertion');
    });
  });
});

// updates feedback for a student based on an assignment submission
app.post('/api/updateteacherfeedback', (req, res) => {

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
    console.log("Updating teacher feedback");
    console.log(req.body);
    databaseConnection.query("UPDATE teacher_feedback SET feedback = '" + req.body.feedback + "' WHERE assignment_id = '" + req.body.assignmentId + "' AND student_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) throw err;
      res.send('successful update');
    });
  });
});

// gets feedback on an assignment for a specific student
app.post('/api/getteacherfeedback', (req, res) => {

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
    console.log("Getting teacher feedback");
    console.log(req.body);
    databaseConnection.query("SELECT feedback FROM teacher_feedback WHERE student_id = '" + req.body.studentId + "' AND assignment_id = '" + req.body.assignmentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        var data = [result[0].feedback];
        console.log(data);
  
        res.send(data);
      } else {
        var failed= ['failed'];
        res.send(failed);
      }
    });
  });
});

// gets all of the tutorial content that is part of a specific course
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
    databaseConnection.query("SELECT content_id, content_title, content_type, content, content_order_position FROM tutorial_content WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        var data = [[result[0].content_order_position, result[0].content_title, result[0].content_type, result[0].content, result[0].content_id]];

        for (let i=1; i < result.length; i++) {
          var row = [result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].content, result[i].content_id];
          data.push(row);
        }
        
        res.send(data);
      } else {
        //res.send('failed');
      }
    });
  });
});

// gets the answers for a piece of multiple choice exercise content
app.post('/api/getexerciseanswers', (req, res) => {

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
    databaseConnection.query("SELECT answer_1, answer_2, answer_3, answer_4, correct_answer FROM multiple_choice_exercises WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        var data = [result[0].answer_1, result[0].answer_2, result[0].answer_3, result[0].answer_4, result[0].correct_answer];
    
        res.send(data);
      } else {
        //res.send('failed');
      }
    });
  });
});

// gets the answers for a piece of fill in the gap exercise content
app.post('/api/getgapexerciseanswers', (req, res) => {

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
    databaseConnection.query("SELECT answer_1, correct_answer FROM multiple_choice_exercises WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        //var data = [result[0].answer_1, result[0].correct_answer];
        console.log(result[0].correct_answer);
        res.send(result[0].correct_answer);
      } else {
        //res.send('failed');
      }
    });
  });
});

// gets a specific piece of tutorial content
app.post('/api/getspecifictutorialcontent', (req, res) => {

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
    databaseConnection.query("SELECT content_title, content FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        
      var contentInformation = [result[0].content_title, result[0].content]

        res.send(contentInformation);
      } else {
        var failed = ['failed']
        res.send(failed);
      }
    });
  });
});

// gets the information about pieces of content that are part of a specific course
app.post('/api/getcoursecontentinfo', (req, res) => {

  var mysql = require('mysql');
  var databaseConnection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  databaseConnection.connect(function(err) {
    if (err) throw err;
    console.log("Getting course content information");
    console.log(req.body);
    databaseConnection.query("SELECT content_order_position, content_title, content_type, last_modified, content_id FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) throw err;
      if (result.length != 0) {

        console.log(result);

        var contentInformation = [[result[0].content_order_position, result[0].content_title, result[0].content_type, result[0].last_modified, result[0].content_id]];

        for (let i=1; i < result.length; i++) {
          var information = [result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].last_modified, result[i].content_id];
          contentInformation[i] = information;
        }

        res.send(contentInformation);
      } else {
        var failed = [['failed']];
        res.send(failed);
      }
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));