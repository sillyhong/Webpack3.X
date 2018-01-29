const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require("extract-text-webpack-plugin");
const purifyCSSPlugin = require('purifycss-webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')

const entry = require('./webpack_config/entry_webpack')

if(process.env.type === 'dev'){
    console.log(encodeURIComponent(process.env.type))
    var webSite = {
        publicPath: 'http://localhost:8080/'
    }
}else{
    console.log("生产版本")
    var webSite = {
        publicPath: 'http://weihong:8080/'
    }
}

module.exports = {
    devtool:'source-map',
    entry: {
        entry: './src/entry.js',
        jquery: 'jquery',
        react: 'react'
    },//入口文件
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: webSite.publicPath//静态资源路径
    },//出口文件
    module:{
        rules: [

            // {
            //     test: /\.css$/,
            //     use: [
            //         {
            //             loader: "style-loader"
            //         }, {
            //             loader: "css-loader",
            //             options: {
            //                 modules: true
            //             }
            //         }, {
            //             loader: "postcss-loader"
            //         }
            //     ]
            // },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{loader: "css-loader", options:{importLoaders: 1}},
                            'postcss-loader'
                        ]
                })
            },
            {
                test:/\.(jpg|png|gif)/,
                use:[{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath:'images/'
                    }
                }]
            },{
                test:/\.(htm|html)$/i,
                use:['html-withimg-loader'],
            },{
                test:/\.less$/,
                use:extractTextPlugin.extract({
                    use: ['css-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            },{
                test:/\.scss/,
                use:extractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },{
                test: /\.(jsx|js)$/,
                use:{
                    loader: 'babel-loader',
                },
                exclude: '/node_modules'
            }
        ]
    },//模块加载
    plugins:[
        // new UglifyJSPlugin()
        new webpack.optimize.CommonsChunkPlugin({
            name: ['jquery', 'react'],
            filename: 'assets/js/[name].js',
            minChunks: 2

        }),
        new webpack.BannerPlugin('版权归weihong所有'),
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true,
            },
            hash:true,
            template:'./src/index.html'
        }),
        new extractTextPlugin('css/index.css'),
        new purifyCSSPlugin({
            paths: glob.sync(path.join(__dirname,'src/*.html'))
        }),
        new copyWebpackPlugin([{
            from:__dirname+'/src/public',
            to:'./public'
        }]),
        new webpack.HotModuleReplacementPlugin()//热加载局部更新

    ],//插件
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:8080
    },

    watchOptions: {
        poll: 1000,//检查修改的时间
        aggregateTimeout: 500,////防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        ignored: /node_modules/,
    }
}