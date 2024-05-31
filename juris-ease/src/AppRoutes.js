import React, { useEffect, useState } from 'react';

import Home from './pages/Home/Home';
import GenerateDocks from './pages/GenerateDocks/GenerateDocks';
import Template from './pages/Template/Template';
import ManegeUsers from './pages/ManegeUsers/ManegeUsers';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { isUserAuthenticated } from './utils/data_base/firebase/authentication';
import { getUser, updateUser } from './utils/data_base/firebase/dao/userDAO';
import { getCurrentFormattedDate } from './utils/tools/tools';


function AppRoutes() {
  const [user, setUser] = useState(null);

  async function fetchUser() {
    const isAuthenticated = isUserAuthenticated();

    if (isAuthenticated) {
      try {
        const userData = await getUser(isAuthenticated);
        userData.lastLoginAt = getCurrentFormattedDate();
        await updateUser(userData);
        setUser(userData);
      } catch (e) {
        console.log(e);
      }
    }
  }

  // fetchUser()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} fetchUser={fetchUser}/>} />
        <Route path="/generate-docks" element={<GenerateDocks user={user}/>} />
        <Route path="/templates" element={<Template user={user}/>} />
        <Route path="/manege-users" element={<ManegeUsers user={user}/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
