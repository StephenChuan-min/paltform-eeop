// const path = require('path');

module.exports = {
	configureWebpack:{
		resolve:{
			alias:{
				// '@@': path.resolve(__dirname)+'\\src/views'
			}
		}
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: {
						'primary-color': '#008CB0', // 全局主色
						'link-color': 'rgba(0, 140, 176, 0.73)', // 链接色
						'border-radius-base': '2px',
					},
					javascriptEnabled: true,
				},
			},
			scss: {
				additionalData: `@import "~@/assets/css/configuration.scss";`
			},

		}
	},
	productionSourceMap:false,
	devServer:{
		proxy: {
			'/proxy-api': {     //这里最好有一个 /
				target: 'http://172.16.151.210:8001/api',  // 后台接口域名
				// target: 'http://172.18.255.207:10002',  // 后台接口域名
				ws: true,        //如果要代理 websockets，配置这个参数
				secure: false,  // 如果是https接口，需要配置这个参数
				changeOrigin: true,  //是否跨域
				pathRewrite:{
					'^/proxy-api':''
				}
			}
		}
	}
};
