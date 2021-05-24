const faker = require('faker')
const axios = require('axios')
const path = require('path')
const fs = require('fs')

exports.mdr = new Promise((resolve) => {
  const folderPath = path.join(__dirname, 'image')
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
  resolve(true)
})
exports.faker = () => {
  const url = []
  for (let i = 0; i < 1000; i++) {
    url.push(faker.image.avatar())
  }

  for (let i = 0; i < url.length; i++) {
    const imagePath = path.join(__dirname, 'image', `${i}.jpg`)
    axios({
      method: 'get',
      url: url[i],
      responseType: 'stream',
    }).then((response) => {
      response.data.pipe(fs.createWriteStream(imagePath))
    })
  }
}
