const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 8080;
const kodersFile = "koders.json";

app.use(bodyParser.json());

// Leer el archivo JSON y devolver su contenido como objeto
const readKodersFile = () => {
  try {
    const data = fs.readFileSync(kodersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Guardar el arreglo de koders en el archivo JSON
const writeKodersFile = (koders) => {
  fs.writeFileSync(kodersFile, JSON.stringify(koders, null, 2));
};

// Agregar un nuevo koder
app.post("/koders", (req, res) => {
  const newKoder = req.body;
  const koders = readKodersFile();
  koders.push(newKoder);
  writeKodersFile(koders);
  res.status(201).send(newKoder);
});

// Consultar todos los koders
app.get("/koders", (req, res) => {
  const koders = readKodersFile();
  res.status(200).send(koders);
});

// Eliminar un koder por nombre
app.delete("/koders/:name", (req, res) => {
  const name = req.params.name;
  let koders = readKodersFile();
  const initialLength = koders.length;
  koders = koders.filter((koder) => koder.name !== name);
  if (koders.length === initialLength) {
    return res.status(404).send({ error: "Koder not found" });
  }
  writeKodersFile(koders);
  res.status(200).send({ message: `Koder ${name} deleted` });
});

// Eliminar todos los koders
app.delete("/koders", (req, res) => {
  writeKodersFile([]);
  res.status(200).send({ message: "All koders deleted" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
