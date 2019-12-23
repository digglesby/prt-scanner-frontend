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
      data_arr[point_key] = {
        ...data_arr[point_key],
        StationStatus: {
          Walnut:      (data_arr[point_key].IsDown.indexOf("Walnut") == -1),
          Beechurst:   (data_arr[point_key].IsDown.indexOf("Beechurst") == -1),
          Engineering: (data_arr[point_key].IsDown.indexOf("Engineering") == -1),
          Towers:      (data_arr[point_key].IsDown.indexOf("Towers") == -1),
          HSC:         (data_arr[point_key].IsDown.indexOf("HSC") == -1)
        },
        IsClosed: (data_arr[point_key].IsDown == "closed"),
        Date: `${data_arr[point_key].Date} GMT-0000`,
        DateObj: new Date(data_arr[point_key].Date+" GMT-0000"),
        DateStamp: new Date(data_arr[point_key].Date+" GMT-0000").getTime()
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
