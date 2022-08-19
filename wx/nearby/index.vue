<template>
	<view class="wxnearby">
		<watermark></watermark>
		<view class="wxnearby-item" v-for="(v,i) in list" :key="i" @click="goAddfriend(v)">
			<view class="person-wx-user">
				<image class="person-wx-avatar" @click="$fc.previewImagesolo(v.portrait)" :src="v.portrait" mode="aspectFill"></image>
				<view class="wxnearby-item-content">
					<view class="person-wx-user-detail">
						<view class="person-wx-nikename">
							<text class="text">{{v.nickName}}</text>
							<view class="wxfont person-wx-nikename-icon" :class="{'nv':v.gender=='0'}" v-if="v.gender=='0'"></view>
							<view class="wxfont person-wx-nikename-icon" :class="{'nan':v.gender=='1'}" v-if="v.gender=='1'"></view>
						</view>
						<text class="person-wx-name">
							相距{{v.distance}}{{v.distanceUnit}}
						</text>
					</view>
					<view class="person-wx-intor" v-if="v.intro">{{v.intro}}</view>
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
			uni.showModal({
				title: '提示',
				cancelText:'返回',
				content: '查看附近的人将获取你的位置信息，你的位置信息会被保留一段时间，通过右上角的清除功能可随时手动清除位置信息',
				success: (res) => {
					if (res.confirm) {
						this.getlist()
					} else if (res.cancel) {
						uni.navigateBack({
							delta:1
						})
					}
				}
			});
		},
		onShow() {},
		onUnload() {},
		methods:{
			getlist(){
				uni.showLoading({
					title:'获取地理位置中'
				})
				uni.getLocation({
					type: 'wgs84',
					success: (resLocation)=> {
						this.$http.request({
							url: '/near/doNear',
							method: 'POST',
							data:JSON.stringify({
								longitude:resLocation.longitude,
								latitude:resLocation.latitude
							}),
							success: (res) => {
								if (res.data.code == 200) {
									this.list=res.data.data
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
					}
				});
			},
			goAddfriend(e){
				uni.navigateTo({
					url:'../personInfo/detail?param='+e.userId+'&source=8'
				})
			}
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
				uni.showActionSheet({
					itemList: ['清除位置信息并退出'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0:
							this.$http.request({
								url: '/near/closeNear',
								success: (res) => {
									if (res.data.code == 200) {
										uni.navigateBack({
											delta:1
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
		color: #333;
		font-size: 36rpx;
		display: flex;flex-direction: row;align-items: center;
		margin-bottom: 12rpx;
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
	.person-wx-intor{
		padding: 12rpx;
		margin-left: auto;
		font-size: 24rpx;
		background-color: #F2F2F2;
		color: #666;
		border-radius: 6rpx;
	}
</style>
