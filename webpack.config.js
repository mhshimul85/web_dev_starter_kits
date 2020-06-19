// Md. Mehadi Hasan Shimul
const
path = require('path');

module.exports = [
   Object.assign(
   	{},
   	{
			module: {
				rules: [
   				{
      				test: /\.m?js$/,
      				exclude: /(node_modules|bower_components)/,
      				use: {
        					loader: 'babel-loader',
        					options: {
          					presets: ['@babel/preset-env']
        					}
      				}
    				}
  				]
			}   	
   	},
	   
   	{
    		name	: "shimul",
    		entry	: {
    			App	: "./app/assets/scripts/App.js",
    			Vendor: "./app/assets/scripts/Vendor.js"
  			},
  	 		output: {
    			path: path.resolve(__dirname,"./app/temp/scripts"),
    			filename: "[name].js"
  			},
		}
	)
];
