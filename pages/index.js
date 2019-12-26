import React from 'react';
import {NextSeo} from 'next-seo';
import DataStore from '../lib/data_store';
import TrackingService from '../lib/TrackingService';

import StationList from '../components/StationList';
import PageLayout from '../components/PageLayout';
import AverageData from '../components/AverageData';
import NotificationButton from '../components/NotificationButton';
import AsideLayout from '../components/AsideLayout';
import Ad from '../components/Ad';
import MobileAd from '../components/MobileAd';
import WeatherChart from '../components/WeatherChart';
import TimeChart from '../components/TimeChart';
import CalandarChart from '../components/CalandarChart';

import STATIC_PATH from '../STATIC_PATH.js';

class Index extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (

      <PageLayout>
        <NextSeo
          title="PRT Scanner - WVU PRT Status and Statistics in Morgantown"
          description="PRT Scanner is the source for real-time status and statistics for the Morgantown PRT system. Know what PRT stations are running, how long they have been down, and browse historical data on uptime!"
          openGraph={{
            url: 'https://prtscanner.com/',
            title: 'PRT Scanner',
            description: 'PRT Scanner is the source for real-time status and statistics for the Morgantown PRT system. Know what PRT stations are running, how long they have been down, and browse historical data on uptime!',
            images: [
              {
                url: STATIC_PATH+'/thumbnail2.jpg',
                width: 1200,
                height: 800,
                alt: 'A PRT car taveling down the track.',
              }
            ],
            site_name: 'PRT Scanner',
          }}
          twitter={{
            handle: '@prtscanner',
            site: '@prtscanner',
            cardType: 'summary_large_image',
          }}
        />

        <div className="info-bg-img" style={{
          backgroundImage:`url("${STATIC_PATH}/prt_graphic_grey.jpg")`
        }}>
          <div className="info-bg">
            <div className="info-container">
              <h1>Know When the PRT is Down</h1>
              <p>PRTScanner.com shows the current status and statistics of the PRT as reported by WVU.</p>
              <NotificationButton />
            </div>
          </div>
        </div>

        <div className="page-wrapper">
          <AverageData />
          <MobileAd />
          <AsideLayout
            aside={()=>{
              return [
                <Ad key={0} />,
                <WeatherChart key={1}/>
              ];
            }}
          >
            <StationList />
            <TimeChart />
          </AsideLayout>

          <CalandarChart />
        </div>

      </PageLayout>
    );
  }

  componentDidMount(){
    TrackingService.pageView();
  }

  componentWillMount(){
    DataStore.setData(this.props.prt_data);
  }

  static async getInitialProps(){

    return {
      prt_data:await DataStore.loadData()
    };
  }
}

export default Index;
