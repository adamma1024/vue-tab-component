require('./check-versions')()

//终端微调器
var ora = require('ora')
//记录日志
var rm = require('rimraf')
var path = require('path')
//粉笔
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(path.resolve(__dirname, '../dist'), 'static'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
  })
})
