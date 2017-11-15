'use strict';
const fileParser = require('./file-parser');
const Promise = require('bluebird');

/**
* columnsToObj function
*
* Turns columns Array into an Object
*
* @param {Array} columnList
* @return {Object}
*/
function columnsToObj(columnList) {
  let tmpObj = {};

  for(let c in columnList) {
    tmpObj[columnList[c]] = null;
  }

  return tmpObj;
}

/**
* parseLine function
*
* Get an object for each line
*
* @param {String} lineString
* @param {{ splitChar: String, columns: Array }} opts
* @return {Object}
*/
function parseLine(lineString, opts) {
  const lineArray = lineString.split(opts.splitChar);
  let tmpObject = columnsToObj(opts.columns);

  // For each value in lineArray
  for(let i = 0; i < lineArray.length; i++) {
    // The column must be defined to prevent errors
    if(!!opts.columns[i]) {
      tmpObject[opts.columns[i]] = lineArray[i];
    }
  }

  return tmpObject;
}

/**
* CSV Parser
*
* @param {String} url
* @param {{ startsAt: Number, splitChar: String }}
* @param {Function} cb
*/
module.exports = (url, options, cb) => {
  options = Object.assign({
    startsAt: 1, // First line
    splitChar: ',',
    quoteChat: '',
    columns: []
  }, options);

  fileParser(url, (lineObj) => {
    return new Promise((resolve, reject) => {

      // See if we passed the ignored lines and line not empty
      if (lineObj.lineNumber >= (options.startsAt) && lineObj.line.trim() !== "") {
        cb(parseLine(lineObj.line, options));
      }

      resolve();
    });
  });
};
