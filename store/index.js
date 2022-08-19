import http from '@/common/request';
import publicFc from '@/common/publicFc';
// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
// #endif

// #ifdef VUE3
import { createStore } from 'vuex'
  const store = createStore({
// #endif
	state: {
		watermark:'仅供学习参考请勿用于商业！',
		userInfo:'',
		chatlist:[],
		chatDatalist:[],
		chatListNum:0,
		chatDataState:1,
		chatDataUserId:'',
		topicReply:{},
		topicRed:{},
		friendApply:{}
	},
	mutations: {
		update_UserInfo(state, data) {//个人信息
			state.userInfo = JSON.parse(data)
		},
		update_ChatList(state, data) {
			state.chatlist = data
		},
		update_chatDatalist(state, data) {
			state.chatDatalist = data
		},
		update_topicReply(state, data) {
			state.topicReply = data
			uni.setStorageSync('topicReply', JSON.stringify(data));
		},
		update_topicRed(state, data) {
			state.topicRed = data
			uni.setStorageSync('topicRed', JSON.stringify(data));
		},
		update_friendApply(state, data) {
			state.friendApply = data
			uni.setStorageSync('friendApply', JSON.stringify(data));
		}
	},
	actions: {
		updateChatDataState(context,data){
			context.state.chatDataState++
			context.state.chatDataUserId=data
		},
		tabBarpull(context){
			context.dispatch('get_UserInfo').then(res=>{
				context.dispatch('getChatList')
				// 朋友圈新消息
				var topicReply=publicFc.getKeyObjectStorage('topicReply')
				context.state.topicReply=topicReply
				// 新朋友圈
				var topicRed=publicFc.getKeyObjectStorage('topicRed')
				context.state.topicRed=topicRed
				// 新朋友
				var friendApply=publicFc.getKeyObjectStorage('friendApply')
				context.state.friendApply=friendApply
				var chatListNum=context.state.chatListNum ? context.state.chatListNum : 0
				var topicReplyCount=topicReply.count ? topicReply.count : 0
				var friendApplyCount=friendApply.count ? friendApply.count : 0
				var sumCount=chatListNum+topicReplyCount+friendApplyCount
				// #ifdef APP-PLUS
				plus.runtime.setBadgeNumber(sumCount);
				// #endif
			})
		},
		get_UserInfo (context) {
			return new Promise((resolve, reject) => {
				http.request({
					url: '/my/getInfo',
					success: (res) => {
						if (res.data.code == 200) {
							context.commit('update_UserInfo',JSON.stringify(res.data.data))
							resolve(res.data.data)
						}else{
							reject(res.data)
						}
					},
					fail: (error) => {
						reject(error)
					}
				});
			})
		},
		getchatDatalist(context) {//获取聊天数据列表
			var data=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatData')
			context.commit('update_chatDatalist',data)
		},
		updateChatById(context,data) {//更新聊天数据
			var getKey=data.userId
			var retdata=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatData')
			retdata[getKey]['list']=data.data
			uni.setStorageSync(context.state.userInfo.userId+'_'+'chatData', JSON.stringify(retdata));
		},
		updateChatObjById(context,data) {//更新聊天数据对象
			var getKey=data.userId
			var retdata=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatData')
			retdata[getKey]=data.data
			uni.setStorageSync(context.state.userInfo.userId+'_'+'chatData', JSON.stringify(retdata));
		},
		getChatList(context) {//获取聊天记录列表
			var data=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatlistData')
			var sum=0
			for(var key in data){
				sum+=data[key].num
			}
			context.state.chatListNum=sum
			context.commit('update_ChatList',data)
		},
		updateChatListInfoById(context,data) {//修改聊天记录
			var getKey=data.userId
			var retdata=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatlistData')
			retdata[getKey]=data.data
			uni.setStorageSync(context.state.userInfo.userId+'_'+'chatlistData', JSON.stringify(retdata));
		},
		createChatObj(context,data){
			var userId=data.userId
			var windowType=data.windowType
			//初始化聊天记录
			var data2=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatlistData')
			if(!data2[userId]){
				data2[userId]=new Object()
			}
			uni.setStorageSync(context.state.userInfo.userId+'_'+'chatlistData', JSON.stringify(data2));
			// 初始化聊天数据
			var data1=publicFc.getKeyObjectStorage(context.state.userInfo.userId+'_'+'chatData')
			return new Promise(function(resolve, reject) {
				if(!data1[userId]){
					console.log('初始化聊天')
					switch (windowType){
						case 'SINGLE':
						http.request({
							url: '/friend/info/'+userId,
							complete:(res)=>{
								if (res.data.code == 200) {
									var detail=res.data.data
									data1[userId]={
										fromInfo:{
											nickName: detail.nickName,
											portrait: detail.portrait,
											userId: detail.userId,
											userType:detail.userType
										},
										groupInfo:{},
										list:[]
									}
									uni.setStorageSync(context.state.userInfo.userId+'_'+'chatData', JSON.stringify(data1));
									// 创建记录
									var msgList = {
										userId: detail.userId,
										personId: context.state.userInfo.userId,
										nickName: detail.nickName,
										portrait: detail.portrait,
										content: '',
										time: publicFc.getNewDate('format',true),
										num: 0,
										windowType: 'SINGLE',
										disturb:'N',//是否静默消息
										top:'N',//是否置顶
										userType:'SINGLE'
									}
									context.dispatch('updateChatListInfoById', {
										userId: detail.userId,
										data: msgList
									});
									resolve({
										msg:'创建成功',
										data:data1[userId]
									})
								}else{
									reject({
										msg:'创建失败'
									});
								}
							}
						});
							break;
						case 'GROUP':
						http.request({
							url: '/group/getInfo/'+userId,
							complete:(res)=>{
								if (res.data.code == 200) {
									var detail=res.data.data
									var portraits=[]
									for (var i = 0; i < detail.user.length; i++) {
										portraits.push(detail.user[i].portrait)
									}
									data1[userId]={
										fromInfo:{},
										groupInfo:{
											nickName: detail.group.name,
											portrait: JSON.stringify(portraits),
											userId: detail.group.groupId,
										},
										list:[]
									}
									uni.setStorageSync(context.state.userInfo.userId+'_'+'chatData', JSON.stringify(data1));
									// 创建记录
									var msgList = {
										userId: detail.group.groupId,
										personId: context.state.userInfo.userId,
										nickName: detail.group.name,
										portrait: JSON.stringify(portraits),
										content: '',
										time: publicFc.getNewDate('format',true),
										num: 0,
										windowType: 'GROUP',
										disturb:'N',//是否静默消息
										top:'N',//是否置顶
										userType:'GROUP'
									}
									context.dispatch('updateChatListInfoById', {
										userId: detail.group.groupId,
										data: msgList
									});
									resolve({
										msg:'创建成功',
										data:data1[userId]
									})
								}else{
									reject({
										msg:'创建失败'
									});
								}
							}
						});
							break;
						default:
							break;
					}
				}else{
					resolve({
						msg:'已存在',
						data:data1[userId]
					})
				}
			});
		},
		createChat(context,data){
			
		}
	}
})
export default store