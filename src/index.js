const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  req.customer = customer;
  next();
}

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

app.get("/statement/", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { description, amount } = req.body;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
