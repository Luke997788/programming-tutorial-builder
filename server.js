const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
* Sets up a connection to the databse
*/
function createDatabaseConnection() {
  var connection = mysql.createConnection ( {
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'programming_tutorial_builder'
  });

  return connection;
}

/*
* Checks the login credentials in the request match a record in the database
*/
app.post('/api/verifylogindetails', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Verifying login details");
    console.log(req.body);

    databaseConnection.query("SELECT * FROM login_information WHERE username = '" + req.body.username + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {
        if ((req.body.username == result[0].username) && (req.body.password == result[0].password)) {
          console.log("Username and password match");
          res.send([result[0].user_id, result[0].role]);
        } else {
          res.send(['failed']);
        }  
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Inserts the information for a newly created course into the database
*/
app.post('/api/submitcourseinformation', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Inserting course information");
    console.log(req.body);

    databaseConnection.query("INSERT INTO course_information (course_creator, course_title, course_description, target_class_id, complete_in_order, hide_course) VALUES ('" + req.body.creator + "', '" + req.body.title + "', '" + req.body.description + "', '" + req.body.targetClass + "', '" + req.body.order + "', '" + req.body.hide + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send('successful insertion');
    });
  });
});

/*
* Retrieves the details of all courses created by a specific teacher
*/
app.post('/api/getcourseinfo', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Retrieving details for created courses");
    console.log(req.body);

    databaseConnection.query("SELECT * FROM course_information WHERE course_creator = '" + req.body.creator + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var coursesInformation = [[result[0].course_id, result[0].course_title, result[0].course_description, result[0].target_class_id, result[0].last_modified]];

        for (let i=1; i < result.length; i++) {
          var information = [result[i].course_id, result[i].course_title, result[i].course_description, result[i].target_class_id, result[i].last_modified];
          coursesInformation[i] = information;
        }

        res.send(coursesInformation);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Deletes all information and associated content for a specific course from the database
*/
app.post('/api/deletecourse', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Deleting course");
    console.log(req.body);

    databaseConnection.query("DELETE course_information, tutorial_content, multiple_choice_exercises FROM course_information LEFT JOIN tutorial_content ON tutorial_content.course_id=course_information.course_id LEFT JOIN multiple_choice_exercises ON multiple_choice_exercises.course_id=course_information.course_id WHERE course_information.course_id = '" + req.body.courseId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Deletes a specific piece of tutorial content from the database
*/
app.post('/api/deletetutorialcontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Deleting tutorial content");
    console.log(req.body);

    databaseConnection.query("DELETE FROM tutorial_content WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Deletes a specific exercise
*/
app.post('/api/deletetutorialexercise', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Deleting exercise");
    console.log(req.body);

    databaseConnection.query("DELETE tutorial_content, multiple_choice_exercises FROM tutorial_content INNER JOIN multiple_choice_exercises ON tutorial_content.content_id=multiple_choice_exercises.content_id WHERE tutorial_content.content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Deletes a specific exercise that is part of a test
*/
app.post('/api/deletetestexercise', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Deleting test exercise");
    console.log(req.body);

    databaseConnection.query("DELETE test_exercises, test_exercise_answers FROM test_exercises INNER JOIN test_exercise_answers ON test_exercises.test_exercise_id=test_exercise_answers.test_exercise_id WHERE test_exercises.test_exercise_id = '" + req.body.exerciseId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Deletes a test and all associated exercises
*/
app.post('/api/deletetest', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Deleting test");
    console.log(req.body);

    databaseConnection.query("DELETE tutorial_content, test_exercises, test_exercise_answers FROM tutorial_content LEFT JOIN test_exercises ON test_exercises.test_id=tutorial_content.content_id LEFT JOIN test_exercise_answers ON test_exercises.test_id=test_exercise_answers.test_id WHERE tutorial_content.content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send('deleted');
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Retrieves the details of a specific course
*/
app.post('/api/getspecificcourseinfo', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving specific course information");
    console.log(req.body);

    databaseConnection.query("SELECT course_title, course_description, target_class_id, course_creator, hide_course, complete_in_order FROM course_information WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

        if (result.length != 0) {       
          var courseInformation = [result[0].course_title, result[0].course_description, result[0].target_class_id, result[0].course_creator, result[0].hide_course, result[0].complete_in_order];
          res.send(courseInformation);
        } else {
          res.send(['failed']);
        }
    });
  });
});

/*
* Updates the information for a specific course
*/
app.post('/api/updatecourseinfo', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating course information");
    console.log(req.body);

    databaseConnection.query("UPDATE course_information SET course_title = '" + req.body.title + "', course_description = '" + req.body.description + "', target_class_id = '" + req.body.targetClass + "', complete_in_order = '" + req.body.order + "', hide_course = '" + req.body.hide + "' WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send('successful update');
    });
  });
});

/*
* Updates the content order position information for tutorial content in a specific course
*/
app.post('/api/updatecoursecontentorder', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating course content order");
    console.log(req.body);

    databaseConnection.query("UPDATE tutorial_content SET content_order_position = content_order_position - 1 WHERE course_id = '" + req.body.courseId + "' AND content_order_position > '" + req.body.position + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send('successful update');
    });
  });
});

