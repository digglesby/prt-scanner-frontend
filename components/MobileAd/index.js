import React from 'react';
import TrackingService from '../../lib/TrackingService';

import STATIC_PATH from '../../STATIC_PATH.js';
import CONFIG from '../../lib/config.js';

class AdAside extends React.Component {

  constructor(){
    super();

    this.b_onClick = this.onClick.bind(this);
  }

  onClick(){
    TrackingService.event('promoted','ad_click_mobile',{
      ad_id:'jade'
    });
  }

  render(){

    if (!CONFIG.ads) return null;

    return (
      <div className="mobile-promo">
        <a
          href="https://jadeapp.live/"
          target="_blank"
          rel='noreferrer noopener'
          onClick={this.b_onClick}
        >
        <div className="promo-image-wrapper">
          <img
            className="promo-image"
            src={`${STATIC_PATH}/JadeMobilePromotion.png`}
            alt="Jade - Know what's happening on campus"
          />
        </div>
        </a>
        <p className="promo-disclaimer">Promoted content</p>
      </div>
    );
  }
}

export default AdAside;
