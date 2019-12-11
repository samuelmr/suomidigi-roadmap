const path = require('path');
const {Package} = require('datapackage');
const express = require('express');
const config = require('./config.js');
const sheets2package = require('./lib/sheets2package');

const app = express();

// serve cahced roadmap.json and roadmap.vg.json from a folder
const dataDir = path.join(__dirname, 'data');
app.use('/data', express.static(dataDir));
console.log('Serving static files from %s', dataDir);

// the root URL for the service returns dynamically created
// latest version of the roadmap
app.get('*', function (req, res) {
  console.log(req);
});

app.get('/', function (req, res) {
  // console.log('Created index ' + config.dashboardIndex);
  sheets2package(async (descriptor) => {
    const package = await Package.load(descriptor);
    if (!package.valid) {
      console.error('Invalid contents for data package!');
    }
    for (var i=0; i< package.descriptor.resources.length; i++) {
      let resource = package.descriptor.resources[i];
      await package.getResource(resource.name).checkRelations();
    }
    res.json(package.descriptor);
  });
});

let server = app.listen(config.servicePort, function () {
  let host = server.address().address;
  let port = server.address().port;
  if (!host || (host === '::')) {
    host = 'localhost';
  }
  console.log('Roadmap API listening at http://%s:%s', host, port);
});
