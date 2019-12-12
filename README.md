# Suomidigi Roadmap

## Simple visualization of roadmaps
Simple demonstration of visualizing structured roadmap data. Data structure is specified in
[Data Package](https://frictionlessdata.io/specs/data-package/) format. See
[lib/suomidigi-roadmap-descriptor.json](lib/suomidigi-roadmap-descriptor.json)

The roadmap data can be produced using any tools capable of producing JSON.

## "Serverless" deployment using 3 static files
This repository contains an example roadmap visualization that runs mostly in user's browser. The main page is
[index.html](index.html) that uses two JSON resources ([data/roadmap.json](data/roadmap.json) and 
[data/roadmap.vg.json](data/roadmap.vg.json)). The JSON resources contain basically the same data in slightly
different structures.

You can see the `ihdex.html` file at [samuelmr.github.io/suomidigi-roadmap/](https://samuelmr.github.io/suomidigi-roadmap/).

The `roadmap.json` file is a "pure" [Data Package](https://frictionlessdata.io/specs/data-package/). The 
`roadmap.vg.json` is the same content formatted for using graphical presentation with Vega library. (See
[frictionlessdata.io/specs/views/](https://frictionlessdata.io/specs/views/) for more information.)

## Create standalone JSON files from Google Sheets
Enable the API as documented in [Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs).
Store the credentials as `credentials.json` (the filename can be configured in [config.js](config.js).
Running the command below will take you through the authorization flow (only when run the first time) and create
a Data Package file into [data/roadmap.json](data/roadmap.json). It will also create a slightly modified version 
[data/roadmap.vg.json](data/roadmap.vg.json) for Vega visualization.

    node scripts/create-datapackage.js

## Run as a service
Not recommended, since the transformation from Google Sheets to Data Package is run on every page load. (Slow.)
Can be used if you want to see the changes you make without running a script.

    node index.js

The port for the service can be set in [config.js](config.js). The service will serve a dynamically created
version of the roadmap JSON. It will also serve static JSON files from the `data` folder. Note that the server
doesn't currently serve dynamically created Vega formatted data package. This would be easy to implement, but
not done yet due to time constraints.
