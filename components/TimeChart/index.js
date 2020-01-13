import React from 'react';
import dataStore from '../../lib/data_store';
import ChartLegend from '../ChartLegend';
import moment from 'moment-timezone';
import TrackingService from '../../lib/TrackingService';

import { ResponsiveLineCanvas } from '@nivo/line';

class AdAside extends React.Component {

  constructor(){
    super();
    this.b_getData = this.getData.bind(this);
    this.b_onLegendFocus = this.onLegendFocus.bind(this);
    this.b_customTooltip = this.customTooltip.bind(this);

    this.state = {
      focused:null
    };
  }

  onLegendFocus(id){

    let new_focus = null;

    if (this.state.focused == id){
      new_focus = null;
    } else {
      new_focus = id;
    }

    this.setState({
      focused: new_focus
    });

    TrackingService.event('chart_interaction','temp_legend_focus',{
      station:(new_focus == null) ? 'all' : new_focus
    });
  }

  customTooltip(e){

    return (
      <div className="graph-tooltip">
        <p><span style={{backgroundColor:e.point.serieColor}}></span>{e.point.serieId}:</p>
        <p>{e.point.data.y} outage{(e.point.data.y != 1) ? "s" : ""} at {e.point.data.x}</p>
      </div>
    );
  }

  getColor(id){
      const colors = {
        'Walnut':'#7a4674',
        'Beechurst':'#a4344a',
        'Engineering':'#c24146',
        'Towers':'#da6f37',
        'HSC':'#e8a353'
      };

      return colors[id];
  }

  getData(){
    let stations = [
      'Walnut',
      'Beechurst',
      'Engineering',
      'Towers',
      'HSC'
    ];

    if (this.props.filter){
      stations = [this.props.filter];
    }

    let data_output = [];
    let outage_periods = {};

    for (var i = 0; i < stations.length; i++) {
      outage_periods[stations[i]] = [];
    }

    for (var i = 0; i < this.props.prtData.length; i++) {
      let this_day = this.props.prtData[i];

      for (var p = (this_day.DataPoints.length - 1); p >= 0; p--) {
        let this_event = this_day.DataPoints[p];

        for (var station in outage_periods) {
          let last_period = [];

          if (outage_periods[station].length > 0) {
            last_period = outage_periods[station][outage_periods[station].length - 1];
          }

          if ((!this_event.StationStatus[station]) && (last_period.length != 1)) {
            //Add duration start

            outage_periods[station][outage_periods[station].length] = [
              parseInt(moment(this_event.DateStamp).tz("America/New_York").format('H'))
            ];
          } else if ((this_event.StationStatus[station]) && (last_period.length == 1)){
            //End duration

            outage_periods[station][outage_periods[station].length - 1].push(
              parseInt(moment(this_event.DateStamp).tz("America/New_York").format('H'))
            );
          }

        }

      }

      for (var station in outage_periods) {
        //Ensure all durations are ended for the day

        if (outage_periods[station].length > 1) {
          let last_period = outage_periods[station][outage_periods[station].length - 1];

          if (last_period.length == 1){

            outage_periods[station][outage_periods[station].length - 1].push(22);
          }
        }
      }

    }

    for (var station in outage_periods) {
      let this_station_value = {
        '6AM':0,
        '7AM':0,
        '8AM':0,
        '9AM':0,
        '10AM':0,
        '11AM':0,
        '12PM':0,
        '1PM':0,
        '2PM':0,
        '3PM':0,
        '4PM':0,
        '5PM':0,
        '6PM':0,
        '7PM':0,
        '8PM':0,
        '9PM':0,
        '10PM':0
      };
      let this_station_data = [];



      for (var i = 0; i < outage_periods[station].length; i++) {
        let this_period = outage_periods[station][i];



        for (var p = this_period[0]; p <= this_period[1]; p++) {

          let hour = p;
          let am = true;

          if (hour > 12){
            hour = hour - 12;
            am = false;
          } else if (hour == 12) {
            am = false;
          }

          this_station_value[`${hour}${(am) ? "AM" : "PM"}`]++;
        }
      }

      for (var key in this_station_value) {
        this_station_data.push({
          x: key,
          y: this_station_value[key]
        });
      }

      data_output.push({
        id:station,
        color:this.getColor(station),
        label:(station == "HSC") ? "Health Sciences" : station,
        data:this_station_data,
        hidden: ((this.state.focused != null) && (this.state.focused != station))
      });
    }

    return data_output;
  }

  render(){

    let data = this.b_getData();
    let graph_data = [];

    for (var i = 0; i < data.length; i++) {
      if (!data[i].hidden) graph_data.push(data[i]);
    }

    /*

    */

    return (
      <div className="full-chart">
        <h3 className="title">Station Down Times</h3>

        <div className="line-container">
          <div className='line-inner'>
            <ResponsiveLineCanvas
              data={graph_data}
              margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  orient: 'bottom',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'transportation',
                  legendOffset: 36,
                  legendPosition: 'middle'
              }}
              axisLeft={null}
              colors={(line) => { return this.getColor(line.id); }}
              pointSize={5}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              tooltip={this.b_customTooltip}
              pointLabelYOffset={-12}
              useMesh={true}
              enableGridX={false}
              enableGridY={false}
              enableArea={true}
              areaOpacity={0.25}
              />
          </div>
        </div>

        <ChartLegend
          data={data}
          chartID={"WeatherChart"}
          onClick={this.b_onLegendFocus}
        />
      </div>
    );
  }
}

export default dataStore.getListenerHOC(AdAside);
