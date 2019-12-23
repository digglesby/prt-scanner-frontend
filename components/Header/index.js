import React from 'react';
import StationLink from './StationLink.js';
import StatusBar from './StatusBar.js';
import Link from 'next/link';

import STATIC_PATH from '../../STATIC_PATH.js';

class Header extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <header className="header-container">
        <div className="header-wrapper">
          <Link href='/'>
            <a>
              <img
                src={`${STATIC_PATH}/SimpleLogo.svg`} alt="PRT Scanner"
                className="logo"
              />
            </a>
          </Link>
        </div>

        <div className="header-wrapper">
          <section className="header-station-wrapper">
            <StationLink name="Walnut" id="Walnut"/>
            <StationLink name="Beechurst" id="Beechurst"/>
            <StationLink name="Engineering" id="Engineering"/>
            <StationLink name="Towers" id="Towers"/>
            <StationLink name="Health Sciences" id="HSC"/>
          </section>
        </div>

        <StatusBar />
      </header>


    );
  }
}

export default Header;
