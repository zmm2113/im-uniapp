import fc from '@/common/publicFc.js'
let timer = null; //心跳计时器
let debug = false; //debug输出log
let retimer = null; //重连计时器
let pingCount = 0; //心跳次数
let pingCountMax = 5; //最大心跳次数超过重连
let pingTimeout = 5000; //心跳间隔时间(毫秒)
let connectTimeout = 2000; //重连时间(毫秒)
let socketTask = null; //ws
// 连接WebSocket
export function connectSocket() {
	debug && console.log(socketTask);
	var token = uni.getStorageSync('Authorization');
	if (!token || socketTask) {
		console.log('开启socketTask失败')
		return
	}
	socketTask = uni.connectSocket({
		url: 'wss://im-api.q3z3.com/ws?Authorization=' + uni.getStorageSync('Authorization'),//WebSocket地址
		// url: 'ws://192.168.0.200:8080/ws?Authorization=' + uni.getStorageSync('Authorization'),//WebSocket地址
		complete: () => {}
	});
	socketTask.onOpen(res => {
		console.log('WebSocket连接已打开！');
		debug && console.log(socketTask);
		// 发送心跳
		socketTask.send({
			data: 'isConnact',
			success: res => {
				if (res.errMsg == 'sendSocketMessage:ok') {
					debug && console.log('WebSocket心跳ping');
				}
			}
		})
		// 定时心跳
		timer = setInterval(() => {
			// ping超过5次未响应则重连
			pingCount++
			debug && console.log('ping次数'+pingCount+'/'+pingCountMax);
			if (pingCount >= pingCountMax) {
				clearSocketTask()
				reConnectSocket()
				return
			}
			socketTask.send({
				data: 'isConnact',
				success: res => {
					if (res.errMsg == 'sendSocketMessage:ok') {
						debug && console.log('WebSocket心跳ping');
					}
				}
			})
		}, pingTimeout)
	})
	// 监听接收
	socketTask.onMessage(res => {
		if (socketTask && token) {
			if(res.data=='ok'){
				pingCount = 0;
				return
			}
			var data = JSON.parse(res.data);
			fc.getPush(data);
			console.log('WebSocket接收消息！');
		}
	})
	// 监听关闭
	socketTask.onClose((res) => {
		debug && console.log(socketTask);
		console.log('WebSocket连接已关闭！');
		if (!socketTask) {
			console.log('无需操作')
			return
		}
		if (socketTask.readyState !== 1) {
			console.log('需要重新连接')
			clearSocketTask()
			reConnectSocket()
		}
	})
	// 监听异常
	socketTask.onError(res => {
		debug && console.log(socketTask);
		console.log('WebSocket连接异常！');
		if (!socketTask) {
			console.log('无需操作')
			return
		}
		if (socketTask.readyState !== 1) {
			console.log('需要重新连接')
			clearSocketTask()
			reConnectSocket()
		}
	});
}

// 清理WebSocket
export function clearSocketTask() {
	clearInterval(timer)
	clearTimeout(retimer)
	pingCount = 0;
	if (socketTask) {
		socketTask.close()
		socketTask = null
		console.log('主动关闭WebSocket！');
	}
}

// 重新连接WebSocket
export function reConnectSocket() {
	retimer = setTimeout(() => {
		connectSocket()
	}, connectTimeout)
}
