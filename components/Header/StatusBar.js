import React from 'react';
import dataStore from '../../lib/data_store';

class StatusBar extends React.Component {

  constructor(){
    super();
  }

  render(){

    let bar = <h2 className="header-bar closed">The PRT is closed!</h2>;

    if (this.props.prtData.length > 1){
      if (this.props.prtData[0].DataPoints.length > 1){

        if (!this.props.prtData[0].DataPoints[0].IsClosed){

          let station_names = [];

          for (var key in this.props.prtData[0].DataPoints[0].StationStatus) {
            if (this.props.prtData[0].DataPoints[0].StationStatus[key] == false){
              station_names.push( (key == "HSC") ? "Health Sciences" : key );
            }
          }

          if (station_names.length == 0){
            bar = null;
          } else if (station_names.length == 5) {
            bar = <h2 className="header-bar down">The PRT is down at all stations!</h2>;
          } else {
            let prt_text = "The PRT is down at";

            for (var i = 0; i < station_names.length; i++) {

              if (i == (station_names.length - 1)){
                  prt_text = prt_text + ((station_names.length > 2) ? "," : "") + " and ";
              } else {
                prt_text = prt_text + ((i == 0) ? " " : ", ");
              }

              prt_text = prt_text + station_names[i];
            }

            bar = <h2 className="header-bar down">{prt_text}!</h2>;
          }

        }


      }
    }

    return (
      bar
    );
  }
}

export default dataStore.getListenerHOC(StatusBar);
