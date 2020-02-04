/* eslint no-console: 0 */
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const mkdirp = require('mkdirp');
const batchPromises = require('batch-promises');
const sttrbuild = require('./parser');

const { argv } = yargs
  .option('output', {
    alias: 'o',
    description: 'Directory to place json output.',
    type: 'string',
  })
  .help()
  .alias('help', 'h');

const OUTPUT_DIR = argv.output;

if (!OUTPUT_DIR) {
  throw Error('"output" not specified. Please provide --output=./some/path');
}

const MAX_PARALLEL = 6;
// const sttrApi = `https://sttr-builder${process.env.STTR_ENV === 'production' ? '' : '-staging'}.eu.meteorapp.com/api`;
const sttrApi = `https://sttr-builder.eu.meteorapp.com/api`;
const listUrl = `${sttrApi}/activiteiten/bijwerkzaamheid`;
const detailUrl = `${sttrApi}/conclusie/sttr`;
const headers = {
  'x-api-key': process.env.STTR_BUILDER_API_KEY,
};

const DISABLED = ['MtNRm9GhSkdPavHJa'];
mkdirp(OUTPUT_DIR);

/**
 * @param {object} obj - an object to convert to json-string
 * @returns {string} a json string
 */
function jsonString(obj) {
  return JSON.stringify(obj, ';', 2);
}

/**
 * Get json from response
 *
 * @param {any} res - the response object from node-fetch
 * @returns {object} a json string
 */
function getJSON(res) {
  return res.json();
}

/**
 * Middleware for checking the status. Throws an error if response failed
 *
 * @param {any} res - the response object from node-fetch
 * @returns {any} the response object
 */
function checkStatus(res) {
  if (!res.ok) {
    // res.status >= 200 && res.status < 300
    console.error(res.statusText);
    res.text().then(text => {
      console.error(text);
      throw Error(res.statusText);
    });
  }
  return res;
}

(async () => {
  const activities = await fetch(listUrl, { headers })
    .then(checkStatus)
    .then(getJSON)
    .then(json => {
      fs.writeFile(path.join(OUTPUT_DIR, 'activities.source.json'), jsonString(json), err => {
        if (err) throw err;
        console.log('activities.source.json has been saved!');
      });
      return json;
    })
    .then(json =>
      json.map(({ URN: id, naam: name, activiteiten: permits }) => ({
        id,
        name: name.trim(),
        file: `${id}.json`,
        permits: permits.map(({ id: permitId, naam: permitName }) => ({
          id: permitId,
          name: permitName.trim(),
        })),
      })),
    );

  const activitiesDetails = await batchPromises(
    MAX_PARALLEL,
    activities.flatMap(a => a.permits),
    ({ id }) =>
      fetch(detailUrl, {
        method: 'post',
        body: `activiteitId=${id}`,
        headers: {
          ...headers,
          'content-type': 'application/x-www-form-urlencoded',
        },
      })
        .then(checkStatus)
        .then(res => res.text())
        .then(xml => ({
          id,
          xml,
        })),
  );

  // write activity source xml files
  activitiesDetails.forEach(({ id, xml }) => {
    fs.writeFile(path.join(OUTPUT_DIR, `${id}.xml`), xml, err => {
      if (err) throw err;
      console.log(`${id}.xml has been saved!`);
    });
  });

  activities.forEach(({ id, file, name, permits }) => {
    const data = {
      id,
      name,
      permits: permits
        .filter(({ id: permitId }) => DISABLED.indexOf(permitId) === -1)
        .map(permit => sttrbuild(activitiesDetails.find(activity => activity.id === permit.id).xml)),
    };
    fs.writeFile(path.join(OUTPUT_DIR, file), jsonString(data), err => {
      if (err) throw err;
      console.log(`'${file}' has been saved!`);
    });
  });

  // writie activities.json
  fs.writeFile(
    path.join(OUTPUT_DIR, 'activities.json'),
    jsonString(
      activities.map(({ id, name, file }) => ({
        id,
        name,
        file,
      })),
    ),
    err => {
      if (err) throw err;
      console.log('activities.json has been saved!');
    },
  );
})();
