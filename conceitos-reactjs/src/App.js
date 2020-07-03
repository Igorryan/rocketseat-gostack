import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setProjects(response.data);
    });
  }, [])

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `${new Date()}`,
      url: `https://github.com/igorryan/${new Date()}`,
      techs: ["Node.js", "ReactJS", "React Native"]
    });

    const project = response.data;

    setProjects([...projects, project]);
  }

  async function handleRemoveRepository(id) {

    api.delete(`/repositories/${id}`);

    const response = projects.filter(project => project.id !== id);

    setProjects(response);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {projects.map(projects => (
          <li key={projects.id}>
            {projects.title}
            <button onClick={() => handleRemoveRepository(projects.id)}>Remover</button>
          </li>))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
