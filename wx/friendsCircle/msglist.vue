<template>
	<view class="wxnearby">
		<watermark></watermark>
		<view class="wxnearby-item" v-for="(v,i) in list" :key="i" @click="godetail(v)">
			<view class="person-wx-user">
				<image class="person-wx-avatar" :src="v.portrait" mode="aspectFill"></image>
				<view class="wxnearby-item-content">
					<view class="person-wx-user-detail">
						<view class="person-wx-nikename">
							<text class="text">{{v.nickName}}</text>
						</view>
						<view class="person-wx-textx">{{v.replyContent}}</view>
						<text class="person-wx-name">
							{{v.replyTime}}
						</text>
					</view>
					<view class="wxmsglist-right">
						<view class="ctext" v-if="v.topicType=='TEXT'">
							<text>{{returnParse(v.topicContent).content}}</text>
						</view>
						<image v-if="v.topicType=='IMAGE'" class="wxmsglist-right-cimg" :src="returnParse(v.topicContent).files[0].url" mode="aspectFill"></image>
						<view class="friendsCircle-content-video" v-if="v.topicType=='VIDEO'">
							<image class="friendsCircle-content-video-icon" src="../../static/img/bf.png" mode="aspectFill"></image>
							<image class="friendsCircle-content-video-img" :src="returnParse(v.topicContent).files[0].url" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		onLoad () {
		},
		onShow() {
			this.getlist()
		},
		onUnload() {},
		methods:{
			returnParse(txt) {
				return JSON.parse(txt);
			},
			openVideo(e){
				this.$fc.plusDownload({onlinePath:e}).then(res=>{
					this.$fc.plusOpenFile({filePath:res})
				})
			},
			getlist(){
				this.$http.request({
					url: '/topic/noticeList',
					success: (res) => {
						if (res.data.code == 200) {
							this.list=res.data.data
							this.$store.commit('update_topicReply',{})
							uni.removeStorageSync('topicReply');
						}
					}
				});
			},
			godetail(e){
				uni.navigateTo({
					url:'./detail?topicId='+ e.topicId
				})
			}
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
				uni.showActionSheet({
					itemList: ['清除消息列表'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
							this.$http.request({
								url: '/topic/clearNotice',
								success: (res) => {
									if (res.data.code == 200) {
										uni.navigateBack({
											delta:1
										}).then(res=>{
											uni.showToast({
												title:'清除成功',
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
					}
				});
					break;
				default:
					break;
			}
		}
	}
</script>

<style scoped>
	.person-wx-user {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex: 1;
		width: 100%;
	}
	.wxnearby{
	}
	.wxnearby-item{
		padding:0 24rpx;
		width: 100%;
		box-sizing: border-box;
	}
	.person-wx-avatar {
		width: 90rpx;
		min-width: 90rpx;
		height: 90rpx;
		margin-right: 42rpx;
		border-radius: 16rpx;
	}
	.wxnearby-item-content{
		flex: 1;
		display: flex;flex-direction: row;align-items: center;
		padding:24rpx 0;
		border-bottom: 1px #eee solid;
	}
	.person-wx-user-detail {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 400rpx;
	}
	
	.person-wx-nikename {
		font-size: 28rpx;
		color: #5F698C;
		display: flex;flex-direction: row;align-items: center;
	}
	.person-wx-nikename .text{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 480rpx;
	}
	.person-wx-name {
		color: #B2B2B2;
		font-size: 24rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.person-wx-textx{
		padding: 4rpx;
		font-size: 28rpx;
		color: #333;
		word-break: break-all;
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
	.wxmsglist-right{
		margin-left: auto;
	}
	.wxmsglist-right .ctext{
		max-width: 240rpx;
		padding: 12rpx;
		font-size: 24rpx;
		background-color: #F2F2F2;
	}
	.wxmsglist-right .ctext text{
		margin-left: auto;
		color: #666;
		border-radius: 6rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.wxmsglist-right-cimg{
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
	}
	.friendsCircle-content-video{
		width: 120rpx;
		height: 120rpx;
		position: relative;
	}
	.friendsCircle-content-video-img{
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}
	.friendsCircle-content-video-icon{
		z-index: 1;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 80rpx !important;
		height: 80rpx !important;
		transform: translate(-50%,-50%);
	}
</style>
