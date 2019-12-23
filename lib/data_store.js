import React from 'react';
import dataInjestor from './data_injestor.js';
import fetch from 'isomorphic-unfetch';
import uuidv4 from 'uuid/v4';

let currentData = [];
let listeners = {

};

async function loadData(){
  let res = {json: ()=>{return require("../static/testdata.json");}};
  //let res = await fetch("https://watjl80v2k.execute-api.us-east-1.amazonaws.com/Test1");
  let prt_data = await res.json();

  prt_data = dataInjestor(prt_data);

  return prt_data;
}

async function updateData(){
  currentData = loadData();
}

function setData(data){
  currentData = [...data];
}

function getCurrentData(){
  return currentData;
}

function getListenerHOC(Component){
  return class Listener extends React.Component{

    constructor(){
      super();
      this.state = {};
    }

    changed(){
      this.forceUpdate();
    }

    componentWillMount(){
      let uuid = uuidv4();

      listeners[uuid] = this;

      this.setState({
        uuid
      });
    }

    render(){
      return (
        <Component {...this.props} prtData={getCurrentData()} />
      );
    }

    componentWillUnmount(){
      delete listeners[this.state.uuid];
    }
  };
}

export default {
  getCurrentData,
  updateData,
  loadData,
  setData,
  getListenerHOC
};
