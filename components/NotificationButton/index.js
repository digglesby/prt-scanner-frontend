/*
  global navigator: true window: true Notification: true
*/
import React from 'react';
import atob from 'atob';
import CONFIG from '../../lib/config.js';
import STATIC_PATH from '../../STATIC_PATH.js';

class NotificationButton extends React.Component {

  constructor(){
    super();

    this.state = {
      subscription: null,
      swRegistration: null,
      hasNotification: true,
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

      //Send subscription to server

    }catch(err){

    }
  }

  async unsubscribeUser() {
    try {
      let subscription = await this.state.swRegistration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        //Remove subscription from server

        if (this.mounted){
          this.setState({
            subscription: null
          });
        }
      }

    }catch(error) {
      console.log('Error unsubscribing', error);
    }

  }

  componentWillUnmount(){
    this.mounted = false;
  }


  async componentDidMount(){
    this.mounted = true;

    if (process.browser) {

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          let swReg = await navigator.serviceWorker.register( '/static/sw.js' );
          let subscription = await swReg.pushManager.getSubscription();

          if (this.mounted){
            this.setState({
              swRegistration:swReg,
              hasNotification:true,
              subscription:subscription,
              permissionBlocked: (Notification.permission === 'denied')
            });
          }
        } catch(e) {
          console.error(e);

        }
      } else {
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

      let buttonState = "subscribe";
      let text = "Notify me!";

      if (this.state.permissionBlocked){
        text = "Push messaging blocked";
        buttonState = "blocked";
      }

      if (this.state.subscription != null){
        text = "Unsubscribe";
        buttonState = "unsubscribe";
      }

      return (
        <div className="notification-section">
          <p>Get notified when a station goes down.</p>

          <button
          className={buttonState}
          disabled={(buttonState == "blocked")}
          onClick={this.b_onPress}>
            {text}
          </button>
        </div>
      );

    } else {
      return null;
    }


  }
}

export default NotificationButton;
