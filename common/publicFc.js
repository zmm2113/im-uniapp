import http from '@/common/request'
import browser from '@/common/browser'
import store from '../store'
import pinyin from '@/common/pinyin.js';
export default {
	// 获取字典
	getdict(dict) {
		return new Promise((resolve, reject) => {
			http.request({
				url: '/system/dict/data/type/' + dict,
				success: (res) => {
					if (res.data.code == 200) {
						var data = res.data.data
						var arr = []
						for (var i = 0; i < data.length; i++) {
							arr.push({
								label: data[i].dictLabel,
								value: data[i].dictValue
							})
						}
						// return arr
						resolve(arr);
					} else {
						reject(res);
					}
				},
				fail: (res) => {
					reject(new Error(res.errMsg));
				}
			});
		});
	},
	//文本转json
	returnParse(txt) {
		return JSON.parse(txt);
	},
	//字典翻译
	findLabel(arr, text) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].value == text) {
				return arr[i].label
				break;
			}
		}
	},
	//判断按钮权限
	permissions(permissions) {
		var data = store.state.permissions
		var have = data.indexOf(permissions)
		if (have !== -1) {
			return true
		}
	},
	//判断单个角色权限
	hasRole(Role) {
		var data = store.state.userRole
		var have = data.indexOf(Role)
		if (have !== -1) {
			return true
		}
	},
	//判断多个角色权限
	hasRoles(Roles) {
		var data = store.state.userRole

		function fidrole(Roles) {
			for (var i = 0; i < Roles.length; i++) {
				var have = data.indexOf(Roles[i])
				if (have !== -1) {
					return true
				}
			}
			return false
		}
		return fidrole(Roles)
	},
	//预览单张图片
	previewImagesolo(File) {
		uni.previewImage({
			urls: [File],
		});
	},
	//预览一组图片(图片组,图片索引)
	previewImages(FilePaths, current) {
		uni.previewImage({
			urls: FilePaths,
			current: current
		});
	},
	//根据后缀判断文件类型
	getFileType(fileName) {
		// 后缀获取
		let suffix = '';
		// 获取类型结果
		let result = '';
		try {
			const flieArr = fileName.split('.');
			suffix = flieArr[flieArr.length - 1];
		} catch (err) {
			suffix = '';
		}
		// fileName无后缀返回 false
		if (!suffix) {
			return false;
		}
		suffix = suffix.toLocaleLowerCase();
		// 图片格式
		const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
		// 进行图片匹配
		result = imglist.find(item => item === suffix);
		if (result) {
			return 'image';
		}
		// 匹配txt
		const txtlist = ['txt'];
		result = txtlist.find(item => item === suffix);
		if (result) {
			return 'txt';
		}
		// 匹配 excel
		const excelist = ['xls', 'xlsx'];
		result = excelist.find(item => item === suffix);
		if (result) {
			return 'excel';
		}
		// 匹配 word
		const wordlist = ['doc', 'docx'];
		result = wordlist.find(item => item === suffix);
		if (result) {
			return 'word';
		}
		// 匹配 pdf
		const pdflist = ['pdf'];
		result = pdflist.find(item => item === suffix);
		if (result) {
			return 'pdf';
		}
		// 匹配 ppt
		const pptlist = ['ppt', 'pptx'];
		result = pptlist.find(item => item === suffix);
		if (result) {
			return 'ppt';
		}
		// 匹配 视频
		const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
		result = videolist.find(item => item === suffix);
		if (result) {
			return 'video';
		}
		// 匹配 音频
		const radiolist = ['mp3', 'wav', 'wmv'];
		result = radiolist.find(item => item === suffix);
		if (result) {
			return 'radio';
		}
		// 其他 文件类型
		return 'other';
	},
	//新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
	onOpenDoc(e) {
		uni.downloadFile({
			url: e,
			success: function(res) {
				var filePath = res.tempFilePath;
				uni.openDocument({
					filePath: filePath,
					success: function(res) {
						console.log('打开文档成功');
					}
				});
			}
		});
	},
	//模拟浏览器打开第三方链接
	openWebView(url) {
		// #ifndef APP-PLUS
		uni.showToast({
			title: '仅手机端可打开',
			icon: 'none'
		})
		return
		// #endif
		var options = { // 自定义头部参数
		}
		browser.init(options)
		browser.show(url)
	},
	//获取时间format
	getNewDate(format, add0,datetime) {
		//获取当前时间
		function addZero(val) {
			//补零
			if (add0) {
				return val <= 9 ? '0' + val : val;
			} else {
				return val
			}
		}
		var date = new Date()
		if(datetime){
			date=Date.parse(new Date(datetime))
		}
		
		var year = date.getFullYear(),
			month = addZero(date.getMonth() + 1),
			strDate = addZero(date.getDate()),
			hours = addZero(date.getHours()),
			minutes = addZero(date.getMinutes()),
			seconds = addZero(date.getSeconds());
		switch (format) {
			case 'y':
				return year;
				break;
			case 'm':
				return month;
				break;
			case 'd':
				return strDate;
				break;
			case 'h':
				return hours;
				break;
			case 'mm':
				return minutes;
				break;
			case 'ss':
				return seconds;
				break;
			case 'ymd':
				return year + '-' + month + '-' + strDate;
				break;
			case 'hmmss':
				return hours + ':' + minutes + ':' + seconds;
				break;
			default:
				return year + '-' + month + '-' + strDate + ' ' + hours + ':' + minutes + ':' + seconds;
				break;
		}
	},
	//获取本地存储object/初始化
	getKeyObjectStorage(keyname) {
		try {
			var chatData = uni.getStorageSync(keyname);
			if (chatData) {
				chatData = JSON.parse(chatData)
				return chatData
			} else {
				chatData = new Object()
				return chatData
				uni.setStorageSync(keyname, JSON.stringify(chatData));
			}
		} catch (e) {
			return new Object()
		}
	},
	loadMore({
		url='xxx/list/',
		queryParams={
			refreshing:false,
			pageNum:1,
			status: 'more',//more loading前 loading loading中 noMore 没有更多了
			pageSize:10
		},
		status='0'//0无更多数据 1持续加载 2重新加载 3无数据+清空数据
	}){
		return new Promise((resolve, reject) => {
			http.request({
				url:url+'&pageNum='+(queryParams.refreshing ? 1 : queryParams.pageNum) +'&pageSize=' +queryParams.pageSize,
				success: res => {
					if (res.data.code == 200) {
						let list = [];
						let data = res.data.rows;
						if (queryParams.refreshing&&res.data.rows == ''||queryParams.refreshing&&res.data.rows.length==0) {
							queryParams.status='noMore'
							resolve({
								queryParams:queryParams,
								list:list,
								status:'3'
							})
							return
						}
						if (res.data.rows == ''||res.data.rows.length==0) {
							queryParams.status='noMore'
							resolve({
								queryParams:queryParams,
								list:list,
								status:'0'
							})
							return
						}
						for (let i = 0, length = data.length; i < length; i++) {
							var item = data[i];
							list.push(item);
						}
						if (queryParams.refreshing) {
							queryParams.refreshing = false;
							queryParams.pageNum = 2;
							queryParams.status='more'
							resolve({
								queryParams:queryParams,
								list:list,
								status:'2'
							})
						} else {
							queryParams.pageNum += 1;
							queryParams.status='more'
							resolve({
								queryParams:queryParams,
								list:list,
								status:'1'
							})
						}
					} else {
						reject(res);
					}
				},
				fail: (res) => {
					reject(res);
				}
			});
		});
	},
	//接收推送消息
	getPush(resbody) {
		console.log(resbody)
		var pushType = resbody.pushType //推送类型
		if (pushType == 'MSG') {
			if(resbody.msgContent.msgType=='TRTC_VOICE_START'||resbody.msgContent.msgType=='TRTC_VIDEO_START'){
				//音视频开始拦截
				return
			}
			var userId=resbody.fromInfo.userId
			var windowType='SINGLE'
			if(resbody.groupInfo.userId){
				userId=resbody.groupInfo.userId
				windowType='GROUP'
			}
			this.pushInMsg({
				type: resbody.msgContent.msgType == 'ALERT' ? 3 : 1, //显示类型 1左侧 2右侧 3中间
				msgContent: resbody.msgContent.content, //msg内容
				msgType: resbody.msgContent.msgType, //msgType信息类型
				windowType: windowType, //聊天室类型 SINGLE GROUP
				time: resbody.createTime, //时间
				fromInfo:resbody.fromInfo,//来源信息
				groupInfo:resbody.groupInfo,//群信息
				userId: userId,//talktoId
				personId:resbody.fromInfo.userId,
				msgId:resbody.msgId,//消息Id
				disturb:resbody.msgContent.disturb,//是否静默消息
				top:resbody.msgContent.top//是否置顶
			})
			return
		}
		if (pushType == 'NOTICE') {//红点通知等
			if(resbody.msgContent.topicReply.count){
				store.commit('update_topicReply',resbody.msgContent.topicReply)
			}
			if(resbody.msgContent.topicRed.portrait){
				store.commit('update_topicRed',resbody.msgContent.topicRed)
			}
			if(resbody.msgContent.friendApply.count){
				store.commit('update_friendApply',resbody.msgContent.friendApply)
			}
		}
		if (pushType == 'BIG') {//大消息
			var bigId=resbody.msgContent.content
			http.request({
				url: '/chat/getBigMsg/'+bigId,
				success: (res) => {
					if (res.data.code == 200) {
						var resbody=res.data.data
						var userId=resbody.fromInfo.userId
						var windowType='SINGLE'
						if(resbody.groupInfo.userId){
							userId=resbody.groupInfo.userId
							windowType='GROUP'
						}
						this.pushInMsg({
							type: resbody.msgContent.msgType == 'ALERT' ? 3 : 1, //显示类型 1左侧 2右侧 3中间
							msgContent: resbody.msgContent.content, //msg内容
							msgType: resbody.msgContent.msgType, //msgType信息类型
							windowType: windowType, //聊天室类型 SINGLE GROUP
							time: resbody.createTime, //时间
							fromInfo:resbody.fromInfo,//来源信息
							groupInfo:resbody.groupInfo,//群信息
							userId: userId,//talktoId
							personId:resbody.fromInfo.userId,
							msgId:resbody.msgId,//消息Id
							disturb:resbody.msgContent.disturb,//是否静默消息
							top:resbody.msgContent.top//是否置顶
						})
					}
				}
			});
			return
		}
	},
	// 接收到的聊天推送
	pushInMsg({
		msgId,//消息Id
		msgContent,//内容
		msgType,//消息类型
		windowType,//聊天室类型 SINGLE GROUP
		userId,//聊天对象ID
		personId,//发送人ID
		time,//时间
		type,//显示类型 1左侧 2右侧 3中间
		fromInfo,//来源
		groupInfo,//群信息
		disturb,//是否静默消息
		top//是否置顶
	}) {
		var msgTypeLabel = ''; //消息类型
		if (msgType == 'TEXT') {
			msgTypeLabel = msgContent;
		}
		if (msgType == 'ALERT') {
			msgTypeLabel = msgContent;
		}
		if (msgType == 'IMAGE') {
			msgTypeLabel = '[图片]';
		}
		if (msgType == 'VOICE') {
			msgTypeLabel = '[语音]';
		}
		if (msgType == 'VIDEO') {
			msgTypeLabel = '[视频]';
		}
		if (msgType == 'LOCATION') {
			msgTypeLabel = '[位置]';
		}
		if (msgType == 'COLLECTION') {
			msgTypeLabel = '[收藏]';
		}
		if (msgType == 'CARD') {
			msgTypeLabel = '[名片]';
		}
		if (msgType == 'FILE') {
			msgTypeLabel = '[文件]';
		}
		if (msgType == 'TRTC_VOICE_END') {
			msgTypeLabel = '[语音通话]'
		}
		if (msgType == 'TRTC_VIDEO_END') {
			msgTypeLabel = '[视频通话]'
		}
		store.dispatch('createChatObj',{
			userId:userId,
			windowType:windowType,
		}).then(res=>{
			var localData=res.data
			store.dispatch('getchatDatalist');
			store.dispatch('getChatList');
			var chatWindowData = store.state.chatDatalist[userId].list
			var chatListInfo = store.state.chatlist[userId]
			// 找到数组中对象属性值一样的对象并返回
			function arrfindobject({arr,object,key}){
				var result=arr.find(item =>{
				    return item[key] == object[key]
				});
				return result
			}
			var same=arrfindobject({arr:chatWindowData,object:{
				msgId:msgId
			},key:'msgId'})
			if(same){
				return
			}
			//离线消息体
			var msgOffline = {
				userId: userId,
				personId: personId,
				nickName: fromInfo.nickName,
				portrait: fromInfo.portrait,
				msgType: msgType,
				content: msgContent,
				time: time,
				type: type,
				msgId:msgId,
				windowType: windowType
			}
			
			// 聊天记录体
			var msgList = {}
			if(windowType=='SINGLE'){
				msgList = {
					userId: userId,
					personId: personId,
					nickName: fromInfo.nickName,
					portrait: fromInfo.portrait,
					content: msgTypeLabel,
					time: time,
					num: disturb=='Y' ? 'dot' : (chatListInfo.num ? chatListInfo.num + 1 : 1),
					windowType: windowType,
					disturb:disturb,//是否静默消息
					top:top,//是否置顶
					userType:fromInfo.userType
				}
			}
			if(windowType=='GROUP'){
				msgList = {
					userId: userId,
					personId: personId,
					nickName: groupInfo.nickName,
					portrait: groupInfo.portrait,
					content: msgTypeLabel,
					time: time,
					num: disturb=='Y' ? 'dot' : (chatListInfo.num ? chatListInfo.num + 1 : 1),
					windowType: windowType,
					disturb:disturb,//是否静默消息
					top:top,//是否置顶
					userType:'GROUP'
				}
			}
			chatWindowData.push(msgOffline)
			store.dispatch('updateChatById', {
				userId: userId,
				data: chatWindowData
			})
			store.dispatch('updateChatListInfoById', {
				userId: userId,
				data: msgList
			})
			store.dispatch('tabBarpull')
			store.dispatch('updateChatDataState',userId);
		});
	},
	//发送消息
	pushOutMsg({
		msgContent, //内容
		msgType, //消息类型
		windowType, //聊天室类型SINGLE GROUP
		userId
	}) {
		var msgTypeLabel = ''; //消息类型
		if (msgType == 'TEXT') {
			msgTypeLabel = msgContent;
		}
		if (msgType == 'ALERT') {
			msgTypeLabel = msgContent;
		}
		if (msgType == 'IMAGE') {
			msgTypeLabel = '[图片]';
		}
		if (msgType == 'VOICE') {
			msgTypeLabel = '[语音]';
		}
		if (msgType == 'VIDEO') {
			msgTypeLabel = '[视频]';
		}
		if (msgType == 'LOCATION') {
			msgTypeLabel = '[位置]';
		}
		if (msgType == 'COLLECTION') {
			msgTypeLabel = '[收藏]';
		}
		if (msgType == 'CARD') {
			msgTypeLabel = '[名片]';
		}
		if (msgType == 'FILE') {
			msgTypeLabel = '[文件]';
		}
		if (msgType == 'TRTC_VOICE_END') {
			msgTypeLabel = '[语音通话]'
		}
		if (msgType == 'TRTC_VIDEO_END') {
			msgTypeLabel = '[视频通话]'
		}
		var userInfo = store.state.userInfo;
		store.dispatch('createChatObj',{
			userId:userId,
			windowType:windowType,
		}).then(res=>{
			var localData=res.data
			store.dispatch('getchatDatalist');
			store.dispatch('getChatList');
			var chatWindowData = store.state.chatDatalist[userId].list
			var chatListInfo = store.state.chatlist[userId]
			var time = this.getNewDate('format',true)
			//在线消息体
			var msgOnlie={}
			//聊天记录
			var msgList={}
			var url=''
			if(windowType=='SINGLE'){
				msgOnlie = {
					userId: userId,
					msgType: msgType,
					content: msgContent
				}
				url='/chat/sendMsg'
				msgList = {
					userId: userId,
					personId: userInfo.userId,
					nickName: localData.fromInfo.nickName,
					portrait: localData.fromInfo.portrait,
					content: msgTypeLabel,
					time: time,
					num: chatListInfo.disturb=='Y' ? 'dot' : (chatListInfo.num ? chatListInfo.num : 0),
					windowType: windowType,
					disturb:chatListInfo.disturb ? chatListInfo.disturb : 'N',//是否静默消息
					top:chatListInfo.top ? chatListInfo.top : 'N',//是否置顶
					userType:localData.fromInfo.userType
				}
			}
			if(windowType=='GROUP'){
				msgOnlie = {
					groupId: userId,
					msgType: msgType,
					content: msgContent
				}
				url='/group/sendMsg'
				msgList = {
					userId: userId,
					personId: userInfo.userId,
					nickName: localData.groupInfo.nickName,
					portrait: localData.groupInfo.portrait,
					content: msgTypeLabel,
					time: time,
					num: chatListInfo.disturb=='Y' ? 'dot' : (chatListInfo.num ? chatListInfo.num : 0),
					windowType: windowType,
					disturb:chatListInfo.disturb ? chatListInfo.disturb : 'N',//是否静默消息
					top:chatListInfo.top ? chatListInfo.top : 'N',//是否置顶
					userType:'GROUP'
				}
			}
			//离线消息体 自己的消息
			var msgOffline = {
				userId: userInfo.userId,
				personId: userInfo.userId,
				nickName: userInfo.nickName,
				portrait: userInfo.portrait,
				msgType: msgType,
				content: msgContent,
				time: time,
				type: 2,
				msgId:'local',
				windowType: windowType
			};
			//离线/发送失败错误消息体
			var msgNotSend = {
				userId: userInfo.userId,
				portrait: userInfo.portrait,
				msgType: msgType,
				content: msgContent,
				type: 3
			};
			var msgSendType = 'wating';
			http.request({
				url: url,
				method: 'POST',
				data: JSON.stringify(msgOnlie),
				success: res => {
					if (res.data.code == 200) {
						if (res.data.data.status !== '0') {
							msgSendType = 'error';
							msgOffline.sendtype = msgSendType;
							msgNotSend.content = res.data.data.statusLabel;
							msgList.content = res.data.data.statusLabel;
						} else {
							msgSendType = 'success';
						}
					} else {
						msgSendType = 'error';
						msgOffline.sendtype = msgSendType;
						msgNotSend.content = res.data.msg;
					}
					chatWindowData.push(msgOffline);
					if (msgSendType == 'error') {
						chatWindowData.push(msgNotSend);
					}
					store.dispatch('updateChatById', {
						userId: userId,
						data: chatWindowData
					});
					store.dispatch('updateChatListInfoById', {
						userId: userId,
						data: msgList
					});
					store.dispatch('tabBarpull');
					store.dispatch('updateChatDataState',userId);
				},
				fail: res => {
					msgSendType = 'error';
					msgOffline.sendtype = msgSendType;
					msgNotSend.content = '发送失败，请检查网络';
					chatWindowData.push(msgOffline);
					chatWindowData.push(msgNotSend);
					store.dispatch('updateChatById', {
						userId: userId,
						data: chatWindowData
					});
					store.dispatch('updateChatListInfoById', {
						userId: userId,
						data: msgList
					});
					store.dispatch('tabBarpull');
					store.dispatch('updateChatDataState',userId);
				}
			});
		});
	},
	//H5保存base64图片
	h5SaveBase64Img({
		base64
	}) {
		var arr = base64.split(',');
		var bytes = atob(arr[1]);
		let ab = new ArrayBuffer(bytes.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}
		var blob = new Blob([ab], {
			type: 'application/octet-stream'
		});
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = new Date().getTime() + ".png";
		var e = document.createEvent('MouseEvents');
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		URL.revokeObjectURL(url);
	},
	//APP保存base64图片
	plusSaveBase64Img({
		base64
	}) {
		const bitmap = new plus.nativeObj.Bitmap("test");
		bitmap.loadBase64Data(base64, function() {
			const url = new Date().getTime() + ".png"; // url为时间戳命名方式
			bitmap.save(url, {
				overwrite: true, // 是否覆盖
			}, (i) => {
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function() {
						uni.showToast({
							title: '图片保存成功',
							icon: 'none'
						})
						bitmap.clear()
					}
				});
			}, (e) => {
				uni.showToast({
					title: '图片保存失败',
					icon: 'none'
				})
				bitmap.clear()
			});
		}, (e) => {
			uni.showToast({
				title: '图片保存失败',
				icon: 'none'
			})
			bitmap.clear()
		});
	},
	// 寻找数组中的对象中的key对应值的对象
	arrFindkey({
		arr, //数组[{id:'1'}]
		key, //key键值'id'
		val //值 '1'
	}) {
		var item = arr.find(function(obj, i, arr) {
			return obj[key] === val
		})
		var index = arr.findIndex(function(obj, i, arr) {
			return obj[key] === val
		})
		return {
			item: item,
			index: index
		}
	},
	//APP下载文件
	plusDownload({
		onlinePath,
		savePath = 'file://storage/emulated/0/Documents/weiliao/'
	}) {
		return new Promise((resolve, reject) => {
			// #ifdef H5
			reject('下载失败，H5不支持plus')
			return
			// #endif
			var fname = onlinePath.split("/").pop()
			var localPath = savePath + fname
			plus.io.resolveLocalFileSystemURL( //检测本地是否存在
				localPath,
				(entry) => {
					console.log('文件已存在' + entry.name)
					resolve(entry.fullPath)
				},
				(e) => {
					console.log('文件不存在：' + e.message);
					uni.showLoading({
						title: '加载中'
					})
					createDownload(onlinePath)
				}
			);

			function createDownload(e) {
				let downloadOptions = {
					method: "GET",
					timeout: 120,
					retryInterval: 10,
					filename: savePath
				};
				// https://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.Download
				var dtask = plus.downloader.createDownload(e, downloadOptions, function(download, status) {
					uni.hideLoading()
					// 下载完成
					if (status == 200) {
						resolve(download.filename)
					} else {
						reject({
							status: status,
							msg: '下载失败'
						})
					}
				});
				dtask.start();
			}
		})
	},
	//APP打开文件
	plusOpenFile({
		filePath
	}) {

		let system = uni.getSystemInfoSync().platform;
		if (system == 'ios') {
			filePath = encodeURI(filePath);
		}
		uni.openDocument({
			filePath,
			success: res => {
				// console.log('打开文件成功');
			},
			fail: res => {
				console.log(res);
			}
		});
	},
	// 汉字拼音A-Z排序
	sortList({
		list,
		key
	}) {
		var sortKey = [] //字母
		list.forEach(item => {
			let firstChar = ''
			item[key] = item[key] ? item[key].trim() : ""
			if (item[key]) { // 如传入空字符串，getCamelFistChar错误地返回Y
				firstChar = pinyin.getCamelFistChar(item[key]).toUpperCase() // 如字母开头，将返回字母且保留原大小写;一律改为大写
				var reg = /^\d+$/;
				if (reg.test(firstChar)) {
					firstChar = 'Z#'
				}
				item.sort = firstChar
				sortKey.push(firstChar)
			}
		})
		sortKey = [...new Set(sortKey)]
		list.sort((a, b) => a.sort.localeCompare(b.sort, 'zh')) //排序
		sortKey.sort((a, b) => a.localeCompare(b, 'zh')) //排序
		var sortlist = []
		for (var i = 0; i < sortKey.length; i++) {
			var sort = sortKey[i]
			if (sort == 'Z#') {
				sort = '#'
			}
			sortlist.push({
				letter: sort,
				data: []
			})
			for (var j = 0; j < list.length; j++) {
				var item = list[j]
				if (item.sort == 'Z#') {
					item.sort = '#'
				}
				if (item.sort == sort) {
					sortlist[i].data.push(item)
				}
			}
		}
		return sortlist
	},
	saoyisao(){//扫一扫
		// #ifdef APP-PLUS
		uni.scanCode({
			success: (res)=> {
				var result=res.result
				var data=res.result.split(':')
				var type=data[0]
				var value=data[1]
				switch (type){
					case 'group':
					uni.navigateTo({
						url:'../../wx/groupInfo/scanCodeDetail?param='+result
					})
						break;
					case 'user':
					uni.navigateTo({
						url:'../../wx/personInfo/detail?param='+value+'&source=1'
					})
						break;
					default:
						break;
				}
			}
		});
		// #endif
		// #ifndef APP-PLUS
		uni.showToast({
			title:'扫一扫',
			icon:'none'
		})
		// #endif
	},
	// 设置原生titleNView导航文字
	setTitleNViewBtns(index,text){
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		// #ifdef APP-PLUS
		let currentWebview = page.$getAppWebview();
		let titleObj = currentWebview.getStyle().titleNView;
		if (!titleObj.buttons) {
			return;
		}
		titleObj.buttons[index].text = text;
		currentWebview.setStyle({
			titleNView: titleObj
		});
		// #endif
	},
	debounce(func, wait = 1000, immediate = true){
		/**
		 * @desc 函数防抖
		 * @param func 目标函数
		 * @param wait 延迟执行毫秒数
		 * @param immediate true - 立即执行， false - 延迟执行
		 */
		let timer;
		return function() {
			let args = arguments;
			if (timer) {
				console.log('拦截')
				clearTimeout(timer);
			}
			if (immediate) {
				let callNow = !timer;
				timer = setTimeout(() => {
					timer = null;
				}, wait);
				if (callNow){
					func.apply(this, args);
				}
			} else {
				timer = setTimeout(() => {
					func.apply(this, args);
				}, wait)
			}
		}
	},
	throttle (func, wait = 1000, type = 1) {
		/**
		 * @desc 函数节流
		 * @param func 函数
		 * @param wait 延迟执行毫秒数
		 * @param type 1 使用表时间戳，在时间段开始的时候触发 2 使用表定时器，在时间段结束的时候触发
		 */
		let previous = 0;
		let timeout;
		return function() {
			let context = this;
			let args = arguments;
			if (type === 1) {
				let now = Date.now();
	
				if (now - previous > wait) {
					func.apply(context, args);
					previous = now;
				}
			} else if (type === 2) {
				if (!timeout) {
					timeout = setTimeout(() => {
						timeout = null;
						func.apply(context, args)
					}, wait)
				}
			}
		}
	}
}
