// const serverless = require("serverless");
const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
// const mongoose = require("mongoose");
const connectDB = require('./config/dbConfig');
const { Employee } = require("./models/employeeDB");

const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new AWS.S3();

connectDB();

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// HOME

const appHome = express();

appHome.set('view engine', 'ejs');
appHome.set('views', path.join(__dirname, 'views'));


appHome.get("/", async (req, res) => {
  try {
    let employees = await Employee.find();
    employees = employees.reverse();
    res.render("index", { employees: employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.home = serverless(appHome);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ADD EMPLOYEE

const appAddEmployee = express();
appAddEmployee.use(express.json());

appAddEmployee.post("/addEmployee", async (req, res) => {
  try {
    const empData = req.body;
    const employee = new Employee(empData);
    const savedEmp = await employee.save();
    if(savedEmp) {
      console.log('Employee added successfully...............: ',savedEmp);
    }
    res.status(201).json({ id: savedEmp._id });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: error.message });
  }
});

exports.addEmployee = serverless(appAddEmployee);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// IMAGE UPLOAD

const appEmpImgUpload = express();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'public-kidiloski/images',
    acl: 'public-read',
    key: function(req, file, cb) {
      cb(null, `${req.params.id}${path.extname(file.originalname)}`);
    }
  })
});

appEmpImgUpload.post("/empImg/:id", upload.single('avatar'), async(req, res) => {
  try {
    if (req.file) {
      const avatarPath = `https://public-kidiloski.s3.ap-south-1.amazonaws.com/images/${req.params.id}.jpg`;
      await Employee.findByIdAndUpdate(req.params.id, { avatar: avatarPath });
      console.log('Image uploaded successfully...............');
      res.status(200).json({ message: 'Image uploaded successfully...............' });
    } else {
      console.log('No file uploaded');
      res.status(400).json({ message: 'Failed to upload image...............' });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.imgUpload = serverless(appEmpImgUpload);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE EMPLOYEE

const appDeleteEmployee = express();

appDeleteEmployee.delete("/deleteEmployee/:id", async(req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(400).json({ message: "Employee not found" });
    }
    console.log('Employee deleted successfully...............');
    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: error.message });
  }
});

exports.deleteEmployee = serverless(appDeleteEmployee);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// EDIT EMPLOYEE

const appEditEmployeeView = express();

appEditEmployeeView.get("/editEmployee/:id", async(req, res) => {
  try {
    const empViewed = await Employee.findById(req.params.id);
    console.log(empViewed);

    if (empViewed) {
      console.log('Found the employee to be viewed...............');
      return res.status(200).json(empViewed);
    } else {
      return res.status(404).json({ message: "Employee not found to be viewed" });
    }
  } catch (error) {
    console.log('Error fetching employee to be viewed...............:', error);
    return res.status(500).json({ message: error});
  }
});

exports.editEmployeeView = serverless(appEditEmployeeView);

const appEditEmployeeSave = express();
appEditEmployeeSave.use(express.json()); // MUST, otherwise it will be logged as a Buffer instead of a parsed JSON object.

appEditEmployeeSave.put("/editEmployee/:id", async(req, res) => {
  try {
    console.log('Received update request for ID:', req.params.id);
    console.log('Data to update:', req.body);

    const updatedData = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updatedData, {new: true});
    if(updatedEmployee) {
      return res.status(200).json(updatedEmployee);
    } else {
      return res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.log('Error updating employee...............:', error);
    return res.status(500).json({ error: error.message });
  }
});

exports.editEmployeeSave = serverless(appEditEmployeeSave);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  return age;
}

const appEmpDetails = express();

appEmpDetails.set('view engine', 'ejs');
appEmpDetails.set('views', path.join(__dirname, 'views'));

appEmpDetails.get("/employeeDetails/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    return res.render('view', { 
      employee: employee,
      calculateAge: calculateAge
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

exports.empDetails = serverless(appEmpDetails);

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const appHello = express();

// appHello.get("/hello", (req, res) => {
//   return res.status(200).json({
//     message: "HELLO!",
//   });
// });

// exports.hello = serverless(appHello);

