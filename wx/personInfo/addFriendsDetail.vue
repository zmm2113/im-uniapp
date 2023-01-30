<template>
	<view class="bgColor" v-if="userdetail">
		<watermark></watermark>
		<view class="person-wx">
			<view class="person-wx-user">
				<image class="person-wx-avatar" @click="$fc.previewImagesolo(userdetail.portrait)" :src="userdetail.portrait" mode="aspectFill"></image>
				<view class="person-wx-user-detail">
					<view class="person-wx-nikename">
						<text class="text">{{userdetail.nickName}}</text>
						<view class="wxfont person-wx-nikename-icon" :class="{'nv':userdetail.gender=='0'}" v-if="userdetail.gender=='0'"></view>
						<view class="wxfont person-wx-nikename-icon" :class="{'nan':userdetail.gender=='1'}" v-if="userdetail.gender=='1'"></view>
					</view>
					<text class="person-wx-name">
						微聊号：{{userdetail.chatNo}}
					</text>
					<text class="person-wx-name" v-if="userdetail.provinces">地区：{{userdetail.provinces}} {{userdetail.city}}</text>
				</view>
			</view>
		</view>
		<tool-list-wx :list="list2"></tool-list-wx>
		<tool-list-wx :list="list3" v-if="detail.applyStatus!=='0'&&type=='2'"></tool-list-wx>
		<tool-list-wx v-if="type=='2'&&detail.applyStatus=='0'&&userdetail.isFriend=='N'" :list="list4" type="btns" @itemClick="itemClicklist4"></tool-list-wx>
		<tool-list-wx v-if="type=='1'&&userdetail.isFriend=='N'" :list="list1" type="btns" @itemClick="itemClick"></tool-list-wx>
		<tool-list-wx v-if="userdetail.isFriend=='Y'" :list="list5" type="btns" @itemClick="itemClick5"></tool-list-wx>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const TUICalling = uni.requireNativePlugin("TUICallingUniPlugin-TUICallingModule");
	// #endif
	export default {
		data() {
			return {
				userdetail:'',
				type:'',
				detail:'',
				param:'',
				list1: [{
					title: '添加到通讯录',
					path: '#',
					icon: ''
				}],
				list3:[{
					title: '状态',
					path: '#',
					else: [{
						type: 'text',
						content: ''
					}],
					hideRight:true
				}],
				list2: [{
					title: '来源',
					path: '#',
					else: [{
						type: 'text',
						content: ''
					}],
					hideRight:true
				}],
				list4: [{
					title: '添加到通讯录',
					path: '#',
					icon: ''
				},{
					title: '拒绝',
					path: '#',
					icon: ''
				},{
					title: '忽略',
					path: '#',
					icon: ''
				}],
				list5:[{
					title: '发消息',
					path: '#',
					icon: 'faxiaoxi'
				},{
					title: '音视频通话',
					path: '#',
					icon: 'shipin'
				}]
			}
		},
		onLoad(e) {
			this.param=e.param
			this.type=e.type
			if(this.type=='2'){
				this.getApplyInfo(e.param)
			}
			if(this.type=='1'){
				this.getUser(e.param)
			}
		},
		methods: {
			getApplyInfo(e){//申请记录好友详情
				this.$http.request({
					url: '/apply/info/'+e,
					success: (res) => {
						if (res.data.code == 200) {
							this.detail=res.data.data
							this.list3[0].else[0].content=this.detail.applyStatusLabel
							this.list2[0].else[0].content=this.detail.applySourceLabel
							this.getUser(this.detail.chatNo)
						}
					}
				});
			},
			getUser(e){//搜索好友
				this.$http.request({
					url: '/friend/findFriend',
					method: 'POST',
					data:JSON.stringify({param:e}),
					success: (res) => {
						if (res.data.code == 200) {
							this.userdetail=res.data.data
							if(this.userdetail.sourceLabel){
								this.list2[0].else[0].content=this.userdetail.sourceLabel
							}
						}else{
							uni.navigateBack({
								delta:1
							})
						}
					}
				});
				
			},
			itemClick(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'../search-friends/add?userId='+this.userdetail.userId+'&source='+this.userdetail.source
					})
						break;
					default:
						break;
				}
			},
			itemClick5(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'../chatWindow/index?userId='+this.userdetail.userId+'&windowType=SINGLE'
					})
						break;
					case 1:
					uni.showActionSheet({
						itemList: ['视频通话','语音通话'],
						success: (res) => {
							switch (res.tapIndex){
								case 0:
								this.sendVideoCall()
									break;
								case 1:
								this.sendVoiceCall()
									break;
								default:
									break;
							}
						}
					});
						break;
					default:
						break;
				}
			},
			itemClicklist4(e,i){
				switch (i){
					case 0://同意
					this.$http.request({
						url: '/apply/agree',
						method: 'POST',
						data:JSON.stringify({applyId:this.param}),
						success: (res) => {
							if (res.data.code == 200) {
								uni.navigateBack({
									delta:1
								}).then(res=>{
									uni.showToast({
										title:'已同意',
										icon:'none'
									})
								})
							}
						}
					});
						break;
					case 1:
					this.$http.request({
						url: '/apply/refused',
						method: 'POST',
						data:JSON.stringify({applyId:this.param}),
						success: (res) => {
							if (res.data.code == 200) {
								uni.navigateBack({
									delta:1
								}).then(res=>{
									uni.showToast({
										title:'已拒绝',
										icon:'none'
									})
								})
							}
						}
					});
						break;
					case 2:
					this.$http.request({
						url: '/apply/ignore',
						method: 'POST',
						data:JSON.stringify({applyId:this.param}),
						success: (res) => {
							if (res.data.code == 200) {
								uni.navigateBack({
									delta:1
								}).then(res=>{
									uni.showToast({
										title:'已忽略',
										icon:'none'
									})
								})
							}
						}
					});
						break;
					default:
						break;
				}
			},
			sendVoiceCall(){
				//发起语音
				uni.showLoading({
					title:'发起语音通话'
				})
				var formdata={
					userId: this.userdetail.userId, 
					msgType: "TRTC_VOICE_START", 
					content: "TRTC_VOICE_START" 
				}
				this.$http.request({
					url: '/chat/sendMsg',
					method: 'POST',
					data: JSON.stringify(formdata),
					success: (res) => {
						if(res.data.code=='200'){
							if(res.data.data.status!=='0'){
								uni.showToast({
									title:res.data.data.statusLabel,
									icon:'none'
								})
								return
							}
							var userInfo=res.data.data.userInfo
							var data={
								userId:userInfo.userId,
								trtcId:userInfo.trtcId,
								nickName:userInfo.nickName,
								portrait:userInfo.portrait,
								startTime:new Date().getTime(),
								type:'audio'
							}
							uni.setStorage({
								key: 'call',
								data: JSON.stringify(data),
								success: function () {
									console.log('success');
									TUICalling.call({
									    userID: userInfo.trtcId,
									    type: 1
									})
								}
							});
							
						}
					}
				});
			},
			sendVideoCall(){
				//发起视频
				uni.showLoading({
					title:'发起视频通话'
				})
				var formdata={
					userId: this.userdetail.userId, 
					msgType: "TRTC_VIDEO_START", 
					content: "TRTC_VIDEO_START" 
				}
				this.$http.request({
					url: '/chat/sendMsg',
					method: 'POST',
					data: JSON.stringify(formdata),
					success: (res) => {
						if(res.data.code=='200'){
							if(res.data.data.status!=='0'){
								uni.showToast({
									title:res.data.data.statusLabel,
									icon:'none'
								})
								return
							}
							var userInfo=res.data.data.userInfo
							var data={
								userId:userInfo.userId,
								trtcId:userInfo.trtcId,
								nickName:userInfo.nickName,
								portrait:userInfo.portrait,
								startTime:new Date().getTime(),
								type:'video'
							}
							uni.setStorage({
								key: 'call',
								data: JSON.stringify(data),
								success: function () {
									console.log('success');
									TUICalling.call({
									    userID: userInfo.trtcId,
									    type: 2
									})
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	/* #ifdef APP-PLUS */
	.bgColor{
	    position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    background: #EDEDED;
		overflow: auto;
	  }
	/* #endif */
	/* #ifdef H5 */
	page{
		background: #EDEDED;
	}
	/* #endif */
	.person-wx {
		background-color: #fff;
		padding:44rpx 24rpx;
		padding-right: 24rpx;
		border-bottom: 1px #eee solid;
	}

	.person-wx-user {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.person-wx-avatar {
		width: 120rpx;
		min-width: 120rpx;
		height: 120rpx;
		margin-right: 42rpx;
		border-radius: 16rpx;
	}

	.person-wx-user-detail {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 540rpx;
	}

	.person-wx-nikename {
		font-size: 36rpx;
		font-weight: bold;
		display: flex;flex-direction: row;align-items: center;
	}
	.person-wx-nikename .text{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 480rpx;
	}
	.person-wx-name {
		color: #666;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.person-wx-fcode{
		width: 46rpx;
		height: 46rpx;
		margin-left: auto;
		margin-right: 40rpx;
	}
	.person-wx-right{
	}
	.person-wx-nikename-icon.nan{
		color: #007AFF;
	}
	.person-wx-nikename-icon.nv{
		color: #FF5A5F;
	}
	.person-wx-nikename-icon{
		margin-right: auto;
	}
</style>
