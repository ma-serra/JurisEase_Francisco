import './Home.css';
import React, { useEffect, useState } from 'react';

import Header from '../../components/Header/Header';
import LawyerSection from '../../components/Sections/LawyerSection';
import Footer from '../../components/Footer/Footer';
import AuthPage from '../../components/Popups/AuthPage/AuthPage';
import UserManagement from '../../components/Popups/UserManagement/UserManagement';
import ActivitiesBoard from '../../components/ActivitiesBoard/ActivitiesBoard';

import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication'
import { getUser, updateUser } from '../../utils/data_base/firebase/dao/userDAO'
import { update } from 'firebase/database';
import { getCurrentFormattedDate } from '../../utils/tools/tools';

function Home() {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState('none');
  const [isUserManagement, setIsUserManagement] = useState(false);

  const toogleAuth = (type = 'none') => {
    setAuth(type)
  };

  const toogleIsUserManagement = () => {
    setIsUserManagement(!isUserManagement)
  };

  useEffect(() => {
    async function fetchUser() {
      const isAuthenticated = isUserAuthenticated();

      if (isAuthenticated) {
        try {
          const userData = await getUser(isAuthenticated);
          userData.lastLoginAt = getCurrentFormattedDate()
          await updateUser(userData)
          setUser(userData);

        } catch (e) {
          console.log(e)
        }
      }
    }

    fetchUser(); // Chame a função de busca de usuário aqui
  }, [])


  return (
    <div className={`Home`}>
      <Header openUserManagement={toogleIsUserManagement} openAuth={toogleAuth} user={user} />
      <LawyerSection />

      <ActivitiesBoard />

      {/* Popups */}
      {auth !== 'none' && (
        <AuthPage toogleAuth={toogleAuth} auth={auth} />
      )}

      {user && !!isUserManagement && (
        <UserManagement close={toogleIsUserManagement} user={user} />
      )}

      <Footer />
    </div>
  );
}

export default Home;
