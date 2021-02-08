const fs = require('fs')

// fs.readFile('./resource/1.txt', (err, data) => {
//   if(err) {
//     throw err;
//   }
//   console.log(data.toString());
// });

let p = new Promise((resolve, reject) => {
  fs.readFile('./resource/1.txt', (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
})

p.then((value) => {
  console.log(value.toString());
}, (reason) => {
  console.log(reason);
})
