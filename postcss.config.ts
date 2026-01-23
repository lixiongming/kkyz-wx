/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('./common')

const plugins = [
	require('tailwindcss')(
	    {
	        config: resolve("./tailwind.config.js"),
	    }
	),
    require('autoprefixer')()
]
module.exports = {
    plugins
}
