# Hospital-API
In a time where a major pandemic has covered all the world we need a system which can track patients data and generate reports for them. This is a very basic API which exactly do this. 

## Basic Features
1. Register Doctor with username, password and name.
2. Login(authenticate) User using passport-local and returns a jwt-token to be to access(authorize) protected routes.
3. After logging-in the doctor can do various things such as : register patient, generate a report of patient, view all reports of a particular patient, filter all the reports by status.
4. Generation of report(protecte by jwt) : A doctor has to enter enter the status for a particular patient and can generate the report according to it.
5. View all reports of a patient(protected by jwt) : A doctor can view all the reports of a patient.
6. View all the reports filtered by status(protected by jwt) : A doctor can view all reports present in database filtered by status.
7. Unit testing integrated.

## How to install and run?
1. Clone this project
2. Start by installing npm and mongoDB if you don't have them already.
3. Run the Mongo Server.
4. Navigate to Project Directory by :
```
cd Hospital-API
```
5. run following commands :
```
npm install 
npm start or node index.js
```
## How to run Unit test and do API testing?
1. Install Mocha(Testing enviornment used by Node.js) by running `sudo npm install --global mocha`
2. Navigate to project directory and run `npm test`
3. You'll be able to verify if the API is performing as intended.

## How to use API (Understanding the end points)? (!!Important in understanding API)
#### Base URL : `http://localhost:8000/api/v1`
#### End Points :
1. `/doctor/register` (POST) : Register a new doctor using 'name', 'username', 'password' and 'confirm-password' (all mandatory).<br>
   Example input : (send name, username, password and confirm-password) <br>
   
   ![alt text](/static/doctor-register-input.png)
   
   <br>Example output : <br>
   
   ![alt text](/static/doctor-register-output.png)
   
2. `/doctor/login` (POST) : login doctor using 'username' and 'password'. <br>

   Example input : (send username and password) <br>
   
   ![alt text](/static/doctor-login-input.png) 
   
   <br>Example output : (Recieve jwt token in response) <br>
  
   ![alt text](/static/doctor-login-output.png)
   
   ### All furthur request will include : 
   
   input headers: (send jwt tokens in Authorization header) <br>
   
   ![alt text](/static/patient-register-input-header.png) <br>
   
3. `/patients/register` (POST) :register patient using 'phone_number' and 'name' (phone number becomes id and will be used as it is). <br>
   Example input : <br>
    <br>input form body: (send phone_number and name) <br>
    
   ![alt text](/static/patient-register-input-form.png)
   
   <br>Example output : (phone_number is treated as patient id) <br>
   
   ![alt text](/static/patient-register-output.png)
   
4. `/patients/:id/create_report` (POST) : create a report of a patient using ID (phone_number) sent in params and status.

   Example input : <br>
    <br>input form body: (send status, it is an enum which includes : [N,TQ,SQ,PA] which maps to [Negative, Travelled-Quarantine,
    Symptoms-Quarantine, Positive-Admit] <br>
    
   ![alt text](/static/patient-create-report-input.png)
   
   <br>Example output : <br>
   
   ![alt text](/static/patient-create-report-output.png)
   
5. `/patients/:id/all_reports` (GET) : Generate all reports of a patient by ID (phone_number) sent in params.

   <br>Example output : (all reports of a particluar patient) <br>
  
   ![alt text](/static/patients-all-reports.png)
   
6. `/reports/:status` (GET) : Generate all reports in DB filtered by status sent in params.

    <br> status is an enum which includes : [N,TQ,SQ,PA] which maps to [Negative, Travelled-Quarantine,
    Symptoms-Quarantine, Positive-Admit]<br>
    
    <br>Example output : (all reports in db filtered by status) <br>
   ![alt text](/static/reports-by-status.png)
 
## Directory Structure and flow of The Code
This code follows MVC pattern and hence everything is differentiated and well managed:

`/routes` - containes all the routes. <br>
`/routes/api` - containes api files <br>
`/assets` - static js css and image files. <br>
`/controller` - contains functions to connect to different routes. <br>
`/controller/api` - contains functions to connect to different end points of api. <br>
`/model` - to store data in db we need models. <br>
`/config` - contains config files for mongoose, passport or any other configs such as middlewares. <br>
`/test` - contains files to test the code. <br>

Feel free to use and contribute! :)

    
