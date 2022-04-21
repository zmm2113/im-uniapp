<template>
	<view @touchmove.stop.prevent="moveHandle('touchmove')" @click="moveHandle('click')" v-if="show">
		<view class="openTool-wx" :animation="animationData">
			<view class="openTool-wx-list" v-if="data">
				<view class="openTool-wx-list-item" @click="zhiding">
					<view class="text" v-if="data.top=='Y'">取消置顶</view>
					<view class="text" v-if="data.top=='N'">置顶该聊天</view>
				</view>
				<view class="openTool-wx-list-item" @click="shanchu">
					<view class="text">删除该聊天</view>
				</view>
			</view>
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
		chatList() {
			return this.$store.state.chatlist
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
		zhiding(){
			var data=JSON.parse(JSON.stringify(this.data))
			var yn = data.top=='N' ? 'Y' : 'N';
			data.top=yn
			this.$store.dispatch('updateChatListInfoById', {
				userId: this.data.userId,
				data: data
			})
			this.$store.dispatch('getChatList')
			if(data.windowType=='GROUP'){
				var formData = {
					groupId: this.data.userId,
					top: yn
				};
				this.$http.request({
					url: '/group/editTop',
					method: 'POST',
					data: JSON.stringify(formData),
					success: res => {
						if (res.data.code == 200) {
						}
					}
				});
			}
			if(data.windowType=='SINGLE'){
				var formData = {
					userId: this.data.userId,
					top: yn
				};
				this.$http.request({
					url: '/friend/top',
					method: 'POST',
					data: JSON.stringify(formData),
					success: res => {
						if (res.data.code == 200) {
						}
					}
				});
			}
		},
		shanchu(){
			delete this.chatList[this.data.userId]
			this.$store.dispatch('updateChatListInfoById',{
				userId: this.data.userId,
				data: {}
			});
			this.$store.dispatch('updateChatById', {
				userId: this.data.userId,
				data: []
			});
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
.openTool-wx-list {
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
}
.openTool-wx-list-item {
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.openTool-wx-list-item .text {
	color: #333;
	font-size: 28rpx;
	flex: 1;
}
.openTool-wx-list-item:nth-last-child(1) .text{
	border: none;
}
</style>
