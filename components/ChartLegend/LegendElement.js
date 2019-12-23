import React from 'react';

class LegendElement extends React.Component {

  constructor(){
    super();

    this.b_onClick = this.onClick.bind(this);
  }

  onClick(){
    if (this.props.onClick){
      this.props.onClick(this.props.id);
    }
  }

  pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
      darkColor : lightColor;
  }

  render(){

    let additional = null;

    if (typeof this.props.value == 'number') {

      if (Number.isInteger(this.props.value)){
        additional = (<strong>({this.props.value})</strong>);
      } else {
        additional = (<strong>({this.props.value.toFixed(2)})</strong>);
      }
    }

    return (
      <label
        style={(!this.props.hidden) ? {
          backgroundColor:  this.props.color,
          color: this.pickTextColorBasedOnBgColorSimple( this.props.color, '#fff', 'rgb(50,50,50)' )
        } : {}}
        className="legend-element"
        htmlFor={this.props.chartID}
        onClick={this.b_onClick}
      >
        {this.props.label} {additional}
      </label>
    );
  }
}

export default LegendElement;
