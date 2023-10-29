import './Home.css';
import Header from '../components/Header';
import LawyerSection from '../components/LawyerSection';
import Footer from '../components/Footer';
import ServiceSection from '../components/ServicesSection';
import HeadlinesSection from '../components/HeadlinesSections';
import Search from '../components/Search';
import ChatDrawer from '../components/ChatDrawer'

import AuthPage from './AuthPage'
import { useEffect, useState } from 'react';

import { isUserAuthenticated } from '../utils/data_base/firebase/authentication'
import { getUser } from '../utils/data_base/firebase/userDAO'

function Home({ orientation, device }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState('none');

  const toogleAuth = (type = 'none') => {
    setAuth(type)
  };

  useEffect(() => {
    async function fetchUser() {
      const isAuthenticated = isUserAuthenticated();

      if (isAuthenticated) {
          const userData = await getUser(isAuthenticated);
          setUser(userData);
          console.log(userData)
      }

      setAuthenticated(isAuthenticated);
  }

  fetchUser(); // Chame a função de busca de usuário aqui
  }, [])

  return (
    <div className={`Home`}>
      <Header orientation={orientation} device={device} openAuth={toogleAuth} user={user} />
      <LawyerSection orientation={orientation} device={device} />
      <div className='search-main'>
        <Search orientation={orientation} device={device} />
      </div>
      <ServiceSection orientation={orientation} device={device} permisionEdit={(user && user.acessAdmin)} />
      <HeadlinesSection orientation={orientation} device={device} permisionEdit={(user && user.acessAdmin)} />
      <Footer orientation={orientation} device={device} />
      <ChatDrawer orientation={orientation} device={device} />

      {auth !== 'none' && (
        <AuthPage device={device} toogleAuth={toogleAuth} auth={auth} />
      )}

    </div>
  );
}

export default Home;
