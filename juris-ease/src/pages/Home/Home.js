import './Home.css';
import Header from '../../components/Header/Header';
import LawyerSection from '../../components/LawyerSection/LawyerSection';
import Footer from '../../components/Footer/Footer';

import AuthPage from '../../components/Popups/AuthPage/AuthPage';
import UserManagement from '../../components/Popups/UserManagement/UserManagement';
import ActivitiesBoard from '../../components/ActivitiesBoard/ActivitiesBoard';
import { useEffect, useState } from 'react';

import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication'
import { getUser } from '../../utils/data_base/firebase/dao/userDAO'
import ChatDrawer from '../../components/ChatDrawer/ChatDrawer';

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
        const userData = await getUser(isAuthenticated);
        setUser(userData);
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

      <ChatDrawer/>
    </div>
  );
}

export default Home;
