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

/*app.post('/searchrooms', (req, res) => {
  const { Building_Name, Weekdayy, Slot, User_Id } = req.body;

  const sql = `
  SELECT       r.Room_Id,       r.Room_Name,       r.Student_Capacity,       r.No_of_Computers,       r.Projector_Availbility,       r.Internet_Availbility,       r.Room_Type,       r.Belongs_To,       ss.Branch_Occupied,       ss.Occupied,ss.Subject_     FROM resources_db.rooms r     JOIN resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id     JOIN resources_db.building_details bd ON r.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ?      GROUP BY       r.Room_Id,       r.Student_Capacity,       r.Projector_Availbility,       r.Internet_Availbility,       r.Room_Type,       ss.Branch_Occupied,       ss.Occupied,ss.Subject_;
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
*/

app.post('/searchrooms', (req, res) => {
  const { Building_Name, Weekdayy, Slot, User_Id ,date} = req.body;

  // Check if the room is occupied by a faculty (Case 1)
  const occupiedQuery = `
  SELECT
  r.Room_Id,
  r.Room_Name,
  r.Student_Capacity,
  r.No_of_Computers,
  r.Projector_Availbility,
  r.Internet_Availbility,
  r.Room_Type,
  r.Belongs_To,
  rq.Requested_By AS Branch_Occupied,
CASE WHEN rq.Approval_Status = 'Accepted' THEN 1 ELSE 0 END AS Occupied,
rq.Purpose AS Subject_,
COALESCE((
  SELECT
    COALESCE(1, 0) AS Requested
  FROM
    resources_db.requests
  WHERE
    Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = r.Room_Id
  LIMIT 1
), 0) AS Requested
 
FROM
  resources_db.rooms r
JOIN
  resources_db.requests rq ON r.Room_Id = rq.Room_Id
JOIN
  resources_db.building_details bd ON r.Building_Id = bd.Building_Id
WHERE
  rq.Day = ?
  AND rq.Slots = ?
  AND DATE(rq.Date) = ?
  AND bd.Building_Name = ?
  AND rq.Approval_Status = 'Accepted';
  `;

  // Check if the room is vacant (Case 2)
  const vacantQuery = `
  SELECT     
  r.Room_Id,     
  r.Room_Name,     
  r.Student_Capacity,     
  r.No_of_Computers,     
  r.Projector_Availbility,     
  r.Internet_Availbility,     
  r.Room_Type,     
  r.Belongs_To,     
  'None' AS Branch_Occupied,     
  'None' AS Year,     
  'None' AS Section,     
  0 AS Occupied,     
  'None' AS Subject_ ,
  COALESCE((
    SELECT
      COALESCE(1, 0) AS Requested
    FROM
      resources_db.requests
    WHERE
      Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = r.Room_Id
    LIMIT 1
  ), 0) AS Requested
  FROM     resources_db.rooms r 
  LEFT JOIN     resources_db.resources_released rr ON r.Room_Id = rr.Room_Id 
  JOIN     resources_db.building_details bd ON r.Building_Id = bd.Building_Id 
  WHERE     rr.Day = ?     AND rr.Slot = ?     AND rr.Date = ?     AND NOT EXISTS (         SELECT 1         FROM resources_db.requests req         WHERE req.Room_Id = r.Room_Id         AND req.Day = ?         AND req.Slots = ?         AND DATE(req.date) = ?     )     AND bd.Building_Name = ?;
  `;

  const staticQuery = `
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
    ss.Occupied,
    ss.Subject_,
    COALESCE((
      SELECT
        COALESCE(1, 0) AS Requested
      FROM
        resources_db.requests
      WHERE
        Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = r.Room_Id
      LIMIT 1
    ), 0) AS Requested
  FROM resources_db.rooms r
  JOIN resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id
  JOIN resources_db.building_details bd ON r.Building_Id = bd.Building_Id
  WHERE bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ?
  GROUP BY r.Room_Id, r.Student_Capacity, r.Projector_Availbility, r.Internet_Availbility, r.Room_Type, ss.Branch_Occupied, ss.Occupied, ss.Subject_
`;

  con.query(occupiedQuery, [ Weekdayy, Slot,User_Id,Weekdayy, Slot, date, Building_Name ], (err, occupiedResults) => {
    if (err) {
      console.error('Error executing the occupied query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    con.query(vacantQuery, [ Weekdayy, Slot,User_Id,Weekdayy, Slot, date,Weekdayy, Slot, date, Building_Name ], (err, vacantResults) => {
      if (err) {
        console.error('Error executing the vacant query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      con.query(staticQuery, [  Weekdayy, Slot,User_Id,Building_Name, Weekdayy, Slot ], (err, staticResults) => {
        if (err) {
          console.error('Error executing the static schedule query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

      // Create a map to store unique room records
      const roomMap = new Map();

      // Function to add room records to the map
      const addRoomsToMap = (rooms) => {
        rooms.forEach((room) => {
          // Add room record to the map if it doesn't already exist
          if (!roomMap.has(room.Room_Id)) {
            roomMap.set(room.Room_Id, room);
          }
        });
      };

      // Add results from all queries to the map
      addRoomsToMap(occupiedResults);
      addRoomsToMap(vacantResults);
      addRoomsToMap(staticResults);

       // Convert map values to an array (unique room records)
       const combinedResults = Array.from(roomMap.values());

        // Return the combined results
        return res.json({ success: true, results: combinedResults });
      });
    });
  });
});


app.post('/request', async (req, res) => {
  
    const {  Building_Name,date, Slot, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id,Weekday,Belongs_To} = req.body;

    // Insert the record into the requests table
    const insertSql = 'INSERT INTO resources_db.requests (date, Slots, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id, Day,Belongs_To) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
    await con.promise().query(insertSql, [date, Slot, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id, Weekday,Belongs_To]);
    console.log("Record successfully inserted");

    // Make a request to the /searchrooms endpoint to get the updated data
    const sql = `
    SELECT       r.Room_Id,       r.Room_Name,       r.Student_Capacity,       r.No_of_Computers,       r.Projector_Availbility,       r.Internet_Availbility,       r.Room_Type,       r.Belongs_To,       ss.Branch_Occupied,       ss.Occupied,ss.Subject_     FROM resources_db.rooms r     JOIN resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id     JOIN resources_db.building_details bd ON r.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ?      GROUP BY       r.Room_Id,       r.Student_Capacity,       r.Projector_Availbility,       r.Internet_Availbility,       r.Room_Type,       ss.Branch_Occupied,       ss.Occupied,ss.Subject_;
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
      res.json({ success: false, results: []});
    }

  });
});


app.post('/mylabrequests',(req, res) => {
  const {User_Id}=req.body;
  const sql="SELECT DISTINCT r.Request_Id,r.Room_Name,DATE_FORMAT(r.date, '%d-%m-%Y') as date,r.Purpose,r.Day,ro.Student_capacity,ro.No_of_Computers,ro.Projector,ro.Internet,ro.Type_,ro.Belongs_To,ss.Branch_Occupied,ss.Occupied,ts.Timings FROM resources_db.requests r JOIN resources_db.labs_or_halls ro ON r.Room_Id = ro.Lab_Id JOIN resources_db.time_slots ts ON r.Slots = ts.Slot LEFT JOIN resources_db.lab_schedule ss ON ro.Lab_Id = ss.Lab_or_Hall_Id AND r.Slots = ss.Slots AND r.Day = ss.Day_ WHERE r.User_Id =?"
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
      res.json({ success: false, results: []});
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
      const selectSql = "SELECT DISTINCT r.Request_Id,r.Room_Name, r.date, r.Purpose, r.Day, ro.Student_capacity, ro.No_of_Computers, ro.Projector_Availbility, ro.Internet_Availbility, ro.Room_Type, ro.Belongs_To, ss.Branch_Occupied, ss.Occupied, ts.Timings FROM resources_db.requests r JOIN resources_db.rooms ro ON r.Room_Id = ro.Room_Id JOIN resources_db.time_slots ts ON r.Slots = ts.Slot LEFT JOIN resources_db.static_schedule ss ON ro.Room_Id = ss.Room_Id AND r.Slots = ss.Slot AND r.Day = ss.Day_ WHERE r.User_Id = ?";
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
              res.json({ success:false,message: 'No Requests Found' });
          }
      });
  });
});


app.post('/hodsearchrooms', (req, res) => {
  const { Building_Name, Weekdayy, Slot, User_Id,Belongs_To } = req.body;

  const sql = `
  SELECT       r.Room_Id,       r.Room_Name,       r.Student_Capacity,       r.No_of_Computers,       r.Projector_Availbility,       r.Internet_Availbility,       r.Room_Type,       r.Belongs_To,       ss.Branch_Occupied,       ss.Occupied,ss.Subject_     FROM resources_db.rooms r     JOIN resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id     JOIN resources_db.building_details bd ON r.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ? AND r.Belongs_To= ?      GROUP BY       r.Room_Id,       r.Student_Capacity,       r.Projector_Availbility,       r.Internet_Availbility,       r.Room_Type,       ss.Branch_Occupied,       ss.Occupied,ss.Subject_;
  `;

  con.query(sql, [Building_Name, Weekdayy, Slot,Belongs_To], (err, results) => {
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


app.post('/releaseroom', (req, res) => {
  const { Room_Id, Room_Name, Day, Slot, Date, Building_Name, User_Id,Belongs_To } = req.body;
  // 1. Insert the record into the resources_released table
  const insertSql = 'INSERT INTO resources_db.resources_released (Room_Id, Room_Name, Day, Slot,  Date) VALUES (?, ?, ?, ?, ?)';
  con.query(insertSql, [Room_Id, Room_Name, Day, Slot, Date], (insertErr, insertResult) => {
    if (insertErr) {
      console.error('Error inserting record into resources_released table:', insertErr);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Record successfully inserted into resources_released table');

    // 2. Update the approval status of requests with the same details
    const updateSql = 'UPDATE resources_db.requests SET Approval_Status = "Accepted" WHERE Room_Id = ? AND date = ? AND Slots = ?';
    con.query(updateSql, [Room_Id, Date, Slot], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating approval status of requests:', updateErr);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Approval status of requests updated successfully');
      

      // 3. Fetch the room details along with the released status

      const ssql = `
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
          ss.Occupied,
          ss.Subject_,
          COALESCE((SELECT 1 FROM resources_db.resources_released WHERE Room_Id = r.Room_Id AND Day = ? AND Slot = ? AND Date = ?), 0) AS Released
        FROM
          resources_db.rooms r
          JOIN resources_db.static_schedule ss ON r.Room_Id = ss.Room_Id
          JOIN resources_db.building_details bd ON r.Building_Id = bd.Building_Id
        WHERE
          bd.Building_Name = ? AND ss.Day_ = ? AND ss.Slot = ? AND r.Belongs_To= ?
        GROUP BY
          r.Room_Id,
          r.Student_Capacity,
          r.Projector_Availbility,
          r.Internet_Availbility,
          r.Room_Type,
          ss.Branch_Occupied,
          ss.Occupied,
          ss.Subject_
      `;
      con.query(ssql, [Day, Slot, Date, Building_Name, Day, Slot,Belongs_To], (sErr, sResult) => {
        if (sErr) {
          console.error('Error executing the main SQL query:', sErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Send response with the fetched data
        res.json({ success: true, results: sResult });
      });
    });
  });
});


app.post('/hodsearchlabs', (req, res) => {
  const {Building_Name,Weekdayy,Slot,User_Id,Belongs_To}=req.body;
  const sql='SELECT       ls.Lab_Id, Resources_Id,ls.Internet,       ls.Lab_Name,       ls.Student_Capacity,       ls.No_of_Computers,       ls.Projector,       ls.Type_,       ls.Belongs_To,       lsc.Branch_Occupied,       lsc.Subject_,lsc.Occupied     FROM resources_db.labs_or_halls ls     JOIN resources_db.lab_schedule lsc ON ls.Lab_Id = lsc.Lab_or_Hall_Id     JOIN resources_db.building_details bd ON ls.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND lsc.Day_ = ? AND lsc.Slots = ? AND ls.Belongs_To=?;'
  con.query(sql,[Building_Name,Weekdayy,Slot,Belongs_To],(Err,results)=>{
  if(Err){
    console.error('Error inserting room:', Err);
          return res.status(500).send('Internal Server Error');
  }
  
  const finalResults = results.map((room) => {
    const requestQuery = `
      SELECT
        COALESCE(1, 0) AS Requested
      FROM resources_db.requests
      WHERE Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = ?
    `;

    return new Promise((resolve, reject) => {
      con.query(requestQuery, [Weekdayy, Slot, User_Id, room.Lab_Id], (err, requestResult) => {
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

  app.post('/releaselab', (req, res) => {
    
    const { Lab_Id, Lab_Name, Day, Slot, Date, Building_Name, User_Id,Belongs_To } = req.body;
    console.log(Lab_Id, Lab_Name, Day, Slot, Date, Building_Name, User_Id,Belongs_To)
    // 1. Insert the record into the resources_released table
    const insertSql = 'INSERT INTO resources_db.labs_released (Lab_Id, Lab_Name, Day, Slot,  Date) VALUES (?, ?, ?, ?, ?)';
    con.query(insertSql, [Lab_Id, Lab_Name, Day, Slot, Date], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error inserting record into resources_released table:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Record successfully inserted into resources_released table');
  
      // 2. Update the approval status of requests with the same details
      const updateSql = 'UPDATE resources_db.requests SET Approval_Status = "Accepted" WHERE Room_Id = ? AND date = ? AND Slots = ?';
      con.query(updateSql, [Lab_Id, Date, Slot], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating approval status of requests:', updateErr);
          return res.status(500).send('Internal Server Error');
        }
        console.log('Approval status of requests updated successfully');
        
  
        // 3. Fetch the room details along with the released status
        const ssql = `
        SELECT   
        lh.Lab_Id,           
        lh.Lab_Name,           
        lh.Student_Capacity,           
        lh.No_of_Computers,           
        lh.Projector,           
        lh.Internet,           
        lh.Type_,           
        lh.Belongs_To,           
        ls.Branch_Occupied,           
        ls.Occupied,           
        ls.Subject_,           
        COALESCE((SELECT 1 FROM resources_db.labs_released WHERE Lab_Id = lh.Lab_Id AND Day = ? AND Slot = ? AND Date = ?), 0) AS Released         
        FROM           
        resources_db.labs_or_halls lh           
        JOIN resources_db.lab_schedule ls ON lh.Lab_Id = ls.Lab_or_Hall_Id           
        JOIN resources_db.building_details bd ON lh.Building_Id = bd.Building_Id         
        WHERE           
        bd.Building_Name = ? AND ls.Day_ = ? AND ls.Slots = ? AND lh.Belongs_To= ?;
        `;
        con.query(ssql, [Day, Slot, Date, Building_Name, Day, Slot,Belongs_To], (sErr, sResult) => {
          if (sErr) {
            console.error('Error executing the main SQL query:', sErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          // Send response with the fetched data
          res.json({ success: true, results: sResult });
        });
      });
    });
  });
    

app.post('/hodrequests', (req, res) => {
  const { Belongs_To } = req.body; 
  
  const sql = `
    SELECT DISTINCT
      r.Room_Name,
      r.Room_Id,
      DATE_FORMAT(r.date, '%Y-%m-%d') as date,
      r.Requested_By,
      r.Purpose,
      r.Day,
      ro.Student_capacity,
      ro.No_of_Computers,
      ro.Projector_Availbility,
      ro.Internet_Availbility,
      ro.Belongs_To,
      ss.Branch_Occupied,
      ss.Occupied,
      ts.Timings
    FROM
      resources_db.requests r
    JOIN
      resources_db.rooms ro ON r.Room_Id = ro.Room_Id
    JOIN
      resources_db.time_slots ts ON r.Slots = ts.Slot
    LEFT JOIN
      resources_db.static_schedule ss ON ro.Room_Id = ss.Room_Id AND r.Slots = ss.Slot AND r.Day = ss.Day_
    WHERE
      r.Belongs_To = ? AND r.Approval_Status = 'pending';`;

  con.query(sql, [Belongs_To], (err, results) => {
    if (err) {
      console.error('Error retrieving HOD requests:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      // Requests found, send success response
      res.json({ success: true, results });
    } else {
      // No requests found
      res.json({ success: false,results:[]});
    }
  });
});


app.post('/hodlabrequests', (req, res) => {
  const { Belongs_To } = req.body; 
  
  const sql = `
  SELECT DISTINCT
  r.Room_Name,
  r.Room_Id,
  DATE_FORMAT(r.date, '%Y-%m-%d') as date,
  r.Requested_By,
  r.Purpose,
  r.Day,
  ro.Student_capacity,
  ro.No_of_Computers,
  ro.Projector,
  ro.Internet,
  ro.Belongs_To,
  ss.Branch_Occupied,
  ss.Occupied,
  ts.Timings
FROM
  resources_db.requests r
JOIN
  resources_db.labs_or_halls ro ON r.Room_Id = ro.Lab_Id
JOIN
  resources_db.time_slots ts ON r.Slots = ts.Slot
LEFT JOIN
  resources_db.lab_schedule ss ON ro.Lab_Id = ss.Lab_or_Hall_Id AND r.Slots = ss.Slots AND r.Day = ss.Day_
WHERE
  r.Belongs_To = ? AND r.Approval_Status = 'pending';`;

  con.query(sql, [Belongs_To], (err, results) => {
    if (err) {
      console.error('Error retrieving HOD requests:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      // Requests found, send success response
      res.json({ success: true, results });
    } else {
      // No requests found
      res.json({ success: false,results:[]});
    }
  });
});

app.post('/approve', (req, res) => {
  const { Date, Requested_By, Room_Id, Timings } = req.body;

  // Get the slot corresponding to the timings
  const slotQuery = 'SELECT Slot FROM resources_db.time_slots WHERE Timings = ?';
  con.query(slotQuery, [Timings], (slotErr, slotResult) => {
    if (slotErr) {
      console.error('Error fetching slot:', slotErr);
      return res.status(500).send('Internal Server Error');
    }
    if (slotResult.length === 0) {
      console.error('Slot not found for timings:', Timings);
      return res.status(400).send('Slot not found for timings');
    }
    const slot = slotResult[0].Slot;

    // Update Approval_Status to "Approved"
    const approveSql = 'UPDATE resources_db.requests SET Approval_Status = "Approved" WHERE date = ? AND Requested_By = ? AND Room_Id = ? AND Slots = ? AND Approval_Status = "pending"';
    con.query(approveSql, [Date, Requested_By, Room_Id, slot], (err, result) => {
      if (err) {
        console.error('Error approving request:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Request approved successfully');
      res.json({ success: true,message:"Request Approved Successfully" });
    });
  });
});


app.post('/deny', (req, res) => {
  const { Date, Requested_By, Room_Id, Timings } = req.body;

  // Get the slot corresponding to the timings
  const slotQuery = 'SELECT Slot FROM resources_db.time_slots WHERE Timings = ?';
  con.query(slotQuery, [Timings], (slotErr, slotResult) => {
    if (slotErr) {
      console.error('Error fetching slot:', slotErr);
      return res.status(500).send('Internal Server Error');
    }
    if (slotResult.length === 0) {
      console.error('Slot not found for timings:', Timings);
      return res.status(400).send('Slot not found for timings');
    }
    const slot = slotResult[0].Slot;

    // Update Approval_Status to "Denied"
    const denySql = 'UPDATE resources_db.requests SET Approval_Status = "Denied" WHERE date = ? AND Requested_By = ? AND Room_Id = ? AND Slots = ? AND Approval_Status = "pending"';
    con.query(denySql, [Date, Requested_By, Room_Id, slot], (err, result) => {
      if (err) {
        console.error('Error denying request:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Request denied successfully');
      res.json({ success: true });
    });
  });
});





app.post('/buildings',(req,res)=>{
  const sql='SELECT Building_name FROM building_details';
  con.query(sql,(buildingERR,buildingresults)=>{
    if (buildingERR) {
      res.status(500).send('Internal Server Error');
      throw buildingERR;
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

app.post('/admin/building',(req,res) => {
  const {Building_Name,No_of_Floors,No_of_Classrooms,No_of_Labs,No_of_conference_Halls}=req.body;
  const insertsql='INSERT INTO resources_db.building_details (Building_Name,No_of_Floors,No_of_Classrooms,No_of_Labs,No_of_conference_Halls) VALUES(?,?,?,?,?)';
  con.query(insertsql,[Building_Name,No_of_Floors,No_of_Classrooms,No_of_Labs,No_of_conference_Halls],(insertErr,insertresults) =>{
    if(insertErr){
      res.status(500).send('Internal Server Error');
      throw insertErr;
    }
    res.json({success: true,message:"Building Added successfully"})
  });
});

app.post('/admin/rooms', (req, res) => {
  const { Building_Name, Room_Name, Student_Capacity, Projector_Availbility, Internet_Availbility, No_of_Computers, Belongs_To, Room_Type } = req.body;

  const buildingIdSql = 'SELECT Building_Id FROM resources_db.building_details WHERE Building_Name=?;';
  con.query(buildingIdSql, [Building_Name], (err, rows) => {
    if (err) {
      console.error('Error retrieving Building_Id:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (rows.length === 0) {
      console.error('Building not found for name:', Building_Name);
      return res.status(404).send('Building not found');
    }

    const Building_Id = rows[0].Building_Id;

    const insertSql = 'INSERT INTO resources_db.rooms (Building_Id, Room_Name, Student_Capacity, Projector_Availbility, Internet_Availbility, No_of_Computers, Belongs_To, Room_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    con.query(insertSql, [Building_Id, Room_Name, Student_Capacity, Projector_Availbility, Internet_Availbility, No_of_Computers, Belongs_To, Room_Type], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error inserting room:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({success: true,message:"Building Added successfully"})
    });
  });
});

app.post('/searchlabs', (req, res) => {
  const {Building_Name,Weekdayy,Slot,User_Id}=req.body;
  const sql='SELECT       ls.Lab_Id, Resources_Id,ls.Internet,       ls.Lab_Name,       ls.Student_Capacity,       ls.No_of_Computers,       ls.Projector,       ls.Type_,       ls.Belongs_To,       lsc.Branch_Occupied,       lsc.Subject_,lsc.Occupied     FROM resources_db.labs_or_halls ls     JOIN resources_db.lab_schedule lsc ON ls.Lab_Id = lsc.Lab_or_Hall_Id     JOIN resources_db.building_details bd ON ls.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND lsc.Day_ = ? AND lsc.Slots = ?;'
  con.query(sql,[Building_Name,Weekdayy,Slot ],(Err,results)=>{
  if(Err){
    console.error('Error inserting room:', Err);
          return res.status(500).send('Internal Server Error');
  }
  
  const finalResults = results.map((room) => {
    const requestQuery = `
      SELECT
        COALESCE(1, 0) AS Requested
      FROM resources_db.requests
      WHERE Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = ?
    `;

    return new Promise((resolve, reject) => {
      con.query(requestQuery, [Weekdayy, Slot, User_Id, room.Lab_Id], (err, requestResult) => {
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

  app.post('/resources', (req, res) => {
    const {Building_Name,Weekday,Slot,Lab_Id}=req.body;
    console.log(Building_Name,Weekday,Slot,Lab_Id)
    const sql='SELECT       ls.Lab_Id, Resources_Id,ls.Internet,       ls.Lab_Name,       ls.Student_Capacity,       ls.No_of_Computers,       ls.Projector,       ls.Type_,       ls.Belongs_To,       lsc.Branch_Occupied,       lsc.Subject_,lsc.Occupied     FROM resources_db.labs_or_halls ls     JOIN resources_db.lab_schedule lsc ON ls.Lab_Id = lsc.Lab_or_Hall_Id     JOIN resources_db.building_details bd ON ls.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND lsc.Day_ = ? AND lsc.Slots = ? AND ls.Lab_Id=?;'
    con.query(sql,[Building_Name,Weekday,Slot,Lab_Id ],(Err,results)=>{
    if(Err){
      console.error('Error retrieving Resources_Id:', Err);
            return res.status(500).send('Internal Server Error');
    }
    if(results.length === 0){
      console.error('No such Lab or Hall Exists');
          return res.status(404).send('Lab or Hall not found');
    }
    const Resources_Id=results[0].Resources_Id;
    const selectsql='SELECT Resource_Name,Resource_Count FROM resources_db.labs_resources WHERE Resources_Id=?;'
      con.query(selectsql,[Resources_Id],(err, selectresults) => {
        if (err) {
          res.status(500).send('Internal Server Error');
          throw err;
        }
        if (selectresults.length > 0) {
          // User found, send success response
          res.json({success: true,results: selectresults});
        } else {
          // User not found or invalid credentials
          res.status(401).json({ message:'No Such resources Found' });
        }
      });
    
    });
    });

    app.post('/requestlabs', async (req, res) => {
  
      const {  Building_Name,date, Slot, Lab_Id, Lab_Name, Purpose, Requested_By, Approval_Status, User_Id,Weekday,Belongs_To} = req.body;
  
      // Insert the record into the requests table
      const insertSql = 'INSERT INTO resources_db.requests (date, Slots, Room_Id, Room_Name, Purpose, Requested_By, Approval_Status, User_Id, Day,Belongs_To) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
      await con.promise().query(insertSql, [date, Slot, Lab_Id, Lab_Name, Purpose, Requested_By, Approval_Status, User_Id, Weekday, Belongs_To]);
      console.log("Record successfully inserted");
  
      // Make a request to the /searchrooms endpoint to get the updated data
     const sql='SELECT       ls.Lab_Id, Resources_Id,ls.Internet,       ls.Lab_Name,       ls.Student_Capacity,       ls.No_of_Computers,       ls.Projector,       ls.Type_,       ls.Belongs_To,       lsc.Branch_Occupied,       lsc.Subject_,lsc.Occupied     FROM resources_db.labs_or_halls ls     JOIN resources_db.lab_schedule lsc ON ls.Lab_Id = lsc.Lab_or_Hall_Id     JOIN resources_db.building_details bd ON ls.Building_Id = bd.Building_Id     WHERE bd.Building_Name = ? AND lsc.Day_ = ? AND lsc.Slots = ?;'
    con.query(sql,[Building_Name,Weekday,Slot ],(Err,results)=>{
    if(Err){
      console.error('Error inserting room:', Err);
            return res.status(500).send('Internal Server Error');
    }
    
    const finalResults = results.map((room) => {
      const requestQuery = `
        SELECT
          COALESCE(1, 0) AS Requested
        FROM resources_db.requests
        WHERE Day = ? AND Slots = ? AND User_Id = ? AND Room_Id = ?
      `;
  
      return new Promise((resolve, reject) => {
        con.query(requestQuery, [Weekday, Slot, User_Id, room.Lab_Id], (err, requestResult) => {
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
    
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
