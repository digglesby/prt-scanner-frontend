/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';

self.addEventListener('push', function(event) {

  let title = "Annoucement";
  let message = "";
  let state = "annoucement";

  /*
    {"StationStatus":{"Walnut":true,"Beechurst":false,"Engineering":false,"Towers":false,"HSC":false}}
  */


  let push_data = {};

  try {
    push_data = JSON.parse(event.data.text());
  } catch(e) {
    push_data = {
      message: event.data.text(),
      down: false,
      ad: false
    };
  }

  if (!push_data.message){
    let down_stations = [];

    if ( push_data.StationStatus.Walnut == false ){
      down_stations.push("Walnut");
    }

    if ( push_data.StationStatus.Beechurst == false ){
      down_stations.push("Beechurst");
    }

    if ( push_data.StationStatus.Engineering == false ){
      down_stations.push("Engineering");
    }

    if ( push_data.StationStatus.Towers == false ){
      down_stations.push("Towers");
    }

    if ( push_data.StationStatus.HSC == false ){
      down_stations.push("Health Sciences");
    }

    if (down_stations.length == 5){

      message = "The PRT is down at all stations";
      title = "The PRT is down!";

    } else if (down_stations.length > 0) {
      message = "The PRT is down at";

      for (var i = 0; i < down_stations.length; i++) {

        if (i != 0){
          if (i == (down_stations.length - 1)){
            message = message + ", and";
          } else {
            message = message + ",";
          }
        }

        message = message + ` ${down_stations[i]}`;
      }

      title = "The PRT is down!";

    } else {
      title = "The PRT is running!";
      message = "The PRT is up at all stations";
    }

  } else if (push_data.ad){
    state = "ad";
    title = "Promoted";
  } else {
    state = "annoucement";
    title = "Annoucement";
  }

  const options = {
    body: message,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://prtscanner.com/')
  );
});