/*
* Retrieves the classes that are taught by a specific teacher
*/
app.post('/api/getteacherclasses', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving the teacher's classes");
    console.log(req.body);

    databaseConnection.query("SELECT class_id FROM course_teachers WHERE username = '" + req.body.teacherUsername + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {
        var listOfClasses = []
        for (let i=0; i < result.length; i++) {
          listOfClasses.push(result[i].class_id);
        }

        res.send(listOfClasses);
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Retrieves the information about all students in a specific class
*/
app.post('/api/getclassstudents', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Getting students in class");
    console.log(req.body);

    databaseConnection.query("SELECT student_school_id, first_name, last_name FROM students WHERE student_class = '" + req.body.classId + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var studentInformation = [[result[0].student_school_id, result[0].first_name, result[0].last_name]];

        for (let i=1; i < result.length; i++) {
          var information = [result[i].student_school_id, result[i].first_name, result[i].last_name];
          studentInformation.push(information);
        }

        res.send(studentInformation);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Retrieves the class that a specific student is part of
*/
app.post('/api/getstudentclass', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Getting student class");
    console.log(req.body);

    databaseConnection.query("SELECT student_class FROM students WHERE username = '" + req.body.username + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send(result[0].student_class);
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Retrieves the courses made for a specific student's class
*/
app.post('/api/getstudentcourses', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Getting student courses");
    console.log(req.body);

    databaseConnection.query("SELECT course_information.course_id, course_information.course_title, course_information.course_description, course_information.hide_course, course_information.complete_in_order, students.student_class FROM course_information INNER JOIN students ON students.student_class=course_information.target_class_id WHERE students.student_school_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var courseInformation =  [[result[0].course_id, result[0].course_title, result[0].course_description, result[0].hide_course, result[0].complete_in_order, result[0].student_class]];
       
        for (let i=1; i < result.length; i++) {
          var data = [result[i].course_id, result[i].course_title, result[i].course_description, result[i].hide_course, result[i].complete_in_order, result[i].student_class];
          courseInformation.push(data);
        }

        res.send(courseInformation);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Inserts information about a peice of tutorial content into the database
*/
app.post('/api/uploadtutorialcontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Inserting tutorial information");
    console.log(req.body);

    databaseConnection.query("INSERT INTO tutorial_content (course_id, course_creator, content_title, content_type, content, content_order_position) VALUES ('" + req.body.id + "', '" + req.body.creator + "', '" + req.body.title + "', '" + req.body.type + "', '" + req.body.content + "', '" + req.body.orderPosition + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send("successful insertion");
    });
  });
});

/*
* Inserts information about a peice of exercise content into the database
*/
app.post('/api/uploadexercisecontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Inserting exercise information");
    console.log(req.body);

    databaseConnection.query("INSERT INTO multiple_choice_exercises (content_id, course_id, course_creator, content_type, exercise_task, answer_1, answer_2, answer_3, answer_4, correct_answer) VALUES ('" + req.body.contentId + "', '" + req.body.courseId + "', '" + req.body.creator + "', '" + req.body.type + "', '" + req.body.task + "', '" + req.body.answer1 + "', '" + req.body.answer2 + "', '" + req.body.answer3 + "', '" + req.body.answer4 + "', '" + req.body.correct + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }
      
      res.send("successful insertion");
    });
  });
});

/*
* Inserts the answers for an exercise that is part of a test
*/
app.post('/api/uploadtestexerciseanswers', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Inserting test exercise answers");
    console.log(req.body);

    databaseConnection.query("INSERT INTO test_exercise_answers (test_exercise_id, test_id, answer_1, answer_2, answer_3, answer_4, correct_answer) VALUES ('" + req.body.exerciseId + "', '" + req.body.testId + "', '" + req.body.answer1 + "', '" + req.body.answer2 + "', '" + req.body.answer3 + "', '" + req.body.answer4 + "', '" + req.body.correct + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }
      
      res.send("successful insertion");
    });
  });
});

