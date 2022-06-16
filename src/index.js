const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

const customers = [];

app.use(express.json());

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  const id = uuidv4();

  const customerAlreadyExists = customers.some(
    (cursomer) => cursomer.cpf === cpf,
  );

  if (customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  customers.push({
    id,
    cpf,
    name,
    statement: [],
  });

  return res.status(201).send();
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
