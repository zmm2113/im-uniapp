<template>
	<view class="wxshake">
		<watermark></watermark>
		<view class="wxshake-box">
			<image class="wxshake-img" src="../../static/wx/y01.png" mode="aspectFill"></image>
			<view class="wxshake-open-box" :class="{'wxshake-open':show}">
				<image class="wxshake-open-img" src="../../static/wx/y03.png" mode="aspectFill"></image>
				<text class="wxshake-open-text">正在搜寻统一时刻摇晃手机的人</text>
			</view>
			<image class="wxshake-img" src="../../static/wx/y02.png" mode="aspectFill"></image>
		</view>
		<view class="wxshake-card" v-if="showCard" @click="goAddfriend(detail)">
			<view class="person-wx-user">
				<image class="person-wx-avatar" @click="$fc.previewImagesolo(detail.portrait)" :src="detail.portrait" mode="aspectFill"></image>
				<view class="person-wx-user-detail">
					<view class="person-wx-nikename">
						<text class="text">{{detail.nickName}}</text>
						<view class="wxfont person-wx-nikename-icon" :class="{'nv':detail.gender=='0'}" v-if="detail.gender=='0'"></view>
						<view class="wxfont person-wx-nikename-icon" :class="{'nan':detail.gender=='1'}" v-if="detail.gender=='1'"></view>
					</view>
					<text class="person-wx-name">
						相距{{detail.distance}}{{detail.distanceUnit}}
					</text>
				</view>
				<uni-icons class="xw-tool-right" type="right" size="18" color="#b5b5b5"></uni-icons>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				isOpened: false,
				showCard:false,
				detail:''
			}
		},
		onLoad: function () {
			this.music = uni.createInnerAudioContext();
			this.music.src = '../../static/shake.wav';
			uni.startAccelerometer();
			uni.onAccelerometerChange((res) => {
				if(this.show){
					return
				}
				if (Math.abs(res.x) + Math.abs(res.y) + Math.abs(res.z) > 20 && !this.show && this.isOpened) {
					this.music.play();
					this.showCard=false;
					this.show = true;
					uni.getLocation({
						type: 'wgs84',
						success: (resLocation)=> {
							this.$http.request({
								url: '/shake/doShake',
								method: 'POST',
								data:JSON.stringify({
									longitude:resLocation.longitude,
									latitude:resLocation.latitude
								}),
								success: (res) => {
									if (res.data.code == 200) {
										this.detail=res.data.data
										setTimeout(() => {
											this.showCard=true
										}, 400)
									}
								}
							});
						},
						fail: (error) => {
							uni.showToast({
								title:'请检查定位是否开启',
								icon:'none',
								position:'bottom'
							})
							console.log(error.errMsg)
						},
						complete: (res) => {
							setTimeout(() => {
								this.show = false;
							}, 300)
						}
					});
				}
			})
		},
		onShow() {
			this.isOpened = true;
		},
		onUnload() {
			this.show = false;
			this.isOpened = false;
			uni.stopAccelerometer();
			this.music.destroy();
		},
		methods:{
			goAddfriend(e){
				uni.navigateTo({
					url:'../personInfo/detail?param='+e.userId+'&source=5'
				})
			}
		}
	}
</script>

<style scoped>
	.wxshake{
		background-color: #212121;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-wrap: wrap;
	}
	.wxshake-box{
		display: flex;flex-direction: column;
		justify-content: center;align-items: center;
	}
	.wxshake-img{
		width: 200rpx;
		height: 100rpx;
	}
	.wxshake-open-box{
		box-sizing: border-box;
		height: 0;
		overflow: hidden;
		transition: all 0.3s linear;
		width: 750rpx;
		background-color: #2F2F2F;
		display: flex;flex-direction: column;justify-content: center;align-items: center;
	}
	.wxshake-open{
		height: 360rpx;
	}
	.wxshake-open-img{
		width: 150rpx;
		height: 150rpx;
	}
	.wxshake-open-text{
		font-size: 26rpx;
		color: #A6A6A6;
	}
	.wxshake-card{
		margin:0 50rpx;
		margin-top: 200rpx;
		padding: 24rpx;
		background-color: #4C4C4C;
		border-radius: 12rpx;
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
		width: 400rpx;
	}
	
	.person-wx-nikename {
		color: #e7e7e7;
		font-size: 36rpx;
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
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
