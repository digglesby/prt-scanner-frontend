import React from 'react';
import {NextSeo} from 'next-seo';
import DataStore from '../lib/data_store';
import TrackingService from '../lib/TrackingService';

import PageLayout from '../components/PageLayout';
import AsideLayout from '../components/AsideLayout';
import Ad from '../components/Ad';
import MobileAd from '../components/MobileAd';
import WeatherChart from '../components/WeatherChart';
import TimeChart from '../components/TimeChart';
import CalandarChart from '../components/CalandarChart';
import StationStatus from '../components/StationStatus';
import ErrorPage from '../components/ErrorScreen';
import TempChart from '../components/TempChart';

import STATIC_PATH from '../STATIC_PATH.js';

class Station extends React.Component {

  constructor(){
    super();
  }

  getStationName(id){
    let names = {
      'Walnut':'Walnut',
      'Beechurst': 'Beechurst',
      'Engineering': 'Engineering',
      'Towers': 'Towers',
      'HSC': 'Health Sciences'
    };

    return names[id];
  }

  render() {

    if (this.getStationName(this.props.id)){
  		return (
        <PageLayout>
          <NextSeo
            title={`${this.getStationName(this.props.id)} PRT Station Status and Statistics - PRT Scanner`}
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

          <div className="page-wrapper">
            <StationStatus
              id={this.props.id}
            />
            <MobileAd />
            <AsideLayout
              aside={()=>{
                return [
                  <Ad key={0} />,
                  <WeatherChart
                    key={1}
                    filter={this.props.id}
                  />,
                ];
              }}
            >
              <TimeChart
                filter={this.props.id}
              />
              <TempChart
                filter={this.props.id}
              />
            </AsideLayout>

            <CalandarChart
              filter={this.props.id}
            />
          </div>

        </PageLayout>
  		);
    } else {
      return (
        <ErrorPage />
      );
    }
  }

  componentWillMount(){
    DataStore.setData(this.props.prt_data);
  }

  componentDidMount(){
    TrackingService.pageView();
  }

  static async getInitialProps(context){

    const { id } = context.query;

    return {
      id,
      prt_data:await DataStore.loadData()
    };

  }
}


export default Station;
