<template>
	<view @touchmove.stop.prevent="moveHandle('touchmove')" @click="moveHandle('click')" v-if="show">
		<view class="openTool-wx" :animation="animationData">
			<view class="openTool-wx-list" v-if="data">
				<view class="openTool-wx-list-item" @click="copyText(data.content)" v-if="data.msgType == 'TEXT'">
					<view class="openTool-wx-list-item-icon"><view class="wxfont wxcopy"></view></view>
					<view class="text">复制</view>
				</view>
				<view class="openTool-wx-list-item" @click="shoucang" v-if="data.msgType !== 'TRTC_VOICE_END'&&data.msgType !== 'TRTC_VIDEO_END'">
					<view class="openTool-wx-list-item-icon"><view class="wxfont shoucang"></view></view>
					<view class="text">收藏</view>
				</view>
				<view class="openTool-wx-list-item" @click="shanchu">
					<view class="openTool-wx-list-item-icon"><view class="wxfont wxdelete"></view></view>
					<view class="text">删除</view>
				</view>
			</view>
			<view class="openTool-wx-icon"></view>
		</view>
		<view class="openTool-wx-model"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show:false,
			animationData: {}
		};
	},
	props: {
		data:{
			type:[Object,String]
		},
		talkTo:{
			type:[Object,String,Number]
		},
		itemKey:{
			type:[Object,String,Number]
		},
		list: {
			type: Array,
			default() {
				return [{}];
			}
		}
	},
	onShow() {
		
	},
	computed: {
		chatWindowData() {
			return this.$store.state.chatDatalist[this.talkTo.userId]
		}
	},
	mounted() {
		var animation = uni.createAnimation({
			duration: 300,
			timingFunction: 'linear'
		});
		this.animation = animation;
	},
	methods: {
		copyText(e){
			uni.setClipboardData({
				data: e,
				success: function() {
					uni.showToast({
						title: '复制成功',
						icon: 'none',
						position: 'bottom'
					})
				}
			});
		},
		shoucang(){
			this.$http.request({
				url: '/collect/add',
				method: 'POST',
				data:JSON.stringify({
					collectType: this.data.msgType,
					content: this.data.content
				}),
				success: (res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title:'收藏成功',
							icon:'none'
						})
					}
				}
			});
		},
		shanchu(){
			this.chatWindowData.splice(this.itemKey, 1);
			this.$store.dispatch('updateChatById', { userId: this.data.userId, data: this.chatWindowData });
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
	}
};
</script>
<style scoped>
.openTool-wx {
	width: 552rpx;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	opacity: 0;
	position: relative;
	z-index: 2;
}
.openTool-wx-model{
	background-color: rgba(0,0,0,0);
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 1;
}
.openTool-wx-icon {
	width: 0px;
	height: 0px;
	border: 5px solid transparent;
	border-top-color: #4C4C4C;
	margin: 0 auto;
	margin-bottom: -5px;
}
.openTool-wx-list {
	width: 100%;
	padding: 24rpx;
	box-sizing: border-box;
	background-color: #4C4C4C;
	border-radius: 10rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	flex-wrap: wrap;
}
.openTool-wx-list-item {
	margin: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.openTool-wx-list-item-icon {
	color: #fff;
	margin-bottom: 6rpx;
}
.openTool-wx-list-item-icon .wxfont {
	font-size: 42rpx;
}
.openTool-wx-list-item .text {
	color: #fff;
	font-size: 28rpx;
	border-bottom: 1px #535353 solid;
	flex: 1;
}
.openTool-wx-list-item:nth-last-child(1) .text{
	border: none;
}
.zfb-tk-msgright .openTool-wx-icon{
	margin-right: 24rpx;
}
.zfb-tk-msgleft .openTool-wx-icon{
	margin-left: 24rpx;
}
</style>
