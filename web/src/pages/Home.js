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

import { getUser } from '../utils/data_base/firebase/userDAO'
import { isUserAuthenticated } from '../utils/data_base/firebase/authentication'

function Home({ orientation, device }) {

  const [auth, setAuth] = useState('none');

  const toogleAuth = (type = 'none') => {
    console.log('toogleAuth:', type)
    setAuth(type)
  };

  useEffect(() => {
    const fetchUser = async () => {
      const uid = isUserAuthenticated()
      const user = await getUser(uid);
      console.log(user);
    };
  
    fetchUser();
  }, []);

  return (
    <div className={`Home`}>
      <Header orientation={orientation} device={device} openAuth={toogleAuth} />
      <LawyerSection orientation={orientation} device={device} />
      <div className='search-main'>
        <Search orientation={orientation} device={device} />
      </div>
      <ServiceSection orientation={orientation} device={device} />
      <HeadlinesSection orientation={orientation} device={device} />
      <Footer orientation={orientation} device={device} />
      <ChatDrawer orientation={orientation} device={device} />

      {auth !== 'none' && (
        <AuthPage device={device} toogleAuth={toogleAuth} auth={auth} />
      )}

    </div>
  );
}

export default Home;
