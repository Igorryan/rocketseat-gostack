const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  var data = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(data);

  return response.json(data);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return response.status(400).json({error: 'Repository not found'});
  }

  if(title) repository.title = title;
  if(url) repository.url = url;
  if(techs) repository.techs = techs;


  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return res.status(400).json();
  }

  repositories.splice(repositories.indexOf(repository), 1);
  return res.status(204).json(repository);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository){
    return response.status(400).json();
  }
  
  repository.likes++;

  return response.json(repository);
});

module.exports = app;
