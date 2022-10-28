// default station values
stationName = "Egham";
var from = "EGH";
var to = "SNS";

const params = new URLSearchParams(window.location.search)
var title = '';
if (params.has('station')) {
  stationName = params.get('station')
  title += stationName;

  if (params.has('platform')) {
    platform = params.get('platform')
    title += ' - Platform ' + platform;
    document.title = title;
  }

  if (params.has('from') && params.has('to')) {
    from = params.get('from');
    to = params.get('to');
  }
}
init();

var bootupTime = window.setInterval(function () {
  clearInterval(bootupTime);
  fetch(`https://rttfetch.swinghin.com?mode=station2&from=${from}&to=${to}`)
    .then(res => res.json())
    .then(res => {
      if (res.services != null) {
        for (var i = 0; i < res.services.length; i++) {
          if (i < 2) {
            printStringToMap(lineSlotMaps[i * 2], String(i + 1), 0, 0);
            printStringToMap(lineSlotMaps[i * 2], numSuffix(i + 1), 6, 0);
            printStringToMap(lineSlotMaps[i * 2], res.services[i].locationDetail.gbttBookedArrival, 22, 0);
            printStringToMap(lineSlotMaps[i * 2], res.services[i].locationDetail.destination[0].description.substring(0, 18), 50, 0);
            printStringToMap(lineSlotMaps[i * 2], res.services[i].locationDetail.realtimeArrival, 164, 0);
          }
          setBitAll(false);
        }
        getServiceStops(res.services[0].serviceUid, res.services[0].runDate, res.services[0].locationDetail.tiploc)
        animateRow([0, 2]);
        refreshFull();
      }
    });
}, SECOND);

function getServiceStops(serviceUid, runDate, tiploc) {
  fetch(`https://rttfetch.swinghin.com?mode=service&uid=${serviceUid}&year=${runDate.split('-')[0]}&month=${runDate.split('-')[1]}&day=${runDate.split('-')[2]}`)
    .then(res => res.json())
    .then(res => {
      var found = false;
      var stops = new Array();
      var leftStation = true;
      var location1, location2;
      res.locations.forEach(stop => {
        if (leftStation) {
          if (stop.realtimeArrivalActual) {
            // if arrived at station
            location1 = stop.description;
            if (!stop.realtimeDepartureActual) {
              // if not departed current station
              location2 = location1;
              leftStation = false;
            } // if departed current station, continue to next
          }
          else {
            // if not yet arrive station
            if (location1 != null) {
              // if location1 already found
              location2 = stop.description;
              leftStation = false; // end search
            }
          }
        }

        if (found) stops.push(stop);
        else if (stop.tiploc == tiploc) found = true;
      });
      var callstr = "Calling at: "
      for (var i = 0; i < stops.length; i++) {
        if (stops.length == 1) callstr += `${stops[i].description} (${stops[i].gbttBookedArrival.substring(0, 2)}:${stops[i].gbttBookedArrival.substring(2, 4)}) only. `;
        else if (i < stops.length - 1) callstr += `${stops[i].description} (${stops[i].gbttBookedArrival.substring(0, 2)}:${stops[i].gbttBookedArrival.substring(2, 4)}), `;
        else callstr += `and ${stops[i].description} (${stops[i].gbttBookedArrival.substring(0, 2)}:${stops[i].gbttBookedArrival.substring(2, 4)}). `;
      }

      callstr += ` A ${res.atocName} service. `

      if (!leftStation) {
        if (location1 == location2) {
          callstr += `This train is currently at ${location1}. `;
        } else {
          callstr += `This train is currently between ${location1} and ${location2}. `;
        }
      }
      console.log(callstr);
      animateRowH(buildStringMap(callstr), 1);
    });
}