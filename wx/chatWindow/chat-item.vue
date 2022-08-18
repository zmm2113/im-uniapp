<template>
	<!-- #ifdef APP-NVUE -->
	<cell>
		<!-- #endif -->
		<view class="zfb-tk-item" :class="[{ 'zfb-tk-msgleft': item.type == 1 }, { 'zfb-tk-msgright': item.type == 2 }, { 'zfb-tk-msgcenter': item.type == 3 }]">
			<openTool :class="[{ 'openTool-msgleft': item.type == 1 }, { 'openTool-msgright': item.type == 2 }]" :talkTo="talkTo" :ref="'toolx'+itemKey" :data="item" :itemKey="itemKey"></openTool>
			<image class="zfb-tk-avatar" @click="gochatOne(item)" v-if="item.type !== 3" :src="item.portrait" mode="aspectFill"></image>
			<view class="zfb-tk-item-contentx" @longpress="longpressItem($event,itemKey,item)">
				<view class="zfb-tk-item-contentx-c">
					<view class="zfb-tk-time-notsend wxfont fssb" @click="tryagin(item, itemKey)" v-if="item.sendtype && item.sendtype == 'error'"></view>
					<view class="zfb-tk-item-contentx-c-tool">
						<view class="zfb-tk-item-c" v-if="item.msgType == 'TEXT'">
							<text>{{ item.content }}</text>
						</view>
						<view class="zfb-tk-item-c" v-if="item.msgType == 'ALERT'">
							<text>{{ item.content }}</text>
						</view>
						<view class="zfb-tk-item-c-LOCATION" v-if="item.msgType == 'LOCATION'" @click="goMap(returnParse(item.content))">	
							<view class="zfb-tk-item-c-LOCATION-name">{{ returnParse(item.content).name }}</view>
							<view class="zfb-tk-item-c-LOCATION-address">{{ returnParse(item.content).address }}</view>	
							<image class="zfb-tk-item-c-LOCATION-map" src="../../static/wx/map.png" mode="aspectFit"></image>
						</view>
						<image class="zfb-tk-item-c-img" v-if="item.msgType == 'IMAGE'" :src="returnParse(item.content).url" mode="aspectFill" @click="$fc.previewImagesolo(returnParse(item.content).url)"></image>
						<view v-if="item.msgType == 'VOICE'" class="zfb-tk-item-c-VOICE">
							<view class="zfb-tk-item-c-VOICE-msg">
								<view class="zfb-tk-item-c-VOICE-tras" @click="showTrs=!showTrs">
									<text>转文字</text>
									<!-- <view class="zfb-tk-item-c-VOICE-tras-icon"></view> -->
								</view>
								<view class="zfb-tk-item-c" @click="playVOICE(returnParse(item.content).url)">
									<text>{{returnParse(item.content).time}}</text>
									<text class="wxfont yuyin" :class="{vmove:paused}"></text>
								</view>
							</view>
						</view>
						<view v-if="item.msgType == 'TRTC_VOICE_END'" class="zfb-tk-item-c-TRTC_VOICE_END" @click="sendVoiceCall">
							<view class="zfb-tk-TRTC zfb-tk-item-c">
								<view class="wxfont yuyin3"></view>
								<text>语音通话 时长{{item.content}}</text>
							</view>
						</view> 
						<view v-if="item.msgType == 'TRTC_VIDEO_END'" class="zfb-tk-item-c-TRTC_VIDEO_END" @click="sendVideoCall">
							<view class="zfb-tk-TRTC zfb-tk-item-c">
								<view class="wxfont shipin"></view>
								<text>视频通话 时长{{item.content}}</text>
							</view>
						</view>
						<view class="zfb-tk-item-c-video" v-if="item.msgType == 'VIDEO'" @click="openVideo(returnParse(item.content).videoUrl)">
							<image class="zfb-tk-item-c-img" :src="returnParse(item.content).url" mode="aspectFill"></image>
							<view class="zfb-tk-item-c-video-icon">
								<text class="wxfont bofang"></text>
							</view>
						</view>
						<view class="zfb-tk-item-c-CARD" v-if="item.msgType == 'CARD'" @click="goAddfriend(returnParse(item.content))">
							<view class="zfb-tk-item-c-CARD-top">
								<image class="zfb-tk-item-c-CARD-top-img" :src="returnParse(item.content).avatar" mode=""></image>
								<view class="zfb-tk-item-c-CARD-top-content">
									<view class="zfb-tk-item-c-CARD-title">{{returnParse(item.content).name}}</view>
									<view class="zfb-tk-item-c-CARD-no">{{returnParse(item.content).chatNo}}</view>
								</view>
							</view>
							<view class="zfb-tk-item-c-CARD-card">推荐名片</view>
						</view>
						<view v-if="showTrs" class="zfb-tk-item-c-VOICE-tras-text">{{returnParse(item.content).text}}</view>
						<view class="zfb-tk-time" v-if="item.time">{{ timeDetia(item.time) }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-NVUE -->
	</cell>
	<!-- #endif -->
</template>

<script>
// #ifdef APP-PLUS
const TUICalling = uni.requireNativePlugin("TUICallingUniPlugin-TUICallingModule");
// #endif
import openTool from './openTool.vue'
export default {
	emits: ['tryagin','longpressItem'],
	name: 'chat-item',
	components:{
		openTool
	},
	props: {
		item: {
			type: Object,
			default: {}
		},
		talkTo: {
			type: Object,
			default: {}
		},
		itemKey: {
			type: Number
		},
		longTapItemKey: {
			type: [Number,String],
			default:''
		}
	},
	watch:{
		longTapItemKey(v){
			if(this.itemKey==v){
				this.$refs['toolx'+v].showTab();
			}
		}
	},
	data() {
		return {
			innerAudioContext:'',
			paused:false,
			showTrs:false,
		};
	},
	methods: {
		sendVoiceCall(){
			//发起语音
			uni.showLoading({
				title:'发起语音通话'
			})
			var formdata={
				userId: this.talkTo.userId, 
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
				userId: this.talkTo.userId, 
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
		},
		goAddfriend(e){
			uni.navigateTo({
				url:'../personInfo/detail?param='+e.userId+'&source=2'
			})
		},
		openVideo(e){
			this.$fc.plusDownload({onlinePath:e}).then(res=>{
				this.$fc.plusOpenFile({filePath:res})
			})
		},
		playVOICE(url){
			this.showTrs=false
			if(this.paused){
				this.innerAudioContext.destroy()
				this.paused=!this.paused
				return
			}
			this.innerAudioContext = uni.createInnerAudioContext();
			// var url='https://www.w3school.com.cn/i/horse.ogg'
			this.innerAudioContext.sessionCategory='soloAmbient'
			this.innerAudioContext.src = url;
			this.innerAudioContext.play()
			
			this.innerAudioContext.onPlay(() => {
				// console.log('播放')
				this.paused=true
			})
			this.innerAudioContext.onPause(() => {
				// console.log('暂停')
				this.paused=false
				this.innerAudioContext.destroy()
			})
		},
		goMap(e) {
			uni.openLocation({
				latitude: e.latitude,
				longitude: e.longitude,
				success: function() {}
			});
		},
		returnParse(txt) {
			return JSON.parse(txt);
		},
		tryagin(e, i) {
			this.$emit('tryagin', e, i);
		},
		gochatOne(e) {
			var source=e.windowType=="GROUP" ? '7' : '3'
			uni.navigateTo({
				url:'../personInfo/detail?param='+e.personId+'&source='+source
			})
		},
		longpressItem(e,i,v) {//长按回调
			console.log(e)
			this.$emit('longpressItem',e,i,v)
			if(this.itemKey==this.longTapItemKey){
				this.$refs['toolx'+this.itemKey].showTab();
			}
		},
		timeDetia: function(date) {
			var time;
			var d = new Date(date);
			var n = new Date();
			//获取时间戳
			var dd = d.getTime();
			var h = d.getHours();
			var m = d.getMinutes();
			var Y = d.getFullYear();
			var M = d.getMonth() + 1;
			var D = d.getDate();
			//现在时间
			var nn = n.getTime();
			var hh = n.getHours();
			var mm = n.getMinutes();
			var YY = n.getFullYear();
			var MM = n.getMonth() + 1;
			var DD = n.getDate();

			if (D == DD && M == MM && Y == YY) {
				if (h < 10) {
					h = '0' + h;
				}
				if (m < 10) {
					m = '0' + m;
				}
				time = h + ':' + m;
				return time;
			} else if (D + 1 == DD && M == MM && Y == YY) {
				if (h < 10) {
					h = '0' + h;
				}
				if (m < 10) {
					m = '0' + m;
				}
				time = '昨天' + ' ' + h + ':' + m;
				return time;
			} else {
				if (M < 10) {
					M = '0' + M;
				}
				if (D < 10) {
					D = '0' + D;
				}
				if (h < 10) {
					h = '0' + h;
				}
				if (m < 10) {
					m = '0' + m;
				}
				time = Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m;
				return time;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
$avatarsize: 80rpx;
$border-radius: 12rpx;
$textcolor: #fff;
$descolor: #999;
$leftbgcolor: #00aaff;
$rightbgcolor: #4cd964;

.zfb-tk-item {
	position: relative;
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	margin: 5px 0;
}

.zfb-tk-item .zfb-tk-item-c text {
	word-break: break-all;
}

.zfb-tk-msgleft,
.zfb-tk-msgright {
	text-align: left;
}

.zfb-tk-msgleft {
	float: left;
	display: flex;
	flex-direction: row;
}

.zfb-tk-item .zfb-tk-item-c::after {
	position: absolute;
	content: '';
	width: 14rpx;
	height: 14rpx;
	top: 34rpx;
	transform: rotate(45deg);
}

.zfb-tk-msgleft .zfb-tk-item-c::after {
	background: $leftbgcolor;
	left: -7rpx;
}

.zfb-tk-msgright .zfb-tk-item-c::after {
	background: $rightbgcolor;
	right: -7rpx;
}

.zfb-tk-avatar {
	min-width: $avatarsize;
	width: $avatarsize;
	height: $avatarsize;
	border-radius: $border-radius;
}

.zfb-tk-msgleft .zfb-tk-avatar {
	margin-right: 12rpx;
}

.zfb-tk-msgright .zfb-tk-avatar {
	margin-left: 12rpx;
}

.zfb-tk-msgright {
	float: right;
	display: flex;
	flex-direction: row-reverse;
}

.zfb-tk-msgcenter {
	font-size: 28rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	float: left;
	width: 100%;
	color: $descolor;
}

.zfb-tk-item-c {
	box-sizing: border-box;
	position: relative;
	display: inline-block;
	border-radius: $border-radius;
}

.zfb-tk-msgleft .zfb-tk-item-c,
.zfb-tk-msgright .zfb-tk-item-c {
	min-height: $avatarsize;
	background: $leftbgcolor;
	color: $textcolor;
	padding: 10px;
}

.zfb-tk-msgright .zfb-tk-item-c {
	background: $rightbgcolor;
}

.zfb-tk-username {
	color: $descolor;
}

.zfb-tk-time {
	font-size: 24rpx;
	text-align: center;
	color: $descolor;
	width: 100%;
	box-sizing: border-box;
}

.zfb-tk-msgright .zfb-tk-time {
	text-align: right;
}

.zfb-tk-msgleft .zfb-tk-time {
	text-align: left;
}
.zfb-tk-time-notsend {
	font-size: 64rpx;
	color: #fa5151;
	margin-top: 8rpx;
}
.zfb-tk-item-c-LOCATION {
	border: 1px #f6f6f6 solid;
	display: flex;
	flex-direction: column;
	width: 445rpx;
	border-radius: 12rpx;
	padding: 24rpx;
}
.zfb-tk-item-c-LOCATION-name {
	font-size: 28rpx;
	color: #101010;
	font-weight: bold;
}
.zfb-tk-item-c-LOCATION-address {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
}
.zfb-tk-item-c-LOCATION-map {
	background-color: #e5ffff;
	overflow: hidden;
	width: 445rpx;
	height: 150rpx;
}
.zfb-tk-item-c-img{
	border: 1px #eee solid;
	max-width: 310rpx;
	max-height: 450rpx;
}
.zfb-tk-item-c-video{
	position: relative;
}
.zfb-tk-item-c-video-icon{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	display: flex;flex-direction: row;justify-content: center;align-items: center;
}
.zfb-tk-item-c-video-icon text{
	font-size: 64rpx;
	color: #dddddd;
	text-shadow: 0px 0px 5px rgba(0,0,0,0.3);
}

.zfb-tk-item-c-VOICE{}
.vmove{
	animation: scalev 1s linear infinite;
	transform: scale(1);
}
@keyframes scalev {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.3);
	}
	100% {
		transform: scale(1);
	}
}
.zfb-tk-item-c-VOICE-tras{
	display: flex;flex-direction: row;align-items: center;
}
.zfb-tk-item-c-VOICE-tras text{
	padding:6rpx 12rpx;
	font-size: 24rpx;
	background-color: #eee;
	border-radius: 12rpx;
	color: #bcbcbc;
	margin:0 12rpx;
}
.zfb-tk-item-c-VOICE-tras-icon{
	margin: 6rpx;
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background-color: #fa5151;
	position: relative;
}
.zfb-tk-item-c-VOICE-tras-text{
	width: 100%;
	font-size: 26rpx;
	color: #666;
	word-break: break-all;
	margin-bottom: 12rpx;
}
.zfb-tk-msgright .zfb-tk-item-c-VOICE-tras-text{
	text-align: right;
}
.zfb-tk-msgleft .zfb-tk-item-c-VOICE-tras-text{
	text-align: left;
}
.zfb-tk-msgleft .zfb-tk-item-c-VOICE-msg{
	flex-direction: row-reverse;
}
.zfb-tk-msgleft .zfb-tk-item-c-VOICE-tras{
	flex-direction: row-reverse;
}
.zfb-tk-item-c-VOICE-msg .zfb-tk-item-c{
	display: flex;flex-direction: row;align-items: center;
}
.zfb-tk-item-c-VOICE-msg{
	display: flex;flex-direction: row;align-items: center;
}
.zfb-tk-item-c-CARD{
	width: 440rpx;
	box-sizing: border-box;
	border: 1px #f6f6f6 solid;
	padding: 24rpx;
	border-radius: 12rpx;
}
.zfb-tk-item-c-CARD-top{
	display: flex;flex-direction: row;align-items: center;
}
.zfb-tk-item-c-CARD-top-img{
	width: 80rpx;
	min-width: 80rpx;
	height: 80rpx;
	margin-right: 24rpx;
	border-radius: 6rpx;
}
.zfb-tk-item-c-CARD-top-content{
	overflow: hidden;
	display: flex;flex-direction: column;
}
.zfb-tk-item-c-CARD-title{
	color: #070707;
	font-size: 32rpx;
}
.zfb-tk-item-c-CARD-no{
	font-size: 24rpx;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.zfb-tk-item-c-CARD-card{
	font-size: 24rpx;
	color: #666;
	margin-top: 24rpx;
}

.zfb-tk-item-contentx{
	position: relative;
	display: flex;
	flex-direction: column;
	max-width: 544rpx;
}
.zfb-tk-item-contentx-name{
	color: #7C7C7E;
	font-size: 24rpx;
}
.zfb-tk-msgright .zfb-tk-item-contentx{
	align-items: flex-end;
}
.zfb-tk-msgleft .zfb-tk-item-contentx{
	align-items: flex-start;
}
.zfb-tk-item-contentx-c{
	display: flex;
	align-items: center;
	
}
.zfb-tk-msgleft .zfb-tk-item-contentx-c{
	flex-direction: row-reverse;
}
.zfb-tk-msgright .zfb-tk-item-contentx-c{
	flex-direction: row;
}
.zfb-tk-TRTC{
	align-items: center;
	display: flex;flex-direction: row;
}
.zfb-tk-TRTC .wxfont{
	font-size: 42rpx;
}
.zfb-tk-item-contentx-c-tool{display: flex;flex-direction: column;}
.zfb-tk-msgleft .zfb-tk-item-contentx-c-tool{
	align-items: flex-start;
}
.zfb-tk-msgright .zfb-tk-item-contentx-c-tool{
	align-items: flex-end;
}
</style>
