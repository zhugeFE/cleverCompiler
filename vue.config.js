const path = require('path')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const devEnv = require('./config/dev.env')
const pordEnv = require('./config/prod.env')
const mode = process.env.NODE_ENV === 'production'
const publicPath = mode
  ? pordEnv.build.ASSETS_PUBLIC_PATH
  : devEnv.build.ASSETS_PUBLIC_PATH
const outputDir = mode ? pordEnv.build.OUTPUT_DIR : devEnv.build.OUTPUT_DIR
const assetsDir = mode ? pordEnv.build.ASSETS_DIR : devEnv.build.ASSETS_DIR
const indexPath = mode ? pordEnv.build.INDEX_PATH : devEnv.build.INDEX_PATH

module.exports = {
  publicPath: publicPath,
  outputDir: outputDir,
  assetsDir: assetsDir,
  indexPath: indexPath,
  pages: {
    main: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  runtimeCompiler: true,
  pluginOptions: {
    dll: {
      entry: [
        'vue/dist/vue.esm.js',
        'lodash',
        'vuex',
        'axios',
        'vue-router',
        'element-ui'
      ],
      open: true,
      output: {
        path: path.join(__dirname, 'dll'), // 打包后文件输出的位置
        filename: '[name].[hash].dll.js',
        library: '[name]_library'
      },
      inject: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.(txt)(\?.*)?$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
    config.module
      .rule('js')
      .test(/\.js$/)
      .use('babel-loader')
      .loader('babel-loader')
      .tap(() => {
        return {
          include: [path.join(__dirname, 'src')]
        }
      })
      .end()

    let addAssetHtmlPluginConf = {
      filepath: path.join(__dirname, 'dll/*.dll.js')
    }
    if (mode) {
      addAssetHtmlPluginConf.outputPath = assetsDir + '/js/'
      addAssetHtmlPluginConf.publicPath = publicPath + assetsDir + '/js/'
    }
    config.plugin('addDll').use(AddAssetHtmlPlugin, [addAssetHtmlPluginConf])

    config.plugin('define').tap(args => {
      args.forEach(arg => {
        if (arg['process.env']) {
          let envObj = mode ? pordEnv.env : devEnv.env
          let name = ''
          for (name in envObj) {
            arg['process.env'][name] = envObj[name]
          }
        }
      })
      return args
    })
    config.plugin('copy').tap(args => {
      args[0].push({
        from: path.resolve(__dirname, 'static'),
        to: assetsDir,
        ignore: ['.*']
      })
      return args
    })
  },
  css: {
    loaderOptions: {
      css: {
        sourceMap: false
      },
      sass: {
        sourceMap: false
      },
      postcss: {
        sourceMap: false
      }
    }
  }
}