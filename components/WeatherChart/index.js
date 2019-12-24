import React from 'react';
import dataStore from '../../lib/data_store';
import ChartLegend from '../ChartLegend';

import { ResponsivePie } from '@nivo/pie';

class AdAside extends React.Component {

  constructor(){
    super();
    this.b_getData = this.getData.bind(this);
    this.b_onLegendFocus = this.onLegendFocus.bind(this);
    this.b_getLabelColor = this.getLabelColor.bind(this);

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

  getColor(id){
      const colors = {
        "clear":"#a3adbf",
        "clouds":"#666474",
        "snow":"#cacaca",
        "rain":"#4d6987",
        "mist":"#839c97",
        "fog":"#b1b1b3"
      };

      return colors[id];
  }

  pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
      darkColor : lightColor;
  }

  getLabelText(e){
    return `${Math.round(e.percent*100)}%`;
  }

  getLabelColor(e){

    return this.pickTextColorBasedOnBgColorSimple(e.color, '#fff', "rgb(50,50,50)");
  }

  getData(){

    let labels = {
      "clear":"Clear",
      "clouds":"Clouds",
      "snow":"Snow",
      "rain":"Rain",
      "mist":"Mist",
      "fog":"Fog"
    };

    let total = 0;

    let weather_count = {
      "clear":0,
      "clouds":0,
      "snow":0,
      "rain":0,
      "mist":0,
      "fog":0
    };

    for (var i = 0; i < this.props.prtData.length; i++) {

      for (var p = 0; p < this.props.prtData[i].DataPoints.length; p++) {

        if ((this.props.prtData[i].DataPoints[p].IsDown != "allrunning") && (this.props.prtData[i].DataPoints[p].IsDown != "closed")){

          if ((!this.props.filter) || (this.props.prtData[i].DataPoints[p].IsDown.indexOf( this.props.filter ) != -1)) {
            let weather = this.props.prtData[i].DataPoints[p].Weather;
            let count = ( this.props.prtData[i].DataPoints[p].DownCount );

            if (this.props.filter) count = 1;

            weather_count[weather] = weather_count[weather] + count;
            total = total + count;
          }

        }
      }
    }

    let return_arr = [];

    for (var key in weather_count) {

      if (weather_count[key] > 0){
        return_arr.push({
          "id": key,
          "label": labels[key],
          "color": this.getColor(key),
          "value": weather_count[key],
          "hidden": ((this.state.focused != null) && (this.state.focused != key)),
          "percent": weather_count[key]/total
        });
      }
    }

    return_arr.sort((a,b) => {
      return a.value - b.value;
    });

    return return_arr;
  }

  render(){

    let data = this.b_getData();
    let graph_data = [];
    let chart = ( <h1>No data!</h1> );

    for (var i = 0; i < data.length; i++) {
      if (!data[i].hidden) graph_data.push(data[i]);
    }

    if (graph_data.length > 0){
      chart = (
        <ResponsivePie
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          sortByValue={false}
          innerRadius={0.65}
          padAngle={1}
          colors={(bar) => { return this.getColor(bar.id); }}
          borderWidth={1}
          borderColor={{ from: 'color' }}
          enableRadialLabels={false}
          radialLabelsSkipAngle={0}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: 'color' }}
          slicesLabelsSkipAngle={0}
          slicesLabelsTextColor={this.b_getLabelColor}
          sliceLabel={this.getLabelText}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      );
    }

    return (
      <div className="aside-chart">
        <h3 className="title">Weather During Outages</h3>

        <div className="pie-container">
          <div
            className="pie-inner"
            aria-label="Pie Chart Showing Outages by Weather Type"
            role="img"
            id="WeatherChart"
          >
            { chart }
          </div>
        </div>

        <ChartLegend
          data={data}
          chartID={"WeatherChart"}
        />
      </div>
    );
  }
}

export default dataStore.getListenerHOC(AdAside);
