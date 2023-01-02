//import express into app.js file
const express = require('express');
//creates the application
const app = express();
//ejs
const ejs = require("ejs");
app.set("view engine", "ejs");
//body parser
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");//middlewear
app.use(bodyParser.urlencoded({ extended: false }));
//Wamp sql
var sqlDAO = require("./mySQLDAO");
const { CompressedTextureLoader } = require('three.js');

// Home page
app.get("/", (req, res) => { console.log("Home Page")
  res.render("home");
});

// Employees page
app.get("/employees", (req, res) => { console.log("Employees Page")
  sqlDAO.getEmp()
  .then((data) => {
        res.render("employees", { employees: data });
    })
    .catch((err) => {
        res.send(err);
    }); 
});

// Edit employee page
app.get("/employees/edit/:eid", (req, res) => { console.log("Update Employees")
  // Show sql data for employees
  sqlDAO.getUpdate(req.params.eid).then((data) => {
      console.log(data);
      res.render("editEmp", { employee: data[0], errors: undefined });
    })
    .catch((err) => {
      res.send(err);
    });
});

// Handle post request for editing employee details in sql table
// Uses express validation middleware to ensure fields contain correct information
app.post(
    "/employees/edit/:eid",
    [
      check("ename")
        .isLength({ min: 5 })
        .withMessage("Employee name must be at least 5 characters"),
    ],
    [
      check("role")
        .isIn(["Manager", "Employee"])
        .withMessage("Role must be either Manager or Employee"),
    ],
    [check("salary").isFloat({ min: 0 }).withMessage("Salary must be > 0 ")],
    (req, res) => {
      var id = req.params.eid;
      var name = req.body.ename;
      var role = req.body.role;
      var salary = req.body.salary;
  
      const errors = validationResult(req);
  
      //if it meets requirements update else error
      if (!errors.isEmpty()) {
        res.render("editEmp", {
          errors: errors.errors,
          employee: { eid: id, ename: name, role: role, salary: salary },
        });
      } else {
        sqlDAO
          .updateEmployee(req.body)
          .then((data) => { 
            console.log("Updated");
          })
          .catch((error) => { 
            console.log("Error!");
            res.send(error);
          });
  
        res.redirect("/employees");
      }
    }
  );

//Department page
app.get("/departments", (req, res) => { console.log("Deaprtments Page")
  sqlDAO
    .showDepartements()
    .then((data) => {
      res.render("departments", { departments: data });
    })
    .catch((err) => {
      res.send(err);
    });
});

//Delete department
app.get("/departments/delete/:did", (req, res) => {
  console.log("delete error page");

  sqlDAO
    .deleteDepartment(req.params.did)
    .then((data) => {
      res.redirect("/departments");
    })
    .catch(() => {
      res.render("delete", { d: req.params.did });
    });
});



//listen to request - bind to a port
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});