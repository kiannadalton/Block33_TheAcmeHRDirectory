# Block33_TheAcmeHRDirectory

Overview
In this workshop you will be building an API which will allow the Acme Human Resource Department mange their employees and departments. A department can have many employees and an employee must belong to a department.

Directions
The goal of this workshop is to successfully create the following routes:


GET /api/employees - returns array of employees
GET /api/departments - returns an array of departments
POST /api/employees - payload: the employee to create, returns the created employee
DELETE /api/employees/:id - the id of the employee to delete is passed in the URL, returns nothing
PUT /api/employees/:id - payload: the updated employee returns the updated employee
add an error handling route which returns an object with an error property.

Department
  id
  name (STRING)

Employee
  id
  name (STRING)
  created_at (TIMESTAMP)
  updated_at (TIMESTAMP)
  department_id (INTEGER) 

 

 

Create GitHub repository (acme_hr_directory). Use the guided practice as a reference.
Create the departments and employees tables. 
Seed the tables with some data. 
Create express server.
Have express server listen. 
Test your routes using curl and/or Postman, again using guided practice as a reference.
Submit your work in the space provided. 