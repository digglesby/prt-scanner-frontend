import React from 'react';
import data_store from '../../lib/data_store';

class Station extends React.Component {

  constructor(){
    super();
  }

  render(){

    let days_open = 0;
    let outage_avg_total = 0;

    let total_time = 0;
    let down_time = 0;
    let outage_total = 0;
    let outage_count = 0;

    for (var i = 0; i < this.props.prtData.length; i++) {
      let this_day = this.props.prtData[i];

      if (this.props.prtData[i].DataPoints.length > 0){
        days_open++;
      }

      for (var p = 0; p < this_day.DataPoints.length; p++) {
        let this_event = this_day.DataPoints[p];

        if ((this_event.IsDown != "allrunning") && (!this_event.IsClosed)){
          outage_avg_total = outage_avg_total + ( this_event.DownCount );
        }

        if (p-1 >= 0){
          let next_event = this_day.DataPoints[p-1];

          let time_diff = next_event.DateStamp - this_event.DateStamp;

          if ((this_event.IsDown != "allrunning") && (!this_event.IsClosed)){
            outage_total = outage_total + time_diff;
            down_time = down_time + time_diff;
          }

          if ((this_event.IsDown != "allrunning") && (next_event.IsDown == "allrunning")){
            outage_count++;
          }

          total_time = total_time + time_diff;
        }

      }
    }


    let outage_avg = outage_avg_total/days_open;
    let down_rate = (down_time/total_time);
    let outage_length_avg = (outage_total/outage_count);

    let outage_duration_hours = outage_length_avg/(1000*60*60);
    let outage_duration_mins = outage_length_avg/(1000*60);
    let outage_duration_seconds = outage_length_avg/(1000);
    let outage_duration_text = "";


    if (outage_duration_hours > 1) {
      outage_duration_text = `${ outage_duration_hours.toFixed(2) } Hour${ (outage_duration_hours == 0) ? "" : "s" }`;
    } else if (outage_duration_mins > 1) {
      outage_duration_text = `${ outage_duration_mins.toFixed(2) } Minute${ (outage_duration_mins == 0) ? "" : "s" }`;
    } else {
      outage_duration_text = `${ outage_duration_seconds.toFixed(2) } Second${ (outage_duration_seconds == 0) ? "" : "s" }`;
    }

    return (
      <div className="average-data">
        <h3 className="stat">
          Stations Down Per Day
          <span className='Walnut-text'>{outage_avg.toFixed(2)}</span>
        </h3>
        <h3 className="stat">
          System Uptime
          <span className='Engineering-text'>{((1-down_rate)*100).toFixed(3)}%</span>
        </h3>
        <h3 className="stat">
          Average Outage Time
          <span className='HSC-text'>{outage_duration_text}</span>
        </h3>
      </div>
    );
  }
}

export default data_store.getListenerHOC(Station);
