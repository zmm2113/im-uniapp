import fc from '@/common/publicFc.js'
let timer=null
export default {
	// 连接WebSocket
	connectSocket() {
		uni.connectSocket({
			url: 'wss://im-api.q3z3.com/ws?Authorization=' + uni.getStorageSync('Authorization'),
			complete: () => {}
		});
		uni.onSocketOpen(res => {
			console.log('WebSocket连接已打开！');
			// 设置心跳
			timer=setInterval(()=>{
				uni.sendSocketMessage({
					data:'isConnact',
					success:res=>{
						if(res.errMsg=='sendSocketMessage:ok'){
							console.log('WebSocket已连接')
						}else{
							this.connectSocket()
						}
					}
				})
			},5000)
		})
		// 监听接收
		uni.onSocketMessage(res => {
			if(res.data=='ok'){
				return
			}
			var data = JSON.parse(res.data);
			fc.getPush(data);
			console.log('WebSocket接收消息！');
		})
		// 监听关闭
		uni.onSocketClose(res => {
			console.log('WebSocket连接已关闭！');
		})
		// 监听异常
		uni.onSocketError(res => {
			console.log('WebSocket连接打开失败，正在尝试重新打开！');
			setTimeout(()=>{
				this.connectSocket()
			},15000)
		});
		
	},
	// 关闭WebSocket
	socketTaskClose() {
		uni.closeSocket(res => {
			clearInterval(timer)
			console.log('WebSocket 已关闭！');
		})
	},
}
