const csvParser = require('./libs/csv-parser');
const path = require('path');


csvParser(path.join(__dirname, './test.csv'), {
  startsAt: 2,
  splitChar: ';',
  columns: [
    'firstname',
    'lastname',
    'email',
    'age',
    'country'
  ]
}, (lineObjt) => {
  console.log('new line : ' + JSON.stringify(lineObjt));
})
