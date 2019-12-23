import React from 'react';
import data_store from '../../lib/data_store';
import Link from 'next/link';
import { FiChevronRight } from "react-icons/fi";

class Station extends React.Component {

  constructor(){
    super();
  }

  render(){

    let state = "down";

    let status_text = "Currently Down";
    let last_outage_text = "No outages today";


    if (this.props.prtData.length > 1){
      if (this.props.prtData[0].DataPoints.length > 1){

        if (this.props.prtData[0].DataPoints[0].IsClosed == true){
          state = "closed";
          status_text = "The PRT is closed";
        }else{

          if (this.props.prtData[0].DataPoints[0].StationStatus[this.props.id] == true){

            state = "up";
            status_text = "Running";
          } else {

            state = "down";
            status_text = "Currently Down";
          }

        }
      } else {

        state = "closed";
        status_text = "The PRT is closed";
      }
    }

    if (this.props.prtData.length > 1){
      if (this.props.prtData[0].DataPoints.length > 1){

        let last_outage = -1;

        for (var i = 0; i < this.props.prtData[0].DataPoints.length; i++) {
          if (this.props.prtData[0].DataPoints[i].StationStatus[this.props.id] == false){

            last_outage = this.props.prtData[0].DataPoints[i].DateStamp;

            break;
          }
        }

        if (last_outage != -1){
          let outage_duration = new Date().getTime() - last_outage;

          let outage_duration_hours = outage_duration/(1000*60*60);
          let outage_duration_mins = outage_duration/(1000*60);
          let outage_duration_seconds = outage_duration/(1000);

          if (outage_duration_hours > 1) {
            last_outage_text = `${ outage_duration_hours.toFixed(2) } hour${ (outage_duration_hours == 0) ? "" : "s" } ago`;
          } else if (outage_duration_mins > 1) {
            last_outage_text = `${ outage_duration_mins.toFixed(2) } minute${ (outage_duration_mins == 0) ? "" : "s" } ago`;
          } else {
            last_outage_text = `${ outage_duration_seconds.toFixed(2) } second${ (outage_duration_seconds == 0) ? "" : "s" } ago`;
          }

          if (state == "down"){
            last_outage_text = "This station went down " + last_outage_text;
          } else {
            last_outage_text = "Last outage happened " + last_outage_text;
          }

        } else {
          last_outage_text = "No outages today!";
        }


      }
    }

    return (
      <Link href={`/station?id=${this.props.id}`} as={`/station/${this.props.id}`}>
        <a className="station">
          <div className="left-section">
            <h2 className={`name ${this.props.id}-text ${ state }`}>{this.props.name}</h2>
          </div>

          <div className="right-section">
            <div className="station-status-text">
              <h3>{status_text}</h3>
              <p>{last_outage_text}.</p>
            </div>
          </div>

          <div className="station-status-icon">
            <FiChevronRight />
          </div>
        </a>
      </Link>
    );
  }
}

export default data_store.getListenerHOC(Station);
