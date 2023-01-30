<template>
	<view class="bgColor">
		<watermark></watermark>
		<!-- <tool-list-wx :list="list1" @itemClick="itemClick1"></tool-list-wx> -->
		<tool-list-wx :list="list2" @itemClick="itemClick2"></tool-list-wx>
		<view class="xw-tool-list">
			<view class="xw-tool-list-content">
				<view class="xw-tool-item">
					<text class="xw-tool-text">加入黑名单</text>
					<switch color="#05C160" :checked="Baned" @change="heifangfangChange" style="transform:scale(0.75);" />
				</view>
			</view>
		</view>
		<view class="xw-tool-list">
			<view class="xw-tool-list-content">
				<view class="xw-tool-btn-item" @click="deleteFriend">
					<view class="xw-tool-btn-text" style="color: #FF5A5F;">删除</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:'',
				list1: [{
					title: '把他推荐给朋友',
					path: '#'
				}],
				list2: [{
					title: '设置备注和标签',
					path: '#'
				}],
			}
		},
		onLoad(e) {
			var stringdata=decodeURIComponent(e.data)
			// #ifndef MP-WEIXIN
			e.data=e.data.replace(/%/g, '%25')
			// #endif
			var data = JSON.parse(stringdata)
			this.detail=data
		},
		computed:{
			Baned(){
				return this.detail.black=='Y' ? true : false
			},
			chatList() {
				return this.$store.state.chatlist
			}
		},
		onShow(){},
		methods: {
			itemClick2(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'beizhu?userId='+this.detail.userId+'&remark='+this.detail.nickName
					})
						break;
					default:
						break;
				}
			},
			heifangfangChange(e){
				var yn=e.detail.value ? 'Y' : 'N'
				var ynText=e.detail.value ? '已加入黑名单' : '已移除黑名单'
				this.$http.request({
					url: '/friend/black',
					method: 'POST',
					data:JSON.stringify({
						userId:this.detail.userId,
						black:yn
					}),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title:ynText,
								icon:'none'
							})
						}
					}
				});
			},
			deleteFriend(){
				uni.showModal({
					title: '提醒',
					content: '是否确认删除好友',
					success: (res)=> {
						if (res.confirm) {
							this.$http.request({
								url: '/friend/delFriend',
								method: 'POST',
								data:JSON.stringify({
									userId:this.detail.userId
								}),
								success: (res) => {
									if (res.data.code == 200) {
										delete this.chatList[this.detail.userId]
										this.$store.dispatch('updateChatListInfoById',{
											userId: this.detail.userId,
											data: {}
										});
										this.$store.dispatch('updateChatById', {
											userId: this.detail.userId,
											data: []
										});
										uni.showToast({
											title:'删除成功',
											icon:'none'
										}).then(()=>{
											uni.navigateBack({
												delta:3
											})
										})
									}
								}
							});
						} else if (res.cancel) {
							
						}
					}
				});
			},
			itemClick1(e,i){
				switch (i){
					case 0:
					uni.showToast({
						title:'把他推荐给朋友',
						icon:'none'
					})
						break;
					default:
						break;
				}
			},
		},
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
	
	.xw-tool-list {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		margin-bottom: 18rpx;
	}
	
	.xw-tool-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 26rpx 24rpx;
		border-bottom: 1px #eee solid;
	}
	.xw-tool-item:nth-last-child(1) {
		border: none;
	}
	
	.xw-tool-text {
		margin-right: auto;
	}
	
	.xw-tool-btn-item{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 34rpx 44rpx;
		border-bottom: 1px #eee solid;
		font-weight: bold;
		color: #5F698C;
	}
</style>
