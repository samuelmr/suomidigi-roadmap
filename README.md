# Suomidigi Roadmap

## Simple visualization of roadmaps
Simple demonstration of visualizing structured roadmap data. Data structure is specified in
[Data Package](https://frictionlessdata.io/specs/data-package/) format. See
[lib/suomidigi-roadmap-descriptor.json]

The roadmap data can be produced using any tools capable of producing JSON.

## Create a standalone JSON structure from

    node scripts/create-datapackage.js

## Run as a service
Not recommended, since the transformation from Google Sheets to Data Package is run on every page load. (Slow.)

    node index.js

The port for the service can be set in [config.js]
