const util = require('util')

const fs =require('fs')

let mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/1.txt')
  .then(value => {
    console.log(value.toString());
  })
