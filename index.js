const {Package} = require('datapackage');
const express = require('express');
const config = require('./config.js');
const sheets2package = require('./lib/sheets2package');



async function createDataPackage(descriptor) {
  const package = await Package.load(descriptor);
  if (!package.valid) {
    console.error('Invalid contents for data package!');
  }
  for (var i=0; i< package.descriptor.resources.length; i++) {
    let resource = package.descriptor.resources[i];
    await package.getResource(resource.name).checkRelations();
  }
  await package.save(config.packageFile);
  console.log("Created " + config.packageFile);
}


const app = express();

app.get('/json', function (req, res) {
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

app.get('/', function (req, res) {
  Package.load(config.packageFile).then((package) => {
    htmlFormat(package, res);
  });
});

let server = app.listen(config.defaultPort, function () {
  let host = server.address().address;
  let port = server.address().port;
  if (!host || (host === '::')) {
    host = 'localhost';
  }
  console.log('Roadmap API listening at http://%s:%s', host, port);
});

async function htmlFormat(package, res) {
  var html = `<!doctype html>
 <meta charset="utf-8">
 <title>Roadmap</title>
      
`;
  if (!package.valid) {
    let errorMessage = 'Invalid data package!';
    console.log(errorMessage);
    html += '<h1>Error</h1><p>' + errorMessage + '</p>';
    res.status(500).send(html);
    return false;
  }

/*
  let orgs = package.getResource('organization');
  let orgjson = await orgs.read({keyed: true, relations: true});
  orgjson.forEach((org) => {
    html += '<h2>' + org.name + '</h2>';
  });
*/
  let services = package.getResource('service');
  let srvjson = await services.read({keyed: true, relations: true});
  srvjson.forEach((srv) => {
    html += '<h2>' + srv.name + '</h2>';
  });

  for (var i=0; i< package.descriptor.resources.length; i++) {
    let resource = package.descriptor.resources[i];
    // html += '<pre>' + JSON.stringify(resource.name, null, 1) + '</pre>';
    // html += '<pre>' + JSON.stringify(resource.data, null, 1) + '</pre>';
  }
  res.send(html);
}
