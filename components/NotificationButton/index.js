/*
  global navigator: true window: true Notification: true
*/
import React from 'react';
import atob from 'atob';
import CONFIG from '../../lib/config.js';
import fetch from 'isomorphic-unfetch';
import { FaBell, FaBellSlash } from "react-icons/fa";
import SMSNotification from '../SMSNotification';
import TrackingService from '../../lib/TrackingService';

class NotificationButton extends React.Component {

  constructor(){
    super();

    this.state = {
      subscription: null,
      swRegistration: null,
      hasNotification: false,
      permissionBlocked: null
    };

    this.b_subscribeUser = this.subscribeUser.bind(this);
    this.b_unsubscribeUser = this.unsubscribeUser.bind(this);
    this.b_onPress = this.onPress.bind(this);

    this.mounted = false;
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async subscribeUser() {
    const applicationServerKey = this.urlB64ToUint8Array(CONFIG.applicationServerPublicKey);

    try {
      let subscription = await this.state.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      if (this.mounted){
        this.setState({
          subscription: subscription
        });
      }

      fetch('https://api.prtscanner.com/subscriptions',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      });

      TrackingService.event('notification_flow','user_subscribed');

    }catch(err){

    }
  }

  async unsubscribeUser() {
    try {
      let subscription = await this.state.swRegistration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        //Remove subscription from server

        TrackingService.event('notification_flow','user_unsubscribed');

        if (this.mounted){
          this.setState({
            subscription: null
          });
        }
      }

    }catch(error) {
      console.error('Error unsubscribing', error);
    }

  }

  componentWillUnmount(){
    this.mounted = false;
  }


  async componentDidMount(){
    this.mounted = true;

    if (process.browser) {

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        TrackingService.event('notification_flow','web_push_enabled');

        try {
          let swReg = await navigator.serviceWorker.register( '/static/sw.js' );
          let subscription = await swReg.pushManager.getSubscription();

          if ( Notification.permission === 'denied' ){
            TrackingService.event('notification_flow','web_push_permission_denied');
          }

          if (this.mounted){
            this.setState({
              swRegistration:swReg,
              hasNotification:true, //DEBUG
              subscription:subscription,
              permissionBlocked: (Notification.permission === 'denied')
            });
          }
        } catch(e) {
          console.error(e);
        }
      } else {
        TrackingService.event('notification_flow','web_push_unsupported');

        if (this.mounted){
          this.setState({
            swRegistration:null,
            hasNotification:false,
            subscription:null,
            permissionBlocked: false
          });
        }
      }

    }
  }

  onPress(){
    if (this.state.subscription){
      this.b_unsubscribeUser();
    } else {
      this.b_subscribeUser();
    }
  }

  render(){

    if (this.state.hasNotification){

      let text = (<span><FaBell />Get Notifications</span>);
      let buttonState = "subscribe";

      if (this.state.permissionBlocked){
        text = (<span><FaBellSlash />Permission Blocked</span>);
        buttonState = "blocked";
      }

      if (this.state.subscription != null){
        text = (<span><FaBellSlash />Stop Notifications</span>);
        buttonState = "unsubscribe";
      }

      return (
        <div className="notification-section">
          <p>Get notified when a station goes down!</p>

          <button
            className={buttonState}
            disabled={(buttonState == "blocked")}
            onClick={this.b_onPress}
          >
            {text}
          </button>
        </div>
      );

    } else {
      return (<SMSNotification />);
    }


  }
}

export default NotificationButton;
