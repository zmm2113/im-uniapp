<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="QRcode-box">
			<view style="width: 100%;" v-if="detail">
				<uni-list :border="false">
					<uni-list-chat :title="detail.group.name" :avatar-list="portraits" :note="'('+detail.user.length+'人)'" badge-positon="left"></uni-list-chat>
				</uni-list>
			</view>
			<view class="QRcode-img">
				<image :src="QRimg" mode="aspectFill" @click="resetQrCode"></image>
			</view>
			<view class="QRcode-tips">扫一扫上面的二维码图案，加入群聊</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				QRimg:'',
				detail:'',
				portraits:[]
			}
		},
		onLoad(e) {
			this.resetQrCode(e.groupId)
			this.getInfo(e.groupId)
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			}
		},
		onShow(){},
		methods: {
			getInfo(e){//详情
				this.$http.request({
					url: '/group/getInfo/'+e,
					success: (res) => {
						if (res.data.code == 200) {
							this.detail=res.data.data
							var portraits=[]
							for (var i = 0; i < this.detail.user.length; i++) {
								portraits.push({
									url:this.detail.user[i].portrait
								})
							}
							this.portraits=portraits
						}
					}
				});
			},
			resetQrCode(e){
				this.$http.request({
					url: '/group/getGroupQrCode/'+e,
					success: (res) => {
						if (res.data.code == 200) {
							this.QRimg=res.data.data
						}
					}
				});
			}
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
				uni.showActionSheet({
				    // itemList: ['换个样式', '保存到手机', '扫描二维码', '重置二维码'],
				    itemList: ['保存到手机'],
				    success: (res)=> {
						switch (res.tapIndex) {
							case 0:
							// #ifdef APP-PLUS
							this.$fc.plusSaveBase64Img({base64:this.QRimg})
							// #endif
							// #ifdef H5
							this.$fc.h5SaveBase64Img({base64:this.QRimg})
							// #endif
								break;
							default:
								break;
						}
				    },
				    fail: (res)=> {
				        console.log(res.errMsg);
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
	.QRcode-box{
		width: 666rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		padding: 32rpx;
		background-color: #fff;
		border-radius: 24rpx;
		box-sizing: border-box;
		display: flex;flex-direction: column;
		align-items: center;
	}
	.QRcode-img{
		width: 600rpx;
		height: 600rpx;
	}
	.QRcode-img image{width: 100%;height: 100%;}
	.QRcode-tips{
		margin-top: 6rpx;
		font-size: 26rpx;
		color: #999;
	}
	.person-wx {
		width: 100%;
		margin-bottom: 24rpx;
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
		justify-content: center;
		width: 440rpx;
	}
	
	.person-wx-nikename {
		font-size: 32rpx;
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
		margin-top: 12rpx;
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
