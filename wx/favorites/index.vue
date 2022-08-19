<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="favorites-wx">
			<view class="favorites-wx-top">
				<view class="favorites-wx-top-item" v-for="(v,i) in types" :key="i" @click="clickType(v)">{{v.label}}</view>
				<view class="favorites-wx-tips">点击预览，按住卡片向左滑动操作</view>
			</view>
			<uni-swipe-action>
				<uni-swipe-action-item class="favorites-uni-swipe-action-item" v-for="(v,i) in list" :key="i">
					<view class="favorites-wx-item">
						<view class="favorites-wx-content favorites-wx-content-text" v-if="v.collectType=='TEXT'">
							<view class="favorites-wx-text">
								{{v.content}}
							</view>
						</view>
						<view class="favorites-wx-content favorites-wx-content-img" v-if="v.collectType=='IMAGE'">
							<image :src="returnParse(v.content).url" @click="$fc.previewImagesolo(returnParse(v.content).url)" mode="aspectFill"></image>
						</view>
						<view class="favorites-wx-content favorites-wx-content-video" v-if="v.collectType=='VIDEO'">
							<view class="favorites-wx-content-video-img" @click="openVideo(returnParse(v.content).url)">
								<image :src="returnParse(v.content).img" mode="aspectFill"></image>
								<view class="favorites-wx-content-video-icon">
									<text class="wxfont bofang"></text>
								</view>
							</view>
						</view>
						<view class="favorites-wx-content favorites-wx-content-location" v-if="v.collectType=='LOCATION'">
							<view class="favorites-wx-content-location-box" @click="goMap({latitude:returnParse(v.content).latitude,longitude:returnParse(v.content).longitude})">
								<view class="favorites-wx-content-location-box-name">{{returnParse(v.content).name}}</view>
								<view class="favorites-wx-content-location-box-address">{{returnParse(v.content).address}}</view>	
								<image class="favorites-wx-content-location-box-map" src="../../static/wx/map.png" mode="aspectFit"></image>
							</view>
						</view>
						<view class="favorites-wx-content favorites-wx-content-voice" v-if="v.collectType=='VOICE'">
							<view class="favorites-wx-content-voice-box">
								<view class="favorites-wx-content-voice-content" @click="playVOICE(returnParse(v.content).url)">
									<text>{{returnParse(v.content).time}}</text>
									<text class="wxfont yuyin"></text>
								</view>
							</view>
						</view>
						<view class="favorites-wx-content" v-if="v.collectType=='CARD'">
							<view class="favorites-wx-content-card" @click="goAddfriend(returnParse(v.content))">
								<view class="favorites-wx-content-card-top">
									<image class="favorites-wx-content-card-top-img" :src="returnParse(v.content).avatar"></image>
									<view class="favorites-wx-content-card-top-content">
										<view class="favorites-wx-content-card-title">{{returnParse(v.content).name}}</view>
										<view class="favorites-wx-content-card-no">{{returnParse(v.content).chatNo}}</view>
									</view>
								</view>
								<view class="favorites-wx-content-card-card">名片</view>
							</view>
						</view>
						<view class="favorites-wx-bottom">
							<text>{{userinfo.nickName}}</text>
							<text>{{userinfo.createTime}}</text>
						</view>
					</view>
					<template v-slot:right>
						<view class="favorites-wx-action-item">
							<view class="favorites-wx-action-item-btn favorites-wx-delete" @click="favoritesDeleta(v,i)">删除</view>
							<view v-if="type=='2'" class="favorites-wx-action-item-btn favorites-wx-view" @click="clickitem(v,i)">发送</view>
						</view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<uni-load-more v-show="list.length>0" :status="queryParams.status"></uni-load-more>
		</view>
	</view>
</template>

