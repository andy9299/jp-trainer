import React, { useEffect, useState } from 'react';
import { BrowserRouter, redirect } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AppNavBar from './nav/AppNavBar';
import jwt from 'jsonwebtoken';
import useLocalStorageState from './hooks/useLocalStorageState';
import JpTrainerApi from './api/JpTrainerApi';
import UserContext from './context/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorageState('jp-trainer-token', null);

  useEffect(() => {
    async function getCurrentUser() {
      if (token) {
        try {
          const { username } = jwt.decode(token);
          JpTrainerApi.token = token;
          setCurrentUser((await JpTrainerApi.getUser(username)).user);
        }
        catch (err) {
          alert("Error loading user");
          setCurrentUser(null);
          redirect('/');
        }
      }
      else {
        setCurrentUser(null);
      }
    }
    getCurrentUser();
  }, [token]);

  async function register(registerInfo) {
    try {
      const newToken = await JpTrainerApi.register(registerInfo);
      setToken(newToken.token);
    }
    catch (err) {
      throw err;
    }
  }

  async function editProfile(userDetails) {
    try {
      const editedUser = await JpTrainerApi.editUser(currentUser.username, userDetails);
      setCurrentUser(editedUser.user);
    }
    catch (err) {
      throw err;
    }
  }

  async function login(loginInfo) {
    try {
      const newToken = await JpTrainerApi.getToken(loginInfo);
      setToken(newToken.token);
    }
    catch (err) {
      throw err;
    }
  }

  function logout() {
    JpTrainerApi.token = null;
    setToken(null);
    redirect('/');
  }

  return (
    <UserContext.Provider value={{
      register,
      login,
      logout,
      editProfile,
      currentUser
    }}>
      <BrowserRouter>
        <AppNavBar />
        <AppRoutes />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
