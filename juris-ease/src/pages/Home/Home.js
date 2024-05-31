import './Home.css';
import React, { useEffect, useState } from 'react';

import Header from '../../components/Header/Header';
import LawyerSection from '../../components/Sections/LawyerSection';
import Footer from '../../components/Footer/Footer';
import ActivitiesBoard from '../../components/ActivitiesBoard/ActivitiesBoard';

import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getUser, updateUser } from '../../utils/data_base/firebase/dao/userDAO';
import { getCurrentFormattedDate } from '../../utils/tools/tools';
import ChatDrawer from '../../components/ChatDrawer/ChatDrawer';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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

    fetchUser();
  }, []);

  return (
    <div className={`Home`}>
      <Header user={user} />
      <LawyerSection />
      <ActivitiesBoard />
      <Footer />
    </div>
  );
}

export default Home;