/*
* Inserts information about a peice of exercise content into the table for exercises that are part of a test
*/
app.post('/api/uploadtestexercise', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Inserting test exercise information");
    console.log(req.body);

    databaseConnection.query("INSERT INTO test_exercises (test_id, exercise_title, exercise_type, exercise_content, content_order_position) VALUES ('" + req.body.testId + "', '" + req.body.title + "', '" + req.body.type + "', '" + req.body.content + "', '" + req.body.orderPosition + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }
      
      res.send("successful insertion");
    });
  });
});

/*
* Retrieves the content id for a specific piece of tutorial content
*/
app.post('/api/retrievecontentid', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Retrieving content id");
    console.log(req.body);

    databaseConnection.query("SELECT content_id FROM tutorial_content WHERE course_id = '" + req.body.idToGet + "' AND content_title = '" + req.body.title + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        var id = result[0].content_id;
        res.send("" + id);
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Retrieves the content id for a specific test exercise
*/
app.post('/api/retrievetestexercisecontentid', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Retrieving test exercise content id");
    console.log(req.body);

    databaseConnection.query("SELECT test_exercise_id FROM test_exercises WHERE test_id = '" + req.body.idToGet + "' AND exercise_title = '" + req.body.title + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        var id = result[0].test_exercise_id;
        res.send("" + id);
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Updates the information about a specific piece of tutorial content in the database
*/
app.post('/api/updatetutorialcontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating tutorial content");
    console.log(req.body);

    databaseConnection.query("UPDATE tutorial_content SET content_title = '" + req.body.title + "',  content = '" + req.body.content + "' WHERE course_id = '" + req.body.courseId + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send("successful update");
    });
  });
});

/*
* Updates the information about a specific piece of exercise content in the database
*/
app.post('/api/updateexerciseanswers', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating exercise answers");
    console.log(req.body);

    databaseConnection.query("UPDATE multiple_choice_exercises SET exercise_task = '" + req.body.task + "',  answer_1 = '" + req.body.answer1 + "', answer_2 = '" + req.body.answer2 + "',  answer_3 = '" + req.body.answer3 + "',  answer_4 = '" + req.body.answer4 + "', correct_answer = '" + req.body.correctAnswer + "' WHERE course_id = '" + req.body.courseId + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send("successful update");
    });
  });
});

/*
* Updates the information about a specific piece of exercise content in a specific test
*/
app.post('/api/updatetestexercise', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating test exercise");
    console.log(req.body);

    databaseConnection.query("UPDATE test_exercises SET exercise_title = '" + req.body.title + "', exercise_content = '" + req.body.content + "' WHERE test_id = '" + req.body.testId + "' AND test_exercise_id = '" + req.body.exerciseId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send("successful update");
    });
  });
});

/*
* Updates the answers for a specific exercise that is part of a specific test
*/
app.post('/api/updatetestexerciseanswers', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating test exercise answers");
    console.log(req.body);

    databaseConnection.query("UPDATE test_exercise_answers SET answer_1 = '" + req.body.answer1 + "', answer_2 = '" + req.body.answer2 + "',  answer_3 = '" + req.body.answer3 + "',  answer_4 = '" + req.body.answer4 + "', correct_answer = '" + req.body.correctAnswer + "' WHERE test_id = '" + req.body.testId + "' AND test_exercise_id = '" + req.body.exerciseId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send("successful update");
    });
  });
});

/*
* Inserts information about an assignment into the database
*/
app.post('/api/uploadassignmentsubmission', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Connected");
    console.log(req.body);

    databaseConnection.query("INSERT INTO assignment_submissions (student_id, username, course_id, assignment_content_id, assignment_submission) VALUES ('" + req.body.studentId + "', '" + req.body.username + "', '" + req.body.courseId + "', '" + req.body.contentId + "', '" + req.body.submission + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send("successful insertion");
    });
  });
});


