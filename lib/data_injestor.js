import moment from 'moment-timezone';

function sortDate(arr){
  arr.sort(function(a,b){
    return (new Date(b.Date).getTime()) - (new Date(a.Date).getTime());
  });
}

function sortDay(arr){
  arr.sort(function(a,b){
    return (new Date(b.Day).getTime()) - (new Date(a.Day).getTime());
  });
}

export default function(input_data){
  let output_data = [];

  for (var i = 0; i < (input_data.length / 2); i++) {
    let day = input_data[i*2];
    let data_arr = input_data[(i*2)+1];

    sortDate(data_arr);

    for (var point_key in data_arr) {

      let station_strings = ["Walnut","Beechurst","Engineering","Towers","HSC"];
      let down_count = 0;
      let station_status = {};

      for (var p = 0; p < station_strings.length; p++) {
        if ( data_arr[point_key].IsDown.indexOf(station_strings[p]) != -1 ){
          station_status[station_strings[p]] = false;
          down_count++;
        } else {
          station_status[station_strings[p]] = true;
        }
      }

      data_arr[point_key] = {
        ...data_arr[point_key],
        StationStatus: station_status,
        DownCount:down_count,
        IsClosed: (data_arr[point_key].IsDown == "closed"),
        Date: moment.tz(`${data_arr[point_key].Date}`, "YYYY-MM-DD HH:mm:ss", "Europe/London").format('x'),
        DateObj: new Date(moment.tz(`${data_arr[point_key].Date}`, "YYYY-MM-DD HH:mm:ss", "Europe/London").format('x')),
        DateStamp: moment.tz(`${data_arr[point_key].Date}`, "YYYY-MM-DD HH:mm:ss", "Europe/London").format('x')
      };
    }

    output_data.push({
      DataPoints: data_arr,
      Day: day
    });

  }

  sortDay(output_data);

  return output_data;
}
