<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="person-wx" v-if="userInfo">
			<view class="person-wx-user">
				<image class="person-wx-avatar" @click="$fc.previewImagesolo(userInfo.portrait)" :src="userInfo.portrait" mode="aspectFill"></image>
				<view class="person-wx-user-detail" @click="goPersonDetail">
					<view class="person-wx-nikename">{{userInfo.nickName}}</view>
					<view class="person-wx-name">
						<text class="text">微聊号：{{userInfo.chatNo}}</text>
						<image class="person-wx-fcode" src="../../static/wx/t05.png" mode="aspectFill"></image>
						<uni-icons class="person-wx-right" type="right" size="26" color="#676767"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<tool-list-wx :list="fuwu"></tool-list-wx>
		<tool-list-wx :list="shoucang"></tool-list-wx>
		<tool-list-wx :list="shezhi"></tool-list-wx>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fuwu: [{
					title: '服务(未开通)',
					path: '',
					icon: '../../static/wx/t06.png',
					else: []
				}],
				shoucang: [{
					title: '收藏',
					path: '../../wx/favorites/index',
					icon: '../../static/wx/t07.png',
					else: []
				},{
					title: '朋友圈',
					path: '../../wx/friendsCircle/person',
					icon: '../../static/wx/t01.png',
					else: []
				},{
					title: '卡包(未开通)',
					path: '',
					icon: '../../static/wx/t10.png',
					else: []
				},{
					title: '表情(未开通)',
					path: '',
					icon: '../../static/wx/t09.png',
					else: []
				}],
				shezhi: [{
					title: '设置',
					path: '../system/index',
					icon: '../../static/wx/t04.png',
					else: []
				}]
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			}
		},
		onLoad() {},
		onShow(){
			this.$store.dispatch('tabBarpull')
		},
		methods: {
			delete1(e){
				console.log(e)
			},
			goPersonDetail(){
				uni.navigateTo({
					url:'../../wx/personDetail/index'
				})
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
	.person-wx {
		margin-bottom: 14rpx;
		background-color: #fff;
		padding: 44rpx;
		padding-right: 24rpx;
	}

	.person-wx-user {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.person-wx-avatar {
		width: 114rpx;
		min-width: 114rpx;
		height: 114rpx;
		margin-right: 28rpx;
		border-radius: 16rpx;
	}

	.person-wx-user-detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}

	.person-wx-nikename {
		font-size: 36rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.person-wx-name {
		color: #999;
		font-size: 28rpx;
		display: flex;flex-direction: row;align-items: center;
	}
	.person-wx-name .text{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.person-wx-fcode{
		width: 46rpx;
		height: 46rpx;
		margin-left: auto;
		margin-right: 40rpx;
	}
	.person-wx-right{
	}
</style>
