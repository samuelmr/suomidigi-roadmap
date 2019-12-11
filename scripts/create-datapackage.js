const fs = require('fs');
const {Package} = require('datapackage');
const sheets2package = require('../lib/sheets2package');
const config = require('../config.js');

/*
 * Create a datapackage.json file from a Google Sheet
 */

sheets2package(async (descriptor) => {
  const package = await Package.load(descriptor);
  if (!package.valid) {
    console.error('Invalid contents for data package!');
    console.log(package.errors);
  }
  for (var i=0; i< package.descriptor.resources.length; i++) {
    let resource = package.descriptor.resources[i];
    await package.getResource(resource.name).checkRelations();
  }
  await package.save(config.packageFile);
  console.log("Created " + config.packageFile);

  const vegaSpec = await descriptorToVega(package);
  const vegaString = JSON.stringify(vegaSpec, null, 1); // pretty printed
  // const vegaString = JSON.stringify(vegaSpec); // minified
  fs.writeFile(config.vegaSpecFile, vegaString, (err) => {
    if (err) {
      throw(new Error(err));
    }
    console.log("Created " + config.vegaSpecFile);
  });
});

async function descriptorToVega(package) {
  return new Promise((resolve, reject) => {
    // only first view
    let vegaSpec = Object.assign({}, package.descriptor.views[0].spec);
    let promises = [];
    for (var i=0; i<vegaSpec.data.length; i++) {
      const resource = vegaSpec.data[i];
      promises.push(package.getResource(resource.name).read({keyed: true}).then((data) => {
        resource.values = data;
        return data;
      }).catch((e) => {
        console.error(e);
      }));
    }
    Promise.all(promises).then((data) => {
      resolve(vegaSpec);
    }).catch((e) => {
      reject(e);
    });
  });
}
