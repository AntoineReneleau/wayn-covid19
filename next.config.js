const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const withCSS = require('@zeit/next-css')
require('dotenv').config()

const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
    
    webpack: config => {

        // config.resolve.alias = {
        //     'components': path.resolve('components'),
        //   };
        config.plugins.push(
            new SWPrecacheWebpackPlugin({
                minify: true,
                staticFileGlobsIgnorePatterns: [/\.next\//],
                runtimeCaching: [
                    {
                        handler: 'networkFirst',
                        urlPattern: /^https?.*/,
                    }
                ]
            })
        )
        config.plugins = [
            ...config.plugins,
            
            // Read the .env file
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true
            })
        ]
        return config;
    }
}

// module.exports = withCSS();