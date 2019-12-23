import React from 'react';
import ErrorPage from '../components/ErrorScreen';

class Error extends React.Component {
  render() {
		return (
      <ErrorPage />
		);
  }

  static async getInitialProps(){
    return {};
  }
}


export default Error;
