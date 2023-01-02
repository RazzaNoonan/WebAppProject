var pmysql = require("promise-mysql");
var pool;

//Connect to the mySql database
pmysql
  .createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "root",
    password: "",
    database: "proj2022",
  })
  .then((p) => { pool = p;
  })
  .catch((e) => { console.log("pool error:" + e);
  });

//Show the employees table
var getEmp = function () {
    return new Promise((resolve, reject) => {
      pool
        .query("SELECT * FROM employee")//Query
        .then((data) => { resolve(data);
        })
        .catch((error) => { reject(error);
        });
    });
  };

  //Updating
var getUpdate = function (eid) {
    return new Promise((resolve, reject) => {
      pool
        .query(`select * from employee where eid like "${eid}";`)//Query
        .then((data) => { resolve(data);
        })
        .catch((error) => { reject(error);
        });
    });
  };

  //Updating deatils after clicked on Update
var updateEmployee = function (employee) {
    return new Promise((resolve, reject) => {
      var myQuery = {
        sql: `Update employee set ename =?, role =?, salary =? where eid like "${employee.eid}";`,
        values: [employee.ename, employee.role, employee.salary],
      };
      pool
        .query(myQuery)
        .then((data) => { resolve(data);
        })
        .catch((error) => { reject(error);
        });
    });
  };


  // Show department table
var showDepartements = function () {
    return new Promise((resolve, reject) => {
      pool
        .query(
          "SELECT d.did, d.dname, l.county, d.budget FROM dept d JOIN location l ON l.lid = d.lid"
        )
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  // Delete from department
  var deleteDepartment = function (did) {
    return new Promise((resolve, reject) => {
      pool
        .query(`DELETE FROM dept WHERE did LIKE "${did}";`)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  //exporting all functions
  module.exports = { getEmp, getUpdate, updateEmployee, showDepartements, deleteDepartment };
  