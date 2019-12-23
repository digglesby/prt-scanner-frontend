import React from 'react';
import Station from './Station.js';

class StationList extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <div className="station-list-wrapper">
        <Station name="Beechurst" id="Beechurst"/>
        <Station name="Engineering" id="Engineering"/>
        <Station name="Towers" id="Towers"/>
        <Station name="Health Sciences" id="HSC"/>
        <Station name="Walnut" id="Walnut"/>
      </div>


    );
  }
}

export default StationList;
