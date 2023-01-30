<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="person-wx" v-if="detail">
			<view class="person-wx-user">
				<image class="person-wx-avatar" @click="$fc.previewImagesolo(detail.portrait)" :src="detail.portrait" mode="aspectFill"></image>
				<view class="person-wx-user-detail">
					<view class="person-wx-nikename">
						<text class="text">{{detail.nickName}}</text>
						<view class="wxfont person-wx-nikename-icon" :class="{'nv':detail.gender=='0'}" v-if="detail.gender=='0'"></view>
						<view class="wxfont person-wx-nikename-icon" :class="{'nan':detail.gender=='1'}" v-if="detail.gender=='1'"></view>
					</view>
					<text class="person-wx-name">
						微聊号：{{detail.chatNo}}
					</text>
					<text class="person-wx-name" v-if="detail.provinces">地区：{{detail.provinces}} {{detail.city}}</text>
				</view>
			</view>
		</view>
		<tool-list-wx :list="list2" @itemClick="itemClick2"></tool-list-wx>
		<tool-list-wx :list="list3" v-if="detail.isFriend=='Y'" type="btns" @itemClick="itemClick"></tool-list-wx>
		<tool-list-wx :list="list4" v-if="detail.isFriend=='N'" type="btns" @itemClick="itemClick4"></tool-list-wx>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const TUICalling = uni.requireNativePlugin("TUICallingUniPlugin-TUICallingModule");
	// #endif
	export default {
		data() {
			return {
				type:'',
				detail:'',
				param:'',
				list2: [{
					title: '来源',
					path: '#',
					else: [{
						type: 'text',
						content: ''
					}],
					hideRight:true
				},{
					title: '朋友圈',
					path: '#'
				}],
				list3: [{
					title: '发消息',
					path: '#',
					icon: 'faxiaoxi'
				},{
					title: '音视频通话',
					path: '#',
					icon: 'shipin'
				}],
				list4: [{
					title: '添加到通讯录',
					path: '#'
				}],
				source:'',
				showtitleNViewBtns:false
			}
		},
		onLoad(e) {
			this.param=e.param
			this.source=e.source
		},
		onShow(){
			this.getUserInfo(this.param)
		},
		mounted() {
			this.$fc.setTitleNViewBtns(0,'')
		},
		methods: {
			getUserInfo(e){//好友详情
				this.$http.request({
					url: '/friend/info/'+e,
					success: (res) => {
						if (res.data.code == 200) {
							this.detail=res.data.data
							if(this.detail.userType!=='normal'||this.detail.isFriend=='N'){
								this.showtitleNViewBtns=false
								this.list3.splice(1,1)
								this.list2.splice(1,1)
							}else{
								this.showtitleNViewBtns=true
								this.$fc.setTitleNViewBtns(0,'\ue623')
							}
							if(this.detail.userType=='self'){
								this.list2.push({
									title: '朋友圈',
									path: '#'
								})
							}
							if(this.detail.sourceLabel){
								if(!this.source){
									this.source=this.detail.source
								}
								this.list2[0].else[0].content=this.detail.sourceLabel
							} else if(this.source){
								var text=''
								switch (this.source){
									case '1':
									text='扫一扫'
										break;
									case '2':
									text='名片'
										break;
									case '3':
									text='微聊号'
										break;
									case '4':
									text='手机号'
										break;
									case '5':
									text='摇一摇'
										break;
									case '6':
									text='系统'
										break;
									case '7':
									text='群聊'
										break;
									case '8':
									text='附近的人'
										break;
									default:
										break;
								}
								this.list2[0].else[0].content=text
							}else{
								this.list2[0].else[0].content='无'
							}
						}
					}
				});
			},
			itemClick2(e,i){
				switch (i){
					case 1:
					uni.navigateTo({
						url:'../../wx/friendsCircle/person?userId='+this.detail.userId
					})
						break;
					default:
						break;
				}
			},
			itemClick4(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'../search-friends/add?userId='+this.detail.userId+'&source='+this.source
					})
						break;
					default:
						break;
				}
			},
			itemClick(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'../chatWindow/index?userId='+this.detail.userId+'&windowType=SINGLE'
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
			sendVoiceCall(){
				//发起语音
				uni.showLoading({
					title:'发起语音通话'
				})
				var formdata={
					userId: this.detail.userId, 
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
					userId: this.detail.userId, 
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
		},
		onNavigationBarButtonTap(e) {
			if(!this.showtitleNViewBtns){
				return
			}
			switch (e.index) {
				case 0:
				uni.navigateTo({
					url:'edit?data='+ encodeURIComponent(JSON.stringify(this.detail))
				})
					break;
				default:
					break;
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
