<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="wxgrouplist">
			<view class="wxgrouplist-item" v-for="(v,i) in list" :key="i" @click="goGroup(v)">
				<view class="wxgrouplist-imgs">
					<image v-for="(item,index) in v.portrait" :src="item" mode="aspectFill"></image>
				</view>
				<view class="wxgrouplist-title">{{v.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list:[]
		};
	},
	computed: {},
	onLoad(e) {},
	onShow() {
		this.getlist();
	},
	methods: {
		goGroup(e){
			uni.navigateTo({
				url:'../chatWindow/index?userId='+e.groupId+'&windowType=GROUP'
			})
		},
		getlist(e) {
			this.$http.request({
				url: '/group/groupList',
				success: res => {
					if (res.data.code == 200) {
						this.list = res.data.data;
					}
				}
			});
		}
	}
};
</script>

<style scoped>
/* #ifdef APP-PLUS */
.bgColor {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #ededed;
	overflow: auto;
}
/* #endif */
/* #ifdef H5 */
page {
	background: #ededed;
}
/* #endif */
.wxgrouplist{
	display: flex;flex-direction: column;
}
.wxgrouplist-item{
	padding:0 28rpx;
	background-color: #fff;
	display: flex;flex-direction: row;align-items: center;
}
.wxgrouplist-imgs{
	width: 80rpx;
	height: 80rpx;
	border-radius: 12rpx;
	overflow: hidden;
	display: flex;flex-direction: row;flex-wrap: wrap;
	background-color: #DEDEDE;
}
.wxgrouplist-imgs image{
	margin: 2rpx;
	width: 36rpx;
	height: 36rpx;
}
.wxgrouplist-title{
	flex: 1;
	border-bottom: 1px #F4F4F4 solid;
	font-size: 32rpx;
	color: #333;
	line-height: 105rpx;
	margin-left: 38rpx;
}
</style>
