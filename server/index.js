//index.js
const axios = require('axios');
const express = require('express')
const mysql=require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 3001

app.use(cors());


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Abcd@8374',
  database: 'resources_db'
});
con.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
});




// Middleware to parse JSON bodies
app.use(bodyParser.json());


// API endpoint for user login
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?';
  con.query(sql, [username, password, role], (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      throw err;
    }
    if (results.length > 0) {
      // User found, send success response
      res.json({ success: true, results });
    } else {
      // User not found or invalid credentials
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

app.post('/searchrooms', (req, res) => {
  const { Building_Name, Weekdayy, Slot, User_Id } = req.body;

  const sql = `
  SELECT
  r.Room_Id,
  r.Room_Name,
  r.Student_Capacity,
  r.No_of_Computers,
  r.Projector_Availbility,
  r.Internet_Availbility,
  r.Room_Type,
  r.Belongs_To,
  ss.Branch_Occupied,
  ss.Subject,
  MIN(ss.Occupied) AS Occupied
FROM
  resources_db.rooms r
JOIN
  resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id
JOIN
  resources_db.building_details bd ON r.Building_Id = bd.Building_Id
WHERE
  bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ?
GROUP BY
  r.Room_Id,
  ss.Subject,
  r.Student_Capacity,
  r.Projector_Availbility,
  r.Internet_Availbility,
  r.Room_Type,
  ss.Branch_Occupied;

  `;

  con.query(sql, [Building_Name, Weekdayy, Slot], (err, results) => {
    if (err) {
      console.error('Error executing the main SQL query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Fetch the requested status for each room
    const finalResults = results.map((room) => {
      const requestQuery = `
        SELECT
          COALESCE(1, 0) AS Requested
        FROM resources_db.requests
        WHERE Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = ?
      `;

      return new Promise((resolve, reject) => {
        con.query(requestQuery, [Weekdayy, Slot, User_Id, room.Room_Id], (err, requestResult) => {
          if (err) {
            console.error('Error executing the request SQL query:', err);
            reject(err);
          } else {
            const Requested = requestResult.length > 0 ? requestResult[0].Requested : 0;
            resolve({
              ...room,
              Requested
            });
          }
        });
        
      });
    });

    Promise.all(finalResults)
      .then((finalResults) => {
        res.json({ success: true,results: finalResults });
      })
      .catch((err) => {
        console.error('Error processing the results:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
  });
});

app.post('/request', async (req, res) => {
  
    const {  Building_Name,date, Slot, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id,Weekday} = req.body;

    // Insert the record into the requests table
    const insertSql = 'INSERT INTO resources_db.requests (date, Slots, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id, Day) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await con.promise().query(insertSql, [date, Slot, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id, Weekday]);
    console.log("Record successfully inserted");

    // Make a request to the /searchrooms endpoint to get the updated data
    const sql = `
    SELECT
      r.Room_Id,
      r.Room_Name,
      r.Student_Capacity,
      r.No_of_Computers,
      r.Projector_Availbility,
      r.Internet_Availbility,
      r.Room_Type,
      r.Belongs_To,
      ss.Branch_Occupied,
      ss.Occupied
    FROM resources_db.rooms r
    JOIN resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id
    JOIN resources_db.building_details bd ON r.Building_Id = bd.Building_Id
    WHERE bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ?
    GROUP BY
      r.Room_Id,
      r.Student_Capacity,
      r.Projector_Availbility,
      r.Internet_Availbility,
      r.Room_Type,
      ss.Branch_Occupied,
      ss.Occupied
  `;

  con.query(sql, [Building_Name, Weekday, Slot], (err, results) => {
    if (err) {
      console.error('Error executing the main SQL query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Fetch the requested status for each room
    const finalResults = results.map((room) => {
      const requestQuery = `
        SELECT
          COALESCE(1, 0) AS Requested
        FROM resources_db.requests
        WHERE Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = ?
      `;

      return new Promise((resolve, reject) => {
        con.query(requestQuery, [Weekday, Slot, User_Id, room.Room_Id], (err, requestResult) => {
          if (err) {
            console.error('Error executing the request SQL query:', err);
            reject(err);
          } else {
            const Requested = requestResult.length > 0 ? requestResult[0].Requested : 0;
            resolve({
              ...room,
              Requested
            });
          }
        });
        
      });
    });

    Promise.all(finalResults)
      .then((finalResults) => {
        res.json({ success: true,results: finalResults });
      })
      .catch((err) => {
        console.error('Error processing the results:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  
  
});

app.post('/myrequests',(req, res) => {
  const {User_Id}=req.body;
  const sql="SELECT DISTINCT r.Request_Id,r.Room_Name,r.date,r.Purpose,r.Day,ro.Student_capacity,ro.No_of_Computers,ro.Projector_Availbility,ro.Internet_Availbility,ro.Room_Type,ro.Belongs_To,ss.Branch_Occupied,ss.Occupied,ts.Timings FROM resources_db.requests r JOIN resources_db.rooms ro ON r.Room_Id = ro.Room_Id JOIN resources_db.time_slots ts ON r.Slots = ts.Slot LEFT JOIN resources_db.static_schedule ss ON ro.Room_Id = ss.Room_Id AND r.Slots = ss.Slot AND r.Day = ss.Day_ WHERE r.User_Id = ?"
  con.query(sql,[User_Id],(err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      throw err;
    }
    if (results.length > 0) {
      // User found, send success response
      res.json({success: true,results});
    } else {
      // User not found or invalid credentials
      res.status(401).json({ message:'No Request Found' });
    }

  });
});

app.post('/cancelrequest', (req, res) => {
  const { Request_Id,User_Id} = req.body;
  const deleteSql = "DELETE FROM resources_db.requests WHERE Request_Id = ?";
  con.query(deleteSql, [Request_Id,User_Id], (deleteErr, deleteResult) => {
      if (deleteErr) {
          res.status(500).send('Internal Server Error');
          throw deleteErr;
      }
      console.log("Record Deleted successfully");

      // Execute the query to retrieve remaining requests
      const selectSql = "SELECT DISTINCT r.Room_Name, r.date, r.Purpose, r.Day, ro.Student_capacity, ro.No_of_Computers, ro.Projector_Availbility, ro.Internet_Availbility, ro.Room_Type, ro.Belongs_To, ss.Branch_Occupied, ss.Occupied, ts.Timings FROM resources_db.requests r JOIN resources_db.rooms ro ON r.Room_Id = ro.Room_Id JOIN resources_db.time_slots ts ON r.Slots = ts.Slot LEFT JOIN resources_db.static_schedule ss ON ro.Room_Id = ss.Room_Id AND r.Slots = ss.Slot AND r.Day = ss.Day_ WHERE r.User_Id = ?";
      con.query(selectSql, [User_Id], (selectErr, selectResult) => {
          if (selectErr) {
              res.status(500).send('Internal Server Error');
              throw selectErr;
          }
          if (selectResult.length > 0) {
              // Requests found, send success response
              res.json({ success: true,result: selectResult });
          } else {
              // No requests found
              res.status(404).json({ message: 'No Requests Found' });
          }
      });
  });
});
app.post('/releaseroom',(req, res) => {
const {Room_Id,Room_Name,Day,Slot,Occupied,Date}=req.body;
const releasesql="INSERT INTO resources_db.resources_released (Room_Id,Room_Name,Day,Slot,Occupied,Date) VALUES(?,?,?,?,?,?)";
con.query(releasesql,)
}
)

app.post('/buildings',(req,res)=>{
  const sql='SELECT Building_name FROM building_details';
  con.query(sql,(buildingERR,buildingresults)=>{
    if (buildingERR) {
      res.status(500).send('Internal Server Error');
      throw Err;
  }
  if (buildingresults.length > 0) {
      // Requests found, send success response
      res.json({ success: true,result: buildingresults });
  } else {
      // No requests found
      res.status(404).json({ message: 'No Requests Found' });
  }
  });
})
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
