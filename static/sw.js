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

  /*
    Accepted Parameters:
    Plain Text
    --Treated as announcement

    Json:
      StationStatus
      --Used to create STATION is down/ STATIONS are up messages
      --ex: {"StationStatus":{"Walnut":true,"Beechurst":false,"Engineering":false,"Towers":false,"HSC":false}}

      Message
      --Replaces notification body, overrides automated StationStatus message

      Title
      --Overrides title

      Ad (bool)
      --Determines if message should be treated as promoted content

      Link
      --Replaces link to prtscanner.com when notification is clicked
  */

  const STATIONS = {
    "Walnut":"Walnut",
    "Beechurst":"Beechurst",
    "Engineering":"Engineering",
    "Towers":"Towers",
    "HSC":"Health Sciences"
  };

  let title = "Annoucement";
  let message = "Unknown";
  let state = "annoucement";
  let link = "https://prtscanner.com";

  try {
    let push_data = JSON.parse(event.data.text());

    if (!push_data.Message){
      let down_stations = [];

      for (let key in STATIONS) {
        if (push_data.StationStatus[key] == false){
          down_stations.push(STATIONS[key]);
        }
      }

      if (down_stations.length == 5){

        state = "down";
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
        state = "down";

      } else {
        title = "The PRT is running!";
        message = "The PRT is up at all stations";
        state = "up";
      }

    } else {

      if (push_data.Ad) {
        title = (push_data.hasOwnProperty("Title")) ? push_data.Title : "Promoted";
        message = push_data.Message;
        state = "promoted";
      } else {
        title = (push_data.hasOwnProperty("Title")) ? push_data.Title : "Annoucement";
        message = push_data.Message;
        state = "annoucement";
      }

    }

    if (push_data.hasOwnProperty("Link")){
      link = push_data.Link;
    }

  } catch(e) {
    //Plain text, send as annoucement
    title = "Annoucement";
    message = event.data.text();
    state = "annoucement";
  }

  console.log(link);

  let options = {
    body: message,
    icon: '/static/notif_message.png',
    badge: '/static/notif_badge.png',
    data: {
      link
    }
  };

  switch (state){
    case 'annoucement':
      options.icon = '/static/notif_message.png';
      break;
    case 'promoted':
      options.icon = '/static/notif_message.png';
      break;
    case 'down':
      options.icon = '/static/notif_down.png';
      break;
    case 'up':
      options.icon = '/static/notif_up.png';
      break;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  console.log(event.notification);

  let link = event.notification.data.link;

  event.waitUntil(
    clients.openWindow(link)
  );
});
