var $_cConfig = {
	development: {
		// 是否通过接口加载路由
		useAuthorityRoute: true,


	},

	production: {
		// 是否通过接口加载路由
		remWidth: {
			moduleWidth: 1920,
			containerWidth: 1920,
		},
	}
}
var $_devRequest = {
	// location:"http://120.26.62.101:3030",
	location:"http://localhost:3030",
	module: "stationConfig",
}

var $_proRequest = {
	location:"http://120.26.62.101:3030",
	module: 'station-patrol'
}