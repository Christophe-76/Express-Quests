const users = [
    { 
      firstname:'John',
      lastname:'Doe',
      email:'john.doe@example.com',
      city:'Paris',
      language:'English'
    },
    { 
      firstname:'Appius',
      lastname:'valeriy.appius@example.com',
      email:'Moscow',
      city:'Russian',
      language:'Valeriy',
    },
    { 
      firstname:'Ralf',
      lastname:'Geronimo',
      email:'ralf.geronimo@example.com',
      city:'New York',
      language:'Italian'
    },
    {
      firstname:'Maria',
      lastname:'Iskandar',
      email:'maria.iskandar@example.com',
      city:'New York',
      language:'German'
    },
    {
      firstname:'Jane',
      lastname:'Doe',
      email:'jane.doe@example.com',
      city:'London',
      language:'English'
    },
    {
      firstname:'Johanna',
      lastname:'Martino',
      email:'johanna.martino@example.com',
      city:'Milan',
      language:'Spanish'
    },
  ];
  const database = require("./database");
  
  const getUsers = (req , res) => {
      res.status(200).json(users)    
  }
  const getUsersById = (req, res) => {
      const id = parseInt(req.params.id);
    
      database
        .query("select * from users where id = ?", [id])
        .then(([users]) => {
          if (users[0] != null) {
            res.json(users[0]);
          } else {
            res.status(404).send("Not Found");
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error retrieving data from database");
        });
    };
    const postUser = (req, res) => {
      const { firstname, lastname, email, city, language } = req.body;
      database
        .query(
          "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
          [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
          res.location(`/api/users/${result.insertId}`).sendStatus(201);
    
          })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error saving the user");
        });
    };

  module.exports = {
      getUsers,
      getUsersById,
      postUser,
    };