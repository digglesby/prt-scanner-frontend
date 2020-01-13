import React from 'react';
import dataInjestor from './data_injestor.js';
import fetch from 'isomorphic-unfetch';
import uuidv4 from 'uuid/v4';

let currentData = [];
let listeners = {

};

async function loadData(){
  let res = await fetch("https://api.prtscanner.com/stats");
  let prt_data = await res.json();

  let new_prt_data = dataInjestor(prt_data);

  return new_prt_data;
}

function updateListeners(){
  for (var key in listeners) {
    listeners[key].changed();
  }
}

async function updateData(){
  currentData = loadData();
  updateListeners();
}

function setData(data){
  currentData = [...data];
  updateListeners();
}

function getCurrentData(){
  return [...currentData];
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
