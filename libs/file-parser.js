/**
* from : https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
*/
'use strict';
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const es = require('event-stream');

let lineCount = 0;

/**
 * File Parser
 * 
 * Read a file and call our callback for each line
 * 
 * @param {String} url
 * @param {Function} cb
 * @must URL must exist
 * @must cb must return a Promise
 */
module.exports = (url, cb) => {
  if(!fs.existsSync(url)) {
    throw new Error('Error, unable to resolve : ' + url);
  }

  if(!cb) {
    cb = line => line;
  }

  const currentStream = fs.createReadStream(url)
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
      // pause the readstream
      currentStream.pause();

      lineCount += 1;

      // process line here and call s.resume() when rdy
      // function below was for logging memory usage
      // logMemoryUsage(lineCount);

      cb({
        line,
        lineNumber: lineCount
      }).then(() => currentStream.resume());
    })
    .on('error', (err) => {
        console.log('Error while reading file.', err);
    })
    .on('end', () => {
        console.log('Read entire file.')
    }));
};
