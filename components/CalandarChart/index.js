import React from 'react';
import dataStore from '../../lib/data_store';
import ChartLegend from '../ChartLegend';
import moment from 'moment-timezone';

import { ResponsiveCalendar } from '@nivo/calendar';

class CalandarChart extends React.Component {

  constructor(){
    super();
    this.b_getData = this.getData.bind(this);
    this.b_onLegendFocus = this.onLegendFocus.bind(this);

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
        'Walnut':'#7a4674',
        'Beechurst':'#a4344a',
        'Engineering':'#c24146',
        'Towers':'#da6f37',
        'HSC':'#e8a353'
      };

      return colors[id];
  }

  getData(){

    let data_output = [

    ];

    let max = 0;
    let filter = this.props.filter;

    if (!filter){
      filter = this.state.focused;
    }

    for (var i = 0; i < this.props.prtData.length; i++) {

      let thisDay = this.props.prtData[i];

      if (thisDay.DataPoints.length > 0){
        data_output.push({
          day:thisDay.Day,
          value:0,
          hidden: false
        });
      }

      for (var p = 0; p < thisDay.DataPoints.length; p++) {
        let thisEvent = thisDay.DataPoints[p];

        if (( thisEvent.IsDown != "allrunning" )&&( thisEvent.IsDown != "closed")){
          if (( !filter ) || ( thisEvent.IsDown.indexOf(filter) != -1 )){
            data_output[ data_output.length - 1 ].value++;

            if (data_output[ data_output.length - 1 ].value > max) {
              max = data_output[ data_output.length - 1 ].value;
            }

          }
        }
      }
    }

    return {
      data:data_output,
      max:max
    };
  }

  render(){

    let data = this.b_getData();

    let legend_buttons = [
      {
        id:'Walnut',
        label:'Walnut',
        color:this.getColor('Walnut'),
        hidden:((this.state.focused != null)&&(this.state.focused != "Walnut"))
      },
      {
        id:'Beechurst',
        label:'Beechurst',
        color:this.getColor('Beechurst'),
        hidden:((this.state.focused != null)&&(this.state.focused != "Beechurst"))
      },
      {
        id:'Engineering',
        label:'Engineering',
        color:this.getColor('Engineering'),
        hidden:((this.state.focused != null)&&(this.state.focused != "Engineering"))
      },
      {
        id:'Towers',
        label:'Towers',
        color:this.getColor('Towers'),
        hidden:((this.state.focused != null)&&(this.state.focused != "Towers"))
      },
      {
        id:'HSC',
        label:'Health Sciences',
        color:this.getColor('HSC'),
        hidden:((this.state.focused != null)&&(this.state.focused != "HSC"))
      }
    ];

    if (this.props.filter){
      legend_buttons = [
        {
          id:this.props.filter,
          label:(this.props.filter == "HSC") ? "Health Sciences" : this.props.filter,
          color: this.getColor(this.props.filter),
          hidden: false
        }
      ];
    }

    return (
      <div className="full-chart">
        <h3 className="title">Outages by Day</h3>

        <div className="line-container">
          <div className='line-inner'>
            <ResponsiveCalendar
              data={data.data}
              from={moment().tz("America/New_York").subtract(30, 'day').format('Y-M-D')}
              to={moment().tz("America/New_York").format('Y-M-D')}
              minValue={0}
              maxValue={Math.max(5,data.max)}
              emptyColor="#eeeeee"

              margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              legends={[
                  {
                      anchor: 'bottom-right',
                      direction: 'row',
                      translateY: 36,
                      itemCount: 4,
                      itemWidth: 42,
                      itemHeight: 36,
                      itemsSpacing: 14,
                      itemDirection: 'right-to-left'
                  }
              ]}
            />
          </div>
        </div>

        <ChartLegend
          data={legend_buttons}
          chartID={"WeatherChart"}
          onClick={this.b_onLegendFocus}
        />
      </div>
    );
  }
}

export default dataStore.getListenerHOC(CalandarChart);
