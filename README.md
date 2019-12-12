# Suomidigi Roadmap

## Simple visualization of roadmaps
Simple demonstration of visualizing structured roadmap data. Data structure is specified in
[Data Package](https://frictionlessdata.io/specs/data-package/) format. See
[lib/suomidigi-roadmap-descriptor.json](lib/suomidigi-roadmap-descriptor.json)

The roadmap data can be produced using any tools capable of producing JSON.

## Create a standalone JSON structure from Google Sheets
Enable the API as documented in [Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs).
Store the credentials as `credentials.json` (the filename can be configured in [config.js](config.js).
Running the command below will take you through the authorization flow (only when run the first time) and create
a Data Package file into [data/roadmap.json](data/roadmap.json). It will also create a slightly modified version 
[data/roadmap.vg.json](data/roadmap.vg.json) for Vega visualization.

    node scripts/create-datapackage.js

## Run as a service
Not recommended, since the transformation from Google Sheets to Data Package is run on every page load. (Slow.)

    node index.js

The port for the service can be set in [config.js](config.js). The service will serve a dynamically created
version of the roadmap JSON.
