import React from 'react';
import Link from 'next/link';
import dataStore from '../../lib/data_store';

class StationLink extends React.Component {

  constructor(){
    super();
  }

  render(){

    let state = "closed";
    let alert = null;

    console.log(this.props.prtData);

    if (this.props.prtData.length > 0){
      if (this.props.prtData[0].DataPoints.length > 0){

        if (this.props.prtData[0].DataPoints[0].IsClosed == true){
          state = "closed";
        }else{

          if (this.props.prtData[0].DataPoints[0].StationStatus[this.props.id] == true){

            state = "up";
          } else {

            alert = (<span>!</span>);
            state = "down";
          }

        }

      }
    }

    return (
      <Link href={`/station?id=${this.props.id}`} as={`/station/${this.props.id}`}>
        <a className={[
          "header-station",
          this.props.id,
          state
        ].join(" ")}>
          {this.props.name}{alert}
        </a>
      </Link>
    );
  }
}

export default dataStore.getListenerHOC(StationLink);
