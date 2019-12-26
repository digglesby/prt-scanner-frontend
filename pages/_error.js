import React from 'react';
import ErrorPage from '../components/ErrorScreen';
import TrackingService from '../lib/TrackingService';

class Error extends React.Component {
  render() {
		return (
      <ErrorPage />
		);
  }

  componentDidMount(){
    TrackingService.pageView();
  }

  static async getInitialProps(){
    return {};
  }
}


export default Error;