<script>
export default {
	emits:['clickitem'],
	data() {
		return {
			queryParams: {
				refreshing: false,
				status: 'more',
				pageNum: 1,
				pageSize: 10
			},
			list:[],
			innerAudioContext:'',
			paused:false,
			types:[{
				label:'全部',
				value:''
			},{
				label:'文字',
				value:'TEXT'
			},{
				label:'图片',
				value:'IMAGE'
			},{
				label:'视频',
				value:'VIDEO'
			},{
				label:'位置',
				value:'LOCATION'
			},{
				label:'语音',
				value:'VOICE'
			},{
				label:'名片',
				value:'CARD'
			}]
		};
	},
	props:{
		type:{
			type:String,
			default:'1'//1列表 2聊天窗口
		}
	},
	mounted() {
		this.queryParams.refreshing=true
		this.getList('')
	},
	computed:{
		userinfo() {
			return this.$store.state.userInfo;
		}
	},
	methods: {
		clickitem(e,i){
			this.$emit('clickitem',e,i)
		},
		favoritesDeleta(e,i){
			uni.showModal({
				title: '警告',
				content: '是否确认删除收藏',
				success: (res)=> {
					if (res.confirm) {
						this.$http.request({
							url: '/collect/remove/'+e.collectId,
							success: (res) => {
								if (res.data.code == 200) {
									this.list.splice(i,1)
								}
							}
						});
					} else if (res.cancel) {
						
					}
				}
			});
		},
		goAddfriend(e){
			uni.navigateTo({
				url:'../personInfo/detail?param='+e.userId+'&source=2'
			})
		},
		returnParse(txt) {
			return JSON.parse(txt);
		},
		getList(e){
			uni.showLoading();
			this.queryParams.status='loading'
			this.$fc.loadMore({
				url: '/collect/list?collectType='+e,
				queryParams: this.queryParams
			}).then(res => {
				this.queryParams = res.queryParams;
				if (res.status=='3') {
					this.list=[]
					return
				}
				if (res.status=='0') {
					return
				}
				var rows = res.list;
				var list = [];
				for (var i = 0; i < rows.length; i++) {
					var item = rows[i];
					list.push(item);
				}
				if (res.status=='2') {
					this.list = list;
				}
				if (res.status=='1') {
					this.list = this.list.concat(list);
				}
			});
		},
		playVOICE(url){
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
		openVideo(url){
			this.$fc.plusDownload({onlinePath:url}).then(res=>{
				this.$fc.plusOpenFile({filePath:res})
			})
		},
		clickType(e){
			this.queryParams.refreshing=true
			this.getList(e.value)
		}
	},
	onPullDownRefresh() {
		this.queryParams.refreshing=true
		this.getList('');
	},
	onReachBottom() {
		this.getList('');
	},
	onNavigationBarButtonTap(e) {
		switch (e.index) {
			case 0:
			uni.showToast({
				title:'添加',
				icon:'none'
			})
				break;
			default:
				break;
		}
	},
};
</script>

<style scoped lang="scss">
	.bgColor{
	    background: #EDEDED;
	 }
	.favorites-wx{
		display: flex;
		flex-direction: column;
	}
	.favorites-wx-item{
		flex: 1;
		display: flex;flex-direction: column;
		margin:0 24rpx;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 38rpx;
	}
	.favorites-wx-content{
		display: flex;flex-direction: row;
	}
	.favorites-wx-bottom{
		display: flex;flex-direction: row;align-items: center;
		margin-top: 12rpx;
	}
	.favorites-wx-bottom text{
		margin-right: 24rpx;
		font-size: 24rpx;
		color: #999;
	}
	.favorites-wx-top{
		margin: 24rpx;
		padding: 24rpx;
		display: flex;flex-direction: row;flex-wrap: wrap;
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
	}
	.favorites-wx-top-item{
		color: #5F698C;
		width: 33.333%;
		box-sizing: border-box;
		padding: 0 24rpx;
		margin: 24rpx 0;
		text-align: center;
		overflow: hidden;
	}
	.favorites-wx-top-item:nth-child(3n-1){
		border-left: 1px #ddd solid;
		border-right: 1px #ddd solid;
	}
	.favorites-wx-content-text{}
	.favorites-wx-text{
		color: #333;
		font-size: 32rpx;
	}
	.favorites-wx-content-img image{
		width: 160rpx;
		height: 160rpx;
	}
	 
	
	.favorites-wx-content-video{
		
	}
	.favorites-wx-content-video-img,.favorites-wx-content-video-img image{
		width: 160rpx;
		height: 160rpx;
		position: relative;
	}
	.favorites-wx-content-video-icon{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		display: flex;flex-direction: row;justify-content: center;align-items: center;
	}
	.favorites-wx-content-video-icon text{
		font-size: 64rpx;
		color: #dddddd;
		text-shadow: 0px 0px 5px rgba(0,0,0,0.3);
	}
	.favorites-wx-content-location{
	}
	.favorites-wx-content-location-box {
		border: 1px #f6f6f6 solid;
		display: flex;
		flex-direction: column;
		width: 100%;
		border-radius: 12rpx;
		padding: 24rpx;
	}
	.favorites-wx-content-location-box-name {
		font-size: 28rpx;
		color: #101010;
		font-weight: bold;
	}
	.favorites-wx-content-location-box-address {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 12rpx;
	}
	.favorites-wx-content-location-box-map {
		background-color: #e5ffff;
		overflow: hidden;
		width: 100%;
		height: 150rpx;
	}
	.favorites-wx-content-voice-box{
		display: flex;flex-direction: row;align-items: center;flex-wrap: wrap;
	}
	.favorites-wx-content-voice{}
	.favorites-wx-content-voice-vmove{
		animation: scalevVoice 1s linear infinite;
		transform: scale(1);
	}
	@keyframes scalevVoice {
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
	.favorites-wx-content-voice-tras{
		display: flex;flex-direction: row;align-items: center;
	}
	.favorites-wx-content-voice-tras text{
		padding:6rpx 12rpx;
		font-size: 24rpx;
		background-color: #eee;
		border-radius: 12rpx;
		color: #bcbcbc;
		margin:0 12rpx;
	}
	.favorites-wx-content-voice-content{
		padding:12rpx 24rpx;
		border-radius: 12rpx;
		background-color: #4cd964;
		display: flex;flex-direction: row;align-items: center;
	}
	.favorites-wx-content-voice-text{
		width: 100%;
		font-size: 26rpx;
		color: #666;
		word-break: break-all;
	}
	.favorites-wx-content-card{
		width: 100%;
		box-sizing: border-box;
		border: 1px #f6f6f6 solid;
		padding: 24rpx;
		border-radius: 12rpx;
	}
	.favorites-wx-content-card-top{
		display: flex;flex-direction: row;align-items: center;
	}
	.favorites-wx-content-card-top-img{
		width: 80rpx;
		min-width: 80rpx;
		height: 80rpx;
		margin-right: 24rpx;
		border-radius: 6rpx;
	}
	.favorites-wx-content-card-top-content{
		overflow: hidden;
		display: flex;flex-direction: column;
	}
	.favorites-wx-content-card-title{
		color: #070707;
		font-size: 32rpx;
	}
	.favorites-wx-content-card-no{
		font-size: 24rpx;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.favorites-wx-content-card-card{
		font-size: 24rpx;
		color: #666;
		margin-top: 24rpx;
	}
	.favorites-wx-view{
		background-color: #00aaff;
	}
	.favorites-wx-delete{
		background-color: #F55C23;
	}
	.favorites-wx-action-item-btn{
		color: #fff;
		padding:0 24rpx;
		flex: 1;
		display: flex;flex-direction: row;justify-content: center;align-items: center;
	}
	.favorites-wx-action-item{
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
	.favorites-uni-swipe-action-item{
		margin-bottom: 24rpx;
	}
	.favorites-uni-swipe-action-item:nth-last-child(1){
		margin-bottom: 0;
	}
	.favorites-wx-tips{
		width: 100%;
		color: #999;
		font-size: 24rpx;
		text-align: center;
	}
</style>
