import React from 'react';
import Link from 'next/link';
import {NextSeo} from 'next-seo';
import PageLayout from '../PageLayout';

import STATIC_PATH from '../../STATIC_PATH.js';

class AdAside extends React.Component {

  constructor(){
    super();
  }

  render(){

    return (

      <PageLayout>
        <NextSeo
          title={`We Encountered an Error - PRT Scanner`}
          description="PRT Scanner is the source for real-time status and statistics for the Morgantown PRT system. Know what PRT stations are running, how long they have been down, and browse historical data on uptime!"
          noindex={true}
        />

        <div className="page-wrapper">
          <div className="error-screen">
            <h1>PRT Scanner Is Down at All Stations</h1>
            <h3>We encountered an error. <Link href='/'><a>Home</a></Link></h3>
            <img
              src={`${STATIC_PATH}/breakdown.svg`} alt="A burning PRT car"
              className="breakdown"
            />
          </div>
        </div>

      </PageLayout>
    );
  }
}

export default AdAside;
