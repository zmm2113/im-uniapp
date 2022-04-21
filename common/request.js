// #ifdef APP-PLUS
import appUpgrade from '@/common/appUpgrade.js';
// #endif
let http = {
	'setBaseUrl': (url) => {
		if (url.charAt(url.length - 1) === "/") {
			url = url.substr(0, url.length - 1)
		}
		http.baseUrl = url;
	},
	'header': {},
	'beforeRequestFilter': (config) => {
		return config
	},
	'beforeResponseFilter': (res) => {
		return res
	},
	'afterResponseFilter': (successResult) => {},
	'get': get,
	'delete': deletE,
	'post': post,
	'put': put,
	'request': request,
	'uploadFile': uploadFile,
	'downloadFile': downloadFile
}


function init(con) {
	//url
	let url = http.baseUrl;
	if (url && con.url && !con.url.match(/^(http|https):\/\/([\w.]+\/?)\S*$/)) {
		if (con.url.charAt(0) !== "/") {
			con.url = "/" + con.url;
		}
		con.url = url.concat(con.url);
	}
	//header
	if (http.header != undefined && http.header != null) {
		if (!con.header) {
			con.header = http.header;
		} else {
			Object.keys(http.header).forEach(function(key) {
				con.header[key] = http.header[key]
			});
		}
	}
}

function request(con) {
	init(con);
	let config = { //判断是否有以下属性没有就赋予默认值
		url: con.url ? con.url : http.baseUrl,
		data: con.data,
		header: con.header,
		method: con.method ? con.method : 'GET',
		dataType: con.dataType ? con.dataType : 'json',
		responseType: con.responseType ? con.responseType : 'text',
		success: con.success ? (res) => {
			http.afterResponseFilter(con.success(http.beforeResponseFilter(res)));
		} : null,
		fail: con.fail ? (res) => {
			con.fail(res);
		} : () => {
			uni.showToast({
				title: '请检查网络',
				icon: 'none'
			});
			uni.hideLoading();
		},
		complete: con.complete ? (res) => {
			con.complete(res);
		} : (res) => {
			if (!res.statusCode) {
				uni.showToast({
					title: '请求失败',
					icon: 'none'
				});
				uni.hideLoading();
			}
			if (res.statusCode !== 200) {
				uni.showToast({
					title: '请求失败',
					icon: 'none'
				});
				uni.hideLoading();
			}
			if (res.statusCode == 200) {
				if (res.data.code == 401) { //登录过期
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					});
					uni.hideLoading();
					// uni.clearStorage()
					// setTimeout(()=>{
					uni.reLaunch({
						url:'/pages/wxindex/index'
					})
					// },1000)
				}
				// #ifdef APP-PLUS
				if (res.data.code == 601) { //强制拉起升级
					request({
						url: '/common/getVersion',
						success: (res) => {
							appUpgrade.init({
								titleText: '版本更新'+res.data.data.version,
								packageUrl:res.data.data.url,
								content: res.data.data.content,
								forceUpgrade:true
							});
							appUpgrade.show();
						}
					});
				}
				// #endif
				else if (res.data.code && res.data.code !== 200) { //这里code是自己的服务器正确标识
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						position:'top'
					});
				}
				uni.hideLoading();
			}
			uni.stopPullDownRefresh();
		}
	}
	const AUTH_TOKEN = ["Authorization","device","version"];
	for (var i = 0; i < AUTH_TOKEN.length; i++) {
		if (uni.getStorageSync(AUTH_TOKEN[i])) {
			http.header[AUTH_TOKEN[i]] = uni.getStorageSync(AUTH_TOKEN[i]);
		}
	}
	return uni.request(http.beforeRequestFilter(config));
}

function get(url, con, success) {
	let conf = {};
	if (con && typeof con == 'function') {
		if (success && typeof success == 'object') {
			conf = success;
		}
		conf.success = con
	} else {
		if (con && typeof con == 'object') {
			conf = con;
		}
		conf.success = success;
	}

	if (url) {
		conf.url = url
	}
	conf.method = "GET";
	return request(conf);
}

function deletE(url, con, success) {
	let conf = {};
	if (con && typeof con == 'function') {
		if (success && typeof success == 'object') {
			conf = success;
		}
		conf.success = con
	} else {
		if (con && typeof con == 'object') {
			conf = con;
		}
		conf.success = success;
	}

	if (url) {
		conf.url = url
	}
	conf.method = "DELETE";
	return request(conf);
}

function post(url, data, con, success) {
	let conf = {};
	if (con && typeof con == 'function') {
		if (success && typeof success == 'object') {
			conf = success
		}
		conf.success = con;
	} else {
		if (con && typeof con == 'object') {
			conf = con;
		}
		conf.success = success;
	}
	if (url) {
		conf.url = url
	}
	if (data) {
		conf.data = data
	}
	conf.method = "POST";
	return request(conf);
}

function put(url, data, con, success) {
	let conf = {};
	if (con && typeof con == 'function') {
		if (success && typeof success == 'object') {
			conf = success
		}
		conf.success = con;
	} else {
		if (con && typeof con == 'object') {
			conf = con;
		}
		conf.success = success;
	}
	if (url) {
		conf.url = url
	}
	if (data) {
		conf.data = data
	}
	conf.method = "PUT";
	return request(conf);
}

function uploadFile(con) {
	init(con);
	let config = {
		url: con.url ? con.url : http.baseUrl,
		files: con.files,
		filesType: con.filesType,
		filePath: con.filePath,
		name: con.name,
		header: con.header,
		formData: con.formData,
		success: con.success ? (res) => {
			http.afterResponseFilter(con.success(http.beforeResponseFilter(res)));
		} : null,
		fail: con.fail ? (res) => {
			con.fail(res);
		} : null,
		complete: con.complete ? (res) => {
			con.complete(res);
		} : null
	}
	const AUTH_TOKEN = ["Authorization","device","version"];
	for (var i = 0; i < AUTH_TOKEN.length; i++) {
		if (uni.getStorageSync(AUTH_TOKEN[i])) {
			http.header[AUTH_TOKEN[i]] = uni.getStorageSync(AUTH_TOKEN[i]);
		}
	}
	return uni.uploadFile(http.beforeRequestFilter(config));
}

function downloadFile(con) {
	init(con);
	let config = {
		url: con.url ? con.url : http.baseUrl,
		header: con.header,
		success: con.success ? (res) => {
			http.afterResponseFilter(con.success(http.beforeResponseFilter(res)));
		} : null,
		fail: con.fail ? (res) => {
			con.fail(res);
		} : null,
		complete: con.complete ? (res) => {
			con.complete(res);
		} : null
	}
	return uni.downloadFile(http.beforeRequestFilter(config));
}
// 使用
//POST
// this.$http.request({
// 	url: '/xxx',
// 	method: 'POST',
// 	data:JSON.stringify({id:111}),
// 	success: (res) => {
// 		if (res.data.code == 200) {
// 			
// 		}
// 	}
// });
//GET
// this.$http.request({
// 	url: '/xxx?id=111',
// 	success: (res) => {
// 		if (res.data.code == 200) {
// 			
// 		}
// 	}
// });
// 地址及配置
http.setBaseUrl("https://im-api.q3z3.com"); //在线服务器
// http.setBaseUrl("http://192.168.0.105:8080"); //离线服务器
export default http
