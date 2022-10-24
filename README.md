# Ferrograph-NextTrain-SWR

This project aims to recreate a Ferrograph Next Train Indicator screen in SWR station style that runs in a web page.

## Demo Page

View the screen on [swinghin.com](https://swinghin.com/stopetasim/fg/sw/ "Ferrograph-NextTrain-SWR Demo Page").

## Usage

By default, the screen will show departures from platform 1 of Egham Station.

To show departures from another station, you can use query variables in the URL:

```
?station={stationName}&platform={platformNumber}&from={originStationCode}&to={destinationStationCode}
```

* `stationName` is the name of the station you want to show in the default welcome screen. Also shown in the page title.
* `platformNumber` is the platform number you want to show in the page title.
* `originStationCode` is the 3-letter station code of the origin station. (Example: `EGH` for Egham)
* `destinationStationCode` is the 3-letter station code of the destination station. (Example: `SNS` for Staines)

An example query list looks like this:

```
?station=Egham&platform=1&from=EGH&to=SNS
```

## License
[AGPL 3.0](https://choosealicense.com/licenses/agpl-3.0/ "AGPL 3.0 License")
