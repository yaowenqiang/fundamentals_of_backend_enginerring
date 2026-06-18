const fs = require('fs');
console.log('1');
const res = fs.readFileSync('test.txt');
console.log(res.toString())
console.log('2')
