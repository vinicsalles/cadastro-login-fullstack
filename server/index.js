const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "banco",
});

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length == 0) {
      bcrypt.hash(password, saltRounds, (erro, hash) => {
        db.query(
          "INSERT INTO usuarios (email, password) VALUES (?, ?)",
          [email, hash],
          (err, response) => {
            if (err) {
              res.send(err);
            }
            res.send({ msg: "Cadastrado" });
          }
        );
      });
    } else {
      res.send({ msg: "Usuário já existe" });
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (erro, result) => {
        if (result) {
          res.send("Usuário logado com sucesso");
        } else {
          res.send("Senha incorreta");
        }
      });
    } else {
      res.send({ msg: "Usuário não encontrado" });
    }
  });
});

app.listen(3001, () => {
  console.log("Rodando na Porta 3001");
});
