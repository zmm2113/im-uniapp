<template>
	<view @touchmove.stop.prevent="moveHandle('touchmove')" @click="moveHandle('click')" v-if="show">
		<view class="top-right-tool-wx" :animation="animationData" :style="{ top: height + 'px' }">
			<view class="top-right-tool-wx-icon"></view>
			<view class="top-right-tool-wx-list">
				<view class="top-right-tool-wx-list-item" @click="groupChat">
					<view class="top-right-tool-wx-list-item-icon"><view class="wxfont xiaoxi"></view></view>
					<view class="text">发起群聊</view>
				</view>
				<view class="top-right-tool-wx-list-item" @click="goSearchFriends">
					<view class="top-right-tool-wx-list-item-icon"><view class="wxfont jiahaoyou"></view></view>
					<view class="text">添加朋友</view>
				</view>
				<view class="top-right-tool-wx-list-item" @click="saoyisao">
					<view class="top-right-tool-wx-list-item-icon"><view class="wxfont saoyisao"></view></view>
					<view class="text">扫一扫</view>
				</view>
			</view>
		</view>
		<view class="top-right-tool-wx-model"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			height: 0 ,//距离顶部高度
			show:false,
			animationData: {}
		};
	},
	props: {
		list: {
			type: Array,
			default() {
				return [{}];
			}
		}
	},
	onShow() {
		
	},
	mounted() {
		this.getstatusBarHeight();
		var animation = uni.createAnimation({
			duration: 300,
			timingFunction: 'linear'
		});
		this.animation = animation;
	},
	methods: {
		groupChat(){
			uni.navigateTo({
				url:'../../wx/group/createGroup'
			})
		},
		goSearchFriends(){
			uni.navigateTo({
				url:'../../wx/search-friends/index'
			})
		},
		saoyisao(){
			this.$fc.saoyisao()
		},
		showAnimation() {
			this.animation.opacity(1).step();
			this.animationData = this.animation.export();
		},
		hideAnimation() {
			this.animation.opacity(0).step();
			this.animationData = this.animation.export();
		},
		moveHandle(e) {
			this.hiddenTab()
		},
		showTab(){
			this.show=true
			setTimeout(()=>{
				this.showAnimation()
			},30)
		},
		hiddenTab(){
			this.show=false
			this.hideAnimation()
		},
		getstatusBarHeight() {
			var SystemInfo = uni.getSystemInfoSync();
			// #ifdef H5
			this.height = SystemInfo.safeArea.top + SystemInfo.windowTop;
			// #endif
		}
	}
};
</script>
<style scoped>
.top-right-tool-wx {
	width: 300rpx;
	position: fixed;
	z-index: 9999;
	top: -10px;
	right: 16rpx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	opacity: 0;
}
.top-right-tool-wx-model{
	background-color: rgba(0,0,0,0);
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 9998;
}
.top-right-tool-wx-icon {
	width: 0px;
	height: 0px;
	border: 10px solid transparent;
	border-bottom-color: #4C4C4C;
	margin-left: auto;
	margin-right: 20rpx;
}
.top-right-tool-wx-list {
	width: 100%;
	background-color: #4C4C4C;
	border-radius: 10rpx;
}
.top-right-tool-wx-list-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0rpx 36rpx;
	padding-right: 0;
}
.top-right-tool-wx-list-item-icon {
	width: 38rpx;
	height: 38rpx;
	margin-right: 28rpx;
	color: #fff;
}
.top-right-tool-wx-list-item-icon .wxfont {
	font-size: 40rpx;
}
.top-right-tool-wx-list-item .text {
	color: #fff;
	font-size: 32rpx;
	border-bottom: 1px #535353 solid;
	padding: 30rpx 0rpx;
	flex: 1;
}
.top-right-tool-wx-list-item:nth-last-child(1) .text{
	border: none;
}
</style>
