/*
  global window: true
*/
const GOOGLE_ANALYTICS_ID = "UA-155010927-1";


class TrackingService {
  constructor(){
    if (process.browser){
      this.ReactGA = require('react-ga');

      this.ReactGA.initialize( GOOGLE_ANALYTICS_ID );
    }
  }

  pageView( page_name ){
    if (process.browser) {
      const page = (page_name) ? page_name : window.location.pathname;

      console.log("PAGE VIEW: "+page);

      this.ReactGA.set({ page });
      this.ReactGA.pageview(page);
    }
  }

  event(category,action,params = {}){
    if (process.browser) {
      params.category = category;
      params.action = action;
      this.ReactGA.event(params);
    }
  }
}

export default new TrackingService();
