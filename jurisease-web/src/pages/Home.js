import './Home.css';
import Header from '../components/Header';
import LawyerSection from '../components/LawyerSection';
import Footer from '../components/Footer';
import ServiceSection from '../components/ServicesSection';
import HeadlinesSection from '../components/HeadlinesSections';
import Search from '../components/Search';
import ChatDrawer from '../components/ChatDrawer'

import AuthPage from '../components/AuthPage'
import UserManagement from '../components/UserManagement';

import { useEffect, useState } from 'react';

import { isUserAuthenticated } from '../utils/data_base/firebase/authentication'
import { getUser } from '../utils/data_base/firebase/dao/userDAO'

function Home({ orientation, device }) {
  const [authenticated, setAuthenticated] = useState(false);
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

      setAuthenticated(isAuthenticated);
    }

    fetchUser(); // Chame a função de busca de usuário aqui
  }, [])

  return (
    <div className={`Home`}>
      <Header openUserManagement={toogleIsUserManagement} openAuth={toogleAuth} user={user} />
      <LawyerSection />
      {/* 
      <div className='search-main'>
        <Search />
      </div>
      <ServiceSection permisionEdit={(user && user.acessAdmin)} />
      <HeadlinesSection permisionEdit={(user && user.acessAdmin)} />
      
      <ChatDrawer />
      */}

      {auth !== 'none' && (
        <AuthPage device={device} toogleAuth={toogleAuth} auth={auth} />
      )}

      {user && !!isUserManagement && (
        <UserManagement device={device} close={toogleIsUserManagement} user={user} />
      )}

      <Footer />
    </div>
  );
}

export default Home;
