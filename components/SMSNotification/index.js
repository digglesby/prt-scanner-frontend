import React from 'react';
import fetch from 'isomorphic-unfetch';
import { FaBell } from "react-icons/fa";
import TrackingService from '../../lib/TrackingService';

class NotificationButton extends React.Component {

  constructor(){
    super();

    this.state = {
      error: false,
      success: true,
      text: ""
    };

    this.b_handlechange = this.handleChange.bind(this);
    this.b_onPress = this.onPress.bind(this);
    this.b_sendNumber = this.sendNumber.bind(this);
    this.b_setStateSafe = this.setStateSafe.bind(this);

    this.mounted = false;
    this.loading = false;
  }

  setStateSafe(newState){
    if (this.mounted){
      this.setState(newState);
    }
  }

  async sendNumber(){

    try{
      let result = await fetch('https://api.prtscanner.com/sms',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phonenumber: this.state.text })
      });

      if (result.status != 200) throw new Error("Failed to add!");

      this.loading = false;

      this.b_setStateSafe({
        loading:false,
        error:false,
        success:true
      });

      TrackingService.event('sms_flow','number_added');
    }catch(e){

      this.b_setStateSafe({
        loading:false,
        error:true,
        success:false
      });

      TrackingService.event('sms_flow','number_invalid');

      this.loading = false;
    }
  }


  componentWillUnmount(){
    this.mounted = false;
  }


  async componentDidMount(){
    this.mounted = true;
  }

  onPress(){
    if ((!this.state.loading) && (!this.loading) && (this.state.text.length > 1)){

      this.b_setStateSafe({
        loading:true
      });
      this.loading = true;

      this.b_sendNumber();
    }
  }

  handleChange(event) {
    this.b_setStateSafe({
      text: event.target.value,
      error: false
    });
  }

  render(){
    let smsNotification = null;
    let error_text = null;

    if (this.state.error){
      error_text = (<p className="error_text">There was an error subscribing to SMS. Double check your number and try again.</p>);
    }

    if (!this.state.success){
      let disabled = false;
      let loading_overlay = null;

      if (this.state.loading){
        loading_overlay = (<div className="loading-overlay">Loading...</div>);
      }

      smsNotification = (
        <div className={`sms-notification ${(this.state.error) ? "error": "default"}`}>

          <input
            placeholder="Phone Number"
            value={this.state.text}
            onChange={this.b_handlechange}
          />

          <button onClick={this.b_onPress} disabled={disabled}>
            <span><FaBell />Get Notifications!</span>
          </button>

          {loading_overlay}
        </div>
      );

    } else {

      smsNotification = (
        <div className="sms-notification success">
          <h3>Subscribed to SMS Notifications!</h3>
        </div>
      );
    }

    return (
      <div className="notification-section">
        <p>Get notified via SMS when a station goes down!</p>
        <div className="sms-wrapper">
          {smsNotification}
        </div>
        {error_text}
      </div>
    );

  }
}

export default NotificationButton;
