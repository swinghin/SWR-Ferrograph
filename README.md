# Online Departure Board - SWR Ferrograph 

This project is an HTML canvas object that aims to recreate Ferrograph Next Train Indicator screens installed at South Western Railway platforms.

## Demo

View the screen on the demo page at [swinghin.com](https://swinghin.com/stopetasim/fg/sw/?station=Egham&platform=1&from=EGH&to=SNS "Ferrograph-NextTrain-SWR Demo Page").

## Usage

By default, the screen will show departures from platform 1 of Egham Station.

To show departures from another station, you **MUST** use **ALL** of the following query variables in the URL:

```
?station={stationName}&platform={platformNumber}&from={originStationCode}&to={destinationStationCode}
```

* `stationName` is the name of the station you want to show in the default welcome screen. Also shown in the page title.
* `platformNumber` is the platform number you want to show in the page title.
* `originStationCode` is the 3-letter station code of the origin station. (Example: `EGH` for Egham)
* `destinationStationCode` is the 3-letter station code of the destination station. (Example: `SNS` for Staines)

Example query lists:

Station at `Egham`, on platform `1`, showing trains from Egham `EGH` to Staines `SNS`.
```
?station=Egham&platform=1&from=EGH&to=SNS
```
Station at `Weybridge`, on platform `2`, showing trains from Weybridge `WYB` to Wimbledon `WIM`.
```
?station=Weybridge&platform=2&from=WYB&to=WIM
```

Using the query lists like the example shown above, the screen wil display trains that calls at both the origin nd destination stations listed.

## Known Issues

This project is currently still in development. There are a couple of issues/unfinished features listed below:
- **Information on screen can only be updated by refreshing the web page.**
- The marquee text on the second row does not show the formation of the train (number of carriages).
- The third row does not scroll between 2nd and 3rd departures.

## Data Source

This project uses data feeds from the [Realtime Trains API](https://www.realtimetrains.co.uk/about/developer/ "Realtime Trains Website").

## License
[AGPL 3.0](https://choosealicense.com/licenses/agpl-3.0/ "AGPL 3.0 License")
