const database = require("./database");

// LIRE UNE BDD //
// const getUsers = (req, res) => {
//   database
//     .query("select * from users")
//     .then(([users]) => {
//       res.json(users);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error retrieving data from database");
//     });
// };

// LIRE UNE BDD avec filtres //
const getUsers = (req, res) => {
  const initialSql = "select * from users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
    }
  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

// LIRE UNE RESSOURCE DE LA BDD (id) //
const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      // .query(`select * from movies where id = ${id}`)
      // Injecter une id ds une requête n'est pas sûre (attention aux injections sql)
      // Il faut utiliser des requêtes préparées comme suit :!!
      .query('select * from users where id = ?', [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.json(users[0]);
        } else {
          res.status(404).send('Not found');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      })
  };

// AJOUTER UNE RESSOURCE DS LA BDD //
const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
      .query("insert into users(firstname, lastname, email, city, language, hashedPassword) values (?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language, hashedPassword]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
  };
  
// MODIFIER UNE RESSOURCE DE LA BDD (id) //
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language} = req.body;

  database
    .query("update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    });
  };

// SUPPRIMER UNE RESSOURCE DE LA BDD (id) //
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

  module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser,
  };