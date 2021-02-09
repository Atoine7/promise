const fs = require('fs');
const util = require('util')
const mineReadFile = util.promisify(fs.readFile)
//回调函数方式
// fs.readFile('./resource/1.html', (err, data1) => {
//   if (err) throw err;
//   fs.readFile('./resource/2.html', (err, data2) => {
//     if(err) throw err;
//     console.log(data1 + data2);
//   })
// })

// async 与 await
async function main() {
  try {
  let data1 = await mineReadFile('./resource/1.html');
  let data2 = await mineReadFile('./resource/2.html');
  console.log(data1 + data2);
  } catch (e) {
    console.log(e);
  }
}

main()
