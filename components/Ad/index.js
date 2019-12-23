import React from 'react';

import STATIC_PATH from '../../STATIC_PATH.js';

class AdAside extends React.Component {

  constructor(){
    super();
  }

  render(){

    return (
      <div className="promo">
        <a
          href="https://jadeapp.live/"
          target="_blank"
          rel='noreferrer noopener'
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
