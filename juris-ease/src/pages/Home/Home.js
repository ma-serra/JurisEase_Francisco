import './Home.css';
import React from 'react';

import Header from '../../components/Header/Header';
import LawyerSection from '../../components/Sections/LawyerSection';
import Footer from '../../components/Footer/Footer';
import ActivitiesBoard from '../../components/ActivitiesBoard/ActivitiesBoard';


function Home({user, fetchUser}) {
  return (
    <div className={`Home`}>
      <Header user={user} fetchUser={fetchUser} />
      <LawyerSection />
      <ActivitiesBoard user={user}/>
      <Footer />
    </div>
  );
}

export default Home;
