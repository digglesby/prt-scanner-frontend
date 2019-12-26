import React from 'react';
import TrackingService from '../../lib/TrackingService';

import STATIC_PATH from '../../STATIC_PATH.js';

class AdAside extends React.Component {

  constructor(){
    super();

    this.b_onClick = this.onClick.bind(this);
  }

  onClick(){
    TrackingService.event('promoted','ad_click_desktop',{
      ad_id:"jade"
    });
  }

  render(){

    return (
      <div className="promo">
        <a
          href="https://jadeapp.live/"
          target="_blank"
          rel='noreferrer noopener'
          onClick={this.b_onClick}
        >
        <div className="promo-image-wrapper">
          <img
            className="promo-image"
            src={`${STATIC_PATH}/JadePromotion.png`}
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
