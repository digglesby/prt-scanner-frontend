import React from 'react';
import LegendElement from './LegendElement.js';

class ChartLegend extends React.Component {

  constructor(){
    super();
  }

  render(){

    let legendElements = [];

    for (var i = 0; i < this.props.data.length; i++) {
      legendElements.push(
        <LegendElement
          key={this.props.data[i].id}
          id={this.props.data[i].id}
          label={this.props.data[i].label}
          color={this.props.data[i].color}
          chartID={this.props.chartID}
          value={this.props.data[i].value}
          onClick={this.props.onClick}
          hidden={this.props.data[i].hidden}
        />
      );

    }

    return (
      <div className='chart-legend'>
        {legendElements}
      </div>
    );
  }
}

export default ChartLegend;
