import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const newUser = () => {
    // Verificar se ambos os campos estão preenchidos
    if (!name.trim() || !age.trim()) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return; // Impede a execução adicional caso algum campo esteja vazio
    }

    // Limpar a mensagem de erro se os campos estiverem preenchidos
    setErrorMessage('');

    // Enviar solicitação para adicionar novo usuário
    api
      .post('/usuarios', {
        age,
        name,
      })
      .then((response) => {
        console.log(response);
        // Atualizar a lista de usuários após adicionar um novo usuário
        fetchUsers();
        // Limpar os campos de entrada
        setName('');
        setAge('');
      })
      .catch((error) => {
        console.error('Erro ao adicionar novo usuário:', error);
      });
  };

  const deleteUser = (userId) => {
    api
      .delete(`/usuarios/${userId}`)
      .then((response) => {
        console.log(response);
        // Atualizar a lista de usuários após excluir o usuário
        fetchUsers();
      })
      .catch((error) => {
        console.error('Erro ao excluir usuário:', error);
      });
  };

  return (
    <>
      <div className="container">
        <h1>Usuários:</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              Nome: {user.name} - Idade: {user.age}
              <button className="btnex" onClick={() => deleteUser(user.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
        <h2>Adicionar novo usuário</h2>
        <div className="inputbtn">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Idade"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
          />
          <button className="button" onClick={newUser}>
            Adicionar usuário
          </button>
          {/* Exibir a mensagem de erro */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default App;
