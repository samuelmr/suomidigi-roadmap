/*
 * Create a datapackage.json file from a Google Sheet
 */

const {Package} = require('datapackage');
const sheets2package = require('../lib/sheets2package');
const config = require('../config.js');

sheets2package(createDataPackage);

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