/*
* Retrieves information about a specific student
*/
app.post('/api/getspecificstudentinformation', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving student information");
    console.log(req.body);

    databaseConnection.query("SELECT first_name, last_name, student_class FROM students WHERE student_school_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {
        var data = [result[0].first_name, result[0].last_name, result[0].student_class];
        res.send(data);
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Retrieves all assignment submissions for a specific student
*/
app.post('/api/getstudentassignmentsubmissions', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
    }

    console.log("Retrieving student assignment submissions");
    console.log(req.body);

    databaseConnection.query("SELECT tutorial_content.content_title, assignment_submissions.assignment_content_id, course_information.course_title FROM assignment_submissions INNER JOIN tutorial_content ON tutorial_content.content_id=assignment_submissions.assignment_content_id INNER JOIN course_information ON tutorial_content.course_id=course_information.course_id WHERE assignment_submissions.student_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
      }

      if (result.length != 0) {
        var data = [[result[0].course_title, result[0].content_title, result[0].assignment_content_id]];

        for (let i=1; i < result.length; i++) {
          var row = [result[i].course_title, result[i].content_title, result[i].assignment_content_id];
          data.push(row);
        }
        
        res.send(data);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Retrieves a specific assignment submission for a specific student
*/
app.post('/api/getspecificstudentassignmentsubmission', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving student assignment submission");
    console.log(req.body);

    databaseConnection.query("SELECT course_information.course_title, tutorial_content.content_title, assignment_submissions.assignment_submission FROM assignment_submissions INNER JOIN tutorial_content ON tutorial_content.content_id=assignment_submissions.assignment_content_id INNER JOIN course_information ON course_information.course_id=tutorial_content.course_id WHERE student_id = '" + req.body.studentId + "' AND assignment_content_id = '" + req.body.assignmentId + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {
        var data = [result[0].course_title, result[0].content_title, result[0].assignment_submission];
        res.send(data);
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Inserts feedback on an assignment submission from a teacher into the database
*/
app.post('/api/uploadteacherfeedback', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Inserting teacher feedback");
    console.log(req.body);

    databaseConnection.query("INSERT INTO teacher_feedback (assignment_id, student_id, feedback) VALUES ('" + req.body.assignmentId + "', '" + req.body.studentId + "', '" + req.body.feedback + "')", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send('successful insertion');
    });
  });
});

/*
* Updates feedback for a specific assignment submission
*/
app.post('/api/updateteacherfeedback', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Updating teacher feedback");
    console.log(req.body);

    databaseConnection.query("UPDATE teacher_feedback SET feedback = '" + req.body.feedback + "' WHERE assignment_id = '" + req.body.assignmentId + "' AND student_id = '" + req.body.studentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      res.send('successful update');
    });
  });
});

/*
* Retrieves feedback for a specific assignment
*/
app.post('/api/getteacherfeedback', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Getting teacher feedback");
    console.log(req.body);

    databaseConnection.query("SELECT feedback FROM teacher_feedback WHERE student_id = '" + req.body.studentId + "' AND assignment_id = '" + req.body.assignmentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send(result[0].feedback);
      } else {
        res.send('failed');
      }
    });
  });
});

/* 
* Retrieves all of the tutorial content that is part of a specific course
*/
app.post('/api/getallcoursetutorialcontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Retrieving tutorial content for the course");
    console.log(req.body);

    databaseConnection.query("SELECT content_id, content_title, content_type, content, content_order_position FROM tutorial_content WHERE course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var data = [[result[0].content_order_position, result[0].content_title, result[0].content_type, result[0].content, result[0].content_id]];

        for (let i=1; i < result.length; i++) {
          var row = [result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].content, result[i].content_id];
          data.push(row);
        }
        
        res.send(data);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Retrieves the answers for a piece of multiple choice exercise content
*/
app.post('/api/getexerciseanswers', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving multiple choice exercise answers");
    console.log(req.body);

    databaseConnection.query("SELECT answer_1, answer_2, answer_3, answer_4, correct_answer FROM multiple_choice_exercises WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {
        var data = [result[0].answer_1, result[0].answer_2, result[0].answer_3, result[0].answer_4, result[0].correct_answer];
        res.send(data);
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Retrieves the answers for a piece of exercise content that is part of a test
*/
app.post('/api/gettestexerciseanswers', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving test exercise answers");
    console.log(req.body);

    databaseConnection.query("SELECT answer_1, answer_2, answer_3, answer_4, correct_answer FROM test_exercise_answers WHERE test_exercise_id = '" + req.body.exerciseId + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {
        var data = [result[0].answer_1, result[0].answer_2, result[0].answer_3, result[0].answer_4, result[0].correct_answer];
        res.send(data);
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Retrieves the answers for a piece of fill in the gap exercise content
*/
app.post('/api/getgapexerciseanswers', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send('failed');
      throw err;
    }

    console.log("Retrieving gap exercise answers");
    console.log(req.body);

    databaseConnection.query("SELECT answer_1, correct_answer FROM multiple_choice_exercises WHERE content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send('failed');
        throw err;
      }

      if (result.length != 0) {
        res.send(result[0].correct_answer);
      } else {
        res.send('failed');
      }
    });
  });
});

