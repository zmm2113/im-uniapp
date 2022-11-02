import fc from '@/common/publicFc.js'
let timer=null
let retimer=null
export default {
	socketTask:null,
	// 连接WebSocket
	connectSocket() {
		this.socketTask=uni.connectSocket({
			url: 'wss://im-api.q3z3.com/ws?Authorization=' + uni.getStorageSync('Authorization'),
			complete: () => {}
		});
		this.socketTask.onOpen(res => {
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
		this.socketTask.onMessage(res => {
			if(res.data=='ok'){
				return
			}
			var data = JSON.parse(res.data);
			fc.getPush(data);
			console.log('WebSocket接收消息！');
		})
		// 监听关闭
		this.socketTask.onClose(res => {
			console.log('WebSocket连接已关闭！');
			let token= uni.getStorageSync('Authorization');
			if(this.socketTask&&token){
				this.socketTaskClose()
				retimer=setTimeout(()=>{
					this.connectSocket()
				},5000)
			}
		})
		// 监听异常
		this.socketTask.onError(res => {
			console.log('WebSocket连接打开失败，正在尝试重新打开！');
			if(this.socketTask){
				this.socketTaskClose()
				retimer=setTimeout(()=>{
					this.connectSocket()
				},5000)
			}
			
		});
		
	},
	// 关闭WebSocket
	socketTaskClose() {
		if(this.socketTask){
			this.socketTask.close()
			clearInterval(timer)
			clearTimeout(retimer)
			console.log('关闭WebSocket！');
		}
	},
}
