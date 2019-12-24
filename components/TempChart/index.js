import React from 'react';
import dataStore from '../../lib/data_store';
import ChartLegend from '../ChartLegend';

import { ResponsiveLine } from '@nivo/line';

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

    if (this.state.focused == id){
      this.setState({
        focused: null
      });
    } else {
      this.setState({
        focused: id
      });
    }
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
    let temps = {};

    for (var i = 0; i < stations.length; i++) {
      temps[stations[i]] = {
        "< 0°":0,
        "0-10°":0,
        "10-20°":0,
        "20-30°":0,
        "30-40°":0,
        "40-50°":0,
        "50-60°":0,
        "60-70°":0,
        "70-80°":0,
        "80-90°":0,
        "90-100°":0,
        ">= 100°":0
      };
    }

    for (var i = 0; i < this.props.prtData.length; i++) {
      let this_day = this.props.prtData[i];

      for (var p = (this_day.DataPoints.length - 1); p >= 0; p--) {
        let this_event = this_day.DataPoints[p];

        for (var x = 0; x < stations.length; x++) {
          let this_station = stations[x];

          if (this_event.StationStatus[this_station] == false){
            let temp_num = parseFloat(this_event.Temperature);

            if (temp_num < 0) temps[this_station]["< 0°"]++;

            if ((temp_num >= 0) &&
                (temp_num < 10)) temps[this_station]["0-10°"]++;
            if ((temp_num >= 10) &&
                (temp_num < 20)) temps[this_station]["10-20°"]++;
            if ((temp_num >= 20) &&
                (temp_num < 30)) temps[this_station]["20-30°"]++;
            if ((temp_num >= 30) &&
                (temp_num < 40)) temps[this_station]["30-40°"]++;
            if ((temp_num >= 40) &&
                (temp_num < 50)) temps[this_station]["40-50°"]++;
            if ((temp_num >= 50) &&
                (temp_num < 60)) temps[this_station]["50-60°"]++;
            if ((temp_num >= 60) &&
                (temp_num < 70)) temps[this_station]["60-70°"]++;
            if ((temp_num >= 70) &&
                (temp_num < 80)) temps[this_station]["70-80°"]++;
            if ((temp_num >= 80) &&
                (temp_num < 90)) temps[this_station]["80-90°"]++;
            if ((temp_num >= 90) &&
                (temp_num < 100)) temps[this_station]["90-100°"]++;

            if (temp_num >= 100) temps[this_station][">= 100°"]++;
          }

        }
      }

    }

    for (var station in temps) {

      let station_data = [];

      for (var key in temps[station]) {

        station_data.push({
          x: key,
          y: temps[station][key]
        });
      }

      data_output.push({
        id:station,
        color:this.getColor(station),
        label:(station == "HSC") ? "Health Sciences" : station,
        data:station_data,
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
        <h3 className="title">Temperature During Outages</h3>

        <div className="line-container">
          <div className='line-inner'>
            <ResponsiveLine
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