/*
* Retrieves a specific piece of tutorial content
*/
app.post('/api/getspecifictutorialcontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving specific tutorial content");
    console.log(req.body);

    databaseConnection.query("SELECT content_title, content FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "' AND content_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {    
        var contentInformation = [result[0].content_title, result[0].content];
        res.send(contentInformation);
      } else {
        res.send(['failed']);
      }
    });
  });
});

/*
* Retrieves a specific exercise that is part of a specific test
*/
app.post('/api/getspecifictestexercise', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send(['failed']);
      throw err;
    }

    console.log("Retrieving specific tutorial content");
    console.log(req.body);

    databaseConnection.query("SELECT exercise_title, exercise_content FROM test_exercises WHERE test_id = '" + req.body.testId + "' AND test_exercise_id = '" + req.body.contentId + "'", function(err,result,fields) {
      if (err) {
        res.send(['failed']);
        throw err;
      }

      if (result.length != 0) {    
        var contentInformation = [result[0].exercise_title, result[0].exercise_content];
        res.send(contentInformation);
      } else {
        res.send(['failed']);
      }
    });
  });
});


/*
* Retrieves all exercise content information that are part of a specific test
*/
app.post('/api/gettestexercisesinfo', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Retrieving test exercises information");
    console.log(req.body);

    databaseConnection.query("SELECT test_exercise_id, exercise_title, exercise_type, content_order_position, last_modified FROM test_exercises WHERE test_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var exercises = [[result[0].content_order_position, result[0].exercise_title, result[0].exercise_type, result[0].last_modified, result[0].test_exercise_id]];

        for (let i=1; i < result.length; i++) {
          var exercise = [result[i].content_order_position, result[i].exercise_title, result[i].exercise_type, result[i].last_modified, result[i].test_exercise_id];
          exercises[i] = exercise;
        }

        res.send(exercises);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Retrieves all exercise content and answers that are part of a specific test
*/
app.post('/api/gettestcontent', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Retrieving test content");
    console.log(req.body);

    databaseConnection.query("SELECT test_exercises.test_exercise_id, test_exercises.exercise_title, test_exercises.exercise_type, test_exercises.exercise_content, test_exercises.content_order_position, test_exercise_answers.answer_1, test_exercise_answers.answer_2, test_exercise_answers.answer_3, test_exercise_answers.answer_4, test_exercise_answers.correct_answer FROM test_exercises INNER JOIN test_exercise_answers ON test_exercises.test_id=test_exercise_answers.test_id WHERE test_exercises.test_id = '" + req.body.testId + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var exercises = [[result[0].test_exercise_id, result[0].content_order_position, result[0].exercise_title, result[0].exercise_type, result[0].exercise_content, result[0].answer_1, result[0].answer_2, result[0].answer_3, result[0].answer_4, result[0].correct_answer]];

        for (let i=1; i < result.length; i++) {
          var exercise = [result[i].test_exercise_id, result[i].content_order_position, result[i].exercise_title, result[i].exercise_type, result[i].exercise_content, result[i].answer_1, result[i].answer_2, result[i].answer_3, result[i].answer_4, result[i].correct_answer];
          exercises[i] = exercise;
        }

        res.send(exercises);
      } else {
        res.send([['failed']]);
      }
    });
  });
});

/*
* Retrieves the information about pieces of content that are part of a specific course
*/
app.post('/api/getcoursecontentinfo', (req, res) => {
  var databaseConnection = createDatabaseConnection();

  databaseConnection.connect(function(err) {
    if (err) {
      res.send([['failed']]);
      throw err;
    }

    console.log("Getting course content information");
    console.log(req.body);

    databaseConnection.query("SELECT content_order_position, content_title, content_type, last_modified, content_id FROM tutorial_content WHERE course_creator = '" + req.body.creator + "' AND course_id = '" + req.body.idToGet + "'", function(err,result,fields) {
      if (err) {
        res.send([['failed']]);
        throw err;
      }

      if (result.length != 0) {
        var contentInformation = [[result[0].content_order_position, result[0].content_title, result[0].content_type, result[0].last_modified, result[0].content_id]];

        for (let i=1; i < result.length; i++) {
          var information = [result[i].content_order_position, result[i].content_title, result[i].content_type, result[i].last_modified, result[i].content_id];
          contentInformation[i] = information;
        }

        res.send(contentInformation);
      } else {
          res.send([['failed']]);
      }
    });
  });
});

// displays the port that the server is listening on
app.listen(port, () => console.log(`Server is listening on port ${port}`));