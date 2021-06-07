#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const Jimp = require('jimp')
const readline = require('readline')
const { faker } = require('./faker')
const config = require('./config')

let flag = false

function changeFlag(fl) {
  flag = fl
}

const start = () =>
  new Promise(async (resolve) => {
    const logo = await Jimp.read(`${config.WATERSING}`)
    const main = async (file) => {
      const image = await Jimp.read(`image/${file}`)
      image.resize(config.SIZEHEIGTH, config.SIZEWIDHT)
      logo.resize(image.bitmap.width / 2, Jimp.AUTO)

      const xMargin = (image.bitmap.width * 5) / 100
      const yMargin = (image.bitmap.width * 5) / 100

      const X = image.bitmap.width - logo.bitmap.width - xMargin
      const Y = image.bitmap.height - logo.bitmap.height - yMargin

      return image.composite(logo, X, Y, [Jimp.BLEND_DESTINATION_OVER])
    }

    fs.readdir('image', async (err, files) => {
      if (files) {
        for (let file of files) {
          if (flag) {
            await main(file)
              .then((tpl) => tpl.write(`res/${file}`))
              .then(() => fs.unlinkSync(`image/${file}`))
          } else {
            break
          }
        }
      }

      resolve(true)
    })
  })

function resizeProcess() {
  changeFlag(true)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  start().then((res) => rl.close())
  rl.question('Хотите остановить процесс ресайза "y"/"n"? ', (answer) => {
    if (answer === 'y') {
      changeFlag(false)
      rl.close()
    }
  })
}

program.version('0.0.1').description('cli process')

program
  .command('resizeProcess')
  .alias('r')
  .action(() => {
    resizeProcess()
  })
program
  .command('faker')
  .alias('f')
  .action(async () => {
    faker()
  })

program.parse(process.argv)
