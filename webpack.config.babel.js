import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import NpmInstallPlugin from 'npm-install-webpack-plugin'


import _debug from 'debug'
import config, {paths, globals} from './config'

var vueLoaderConfig = require('./config/vue-loader.conf')
var utils = require('./config/utils')
var merge = require('webpack-merge')

const {__DEV__, __TEST__, __PROD__} = globals

const debug = _debug('app:webpack')


debug('Create configuration.')
const appEntry = __DEV__ ? [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    paths.src('index.js')
] : [paths.src('index.js')]

const webpackBaseConfig = {
    target: 'web',
    resolve: {
        modules: [paths.src(), 'node_modules'],
        extensions: ['.js', '.vue',  '.css','.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': paths.src(),
            'assets': paths.src("assets"),
            'components': paths.src("components"),
            'views': paths.src('views')
        }
    },

    entry: {
        app: appEntry,
        vendor: config.compiler_vendor
    },
    output: {
        path: paths.dist(),
        publicPath: config.compiler_public_path,
        filename: `[name].[${config.compiler_hash_type}].js`,
        chunkFilename: `[id].[${config.compiler_hash_type}].js`
    },
    devtool: config.compiler_devtool,
    devServer: {
        host: config.server_host,
        port: config.server_port,
        compress: true,
        hot: true,
        noInfo: config.compiler_quiet,
        stats: config.compiler_stats,
        historyApiFallback: true
    },
    node: {
        fs: 'empty',
        net: 'empty'
    },
    module: {

        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [paths.src('src'), paths.src('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },


            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [paths.src('src'), paths.src('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(config.globals),
        new webpack.NamedModulesPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: paths.src('index.ejs'),
            title: `${config.pkg.name} - ${config.pkg.description}`,
            hash: false,
            inject: true,
            minify: {
                collapseWhitespace: config.compiler_html_minify,
                minifyJS: config.compiler_html_minify
            }
        }),
        new CopyWebpackPlugin([{
            from: paths.src('static')
        }], {
            ignore: ['README.md']
        })
    ]
}

const webpackConfig=merge(webpackBaseConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: true})
    }
})

if (__PROD__) {
    debug('Enable plugins for production (Dedupe & UglifyJS).')
    webpackConfig.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                context: __dirname
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false
            },
            sourceMap: true
        })
    )
} else {
    debug('Enable plugins for live development (HMR, NoErrors).')
    //webpackConfig.module.rules.push(utils.styleLoaders({ sourceMap: true }))


    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.LoaderOptionsPlugin({
            debug: true,
            options: {
                context: __dirname
            }
        })
    )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
    webpackConfig.plugins.push(
        new FaviconsWebpackPlugin({
            logo: paths.src('static/favicon.png'),
            prefix: 'icons-[hash:7]/',
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                opengraph: false,
                twitter: true,
                yandex: false,
                windows: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: __DEV__ ? 'vendor.js' : 'vendor.[hash].js'
        })
    )
}

if (!__DEV__) {
    debug('Applying ExtractTextPlugin to CSS loaders.')
    webpackConfig.module.rules.filter((rule) =>
        rule.loaders && rule.loaders.find((name) => /css/.test(name.split('?')[0]))
    ).forEach((rule) => {
        const first = rule.loaders[0]
        const rest = rule.loaders.slice(1)
        rule.loader = ExtractTextPlugin.extract({
            fallbackLoader: first,
            loader: rest.join('!')
        })
        delete rule.loaders
    })

    webpackConfig.plugins.push(
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            allChunks: true
        })
    )
}

export default webpackConfig
