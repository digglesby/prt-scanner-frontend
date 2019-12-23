import React from 'react';

class AdAside extends React.Component {

  constructor(){
    super();
  }

  render(){

    return (
      <div className="aside-container">
        <div className="aside-center">
          {this.props.children}
        </div>
        <div className="aside">
          {this.props.aside()}
        </div>
      </div>
    );
  }
}

export default AdAside;
