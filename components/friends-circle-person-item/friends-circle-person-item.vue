<template>
	<view class="friends-circle-person-item" v-for="(v, i) in content" :key="i">
		<view class="friends-circle-person-item-date"><!--  -->
			<text class="day">{{returnDate(v.createTime,'d')}}</text>
			<text class="month">{{returnDate(v.createTime,'m')}}月</text>
			<view class="year">{{returnDate(v.createTime,'y')}}</view>
			<view class="year" v-if="v.location.name">{{v.location.name}}</view>
		</view>
		<view class="friends-circle-person-view" @click="clickItem(v)">
			<view class="friends-circle-person-content" v-if="v.topicType=='IMAGE'&&v.files.length>0">
				<view class="friends-circle-person-imgs">
					<image v-for="(item, ii) in v.files.slice(0,4)" :key="ii" :class="'fci' + v.files.slice(0,4).length" :src="item.url" mode="aspectFill"></image>
				</view>
				<view class="friends-circle-person-imgs-text">
					<text>{{v.text}}</text>
					<view class="friends-circle-person-imgs-total">共{{v.files.length}}张</view>
				</view>
			</view>
			<view class="friends-circle-person-content" v-if="v.topicType=='VIDEO'&&v.files.length>0">
				<view class="friendsCircle-content-video">
					<image class="friendsCircle-content-video-icon" src="../../static/img/bf.png" mode="aspectFill"></image>
					<image class="friendsCircle-content-video-img" :src="v.files[0].url" mode="aspectFill"></image>
				</view>
				<view class="friends-circle-person-imgs-text">
					<text>{{v.text}}</text>
				</view>
			</view>
			<view v-if="v.topicType=='TEXT'" class="friends-circle-person-content">
				<view class="friends-circle-person-text">
					<text>{{v.text}}</text>
				</view>
			</view>
		</view>
	</view>
	<view class="friends-circle-nodata" v-if="content.length<=0">
		<view class="friends-circle-nodata-line"></view>
		<view class="friends-circle-nodata-text">未发布朋友圈</view>
	</view>
</template>

<script>
export default {
	// 朋友圈单人列表
	emits:['clickItem'],
	data() {
		return {
		};
	},
	props:{
		content:{
			type:Array,
			default:[]
		}
	},
	methods: {
		returnDate(e,format){
			return this.$fc.getNewDate(format,true,e)
		},
		clickItem(e){
			this.$emit('clickItem',e)
		}
	}
};
</script>

<style scoped lang="scss">
	
	.friends-circle-person-item{
		display: flex;flex-direction: row;
		margin-bottom: 60rpx;
		width: 100%;
	}
	.friends-circle-person-view{
		flex: 1;
	}
	.friends-circle-person-item-date{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-right: 40rpx;
		width: 115rpx;
		min-width: 115rpx;
		line-height: 60rpx;
		text-align: right;
	}
	.friends-circle-person-item-date .day{
		flex: 1;
		font-size: 43rpx;
	}
	.friends-circle-person-item-date .month{
		font-size: 26rpx;
		flex: 1;
	}
	.friends-circle-person-item-date .year{
		width: 100%;
		min-width: 100%;
		font-size: 24rpx;
		color: #999;
		line-height: initial;
	}
	.friends-circle-person-content{
		flex: 1;
		display: flex;flex-direction: row;
	}
	.friends-circle-person-text{
		padding: 12rpx;
		background-color: #eee;
		border-radius: 4rpx;
	}
	.friends-circle-person-text text{
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.friends-circle-person-imgs{
		width: 140rpx;
		min-width: 140rpx;
		height: 140rpx;
		margin-right: 14rpx;
	}
	.friends-circle-person-imgs image{float: left;}
	.friends-circle-person-imgs .fci1{
		width: 100%;
		height: 100%;
	}
	.friends-circle-person-imgs .fci2{
		margin-right: 2%;
		width: 49%;
		height: 100%;
	}
	.friends-circle-person-imgs .fci2:nth-child(2n){
		margin-right: 0;
	}
	.friends-circle-person-imgs .fci3{
		margin-right: 2%;
		width: 49%;
		height: 48%;
	}
	.friends-circle-person-imgs .fci3:nth-child(1){
		height: 98%;
	}
	.friends-circle-person-imgs .fci3:nth-child(2){
		margin-bottom: 2%;
	}
	.friends-circle-person-imgs .fci3:nth-child(2),.friends-circle-person-imgs .fci3:nth-child(3){
		margin-right: 0;
	}
	.friends-circle-person-imgs .fci4{
		margin-right: 2%;
		width: 49%;
		height: 49%;
		margin-bottom: 2%;
	}
	.friends-circle-person-imgs .fci4:nth-child(2n){
		margin-right: 0;
	}
	.friends-circle-person-imgs-text{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.friends-circle-person-imgs-text text{
		line-height: 1.2;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.friends-circle-person-imgs-total{
		color: #999;
		font-size: 24rpx;
	}
	.friends-circle-nodata{
		display: flex;flex-direction: column;
	}
	.friends-circle-nodata-line{
		margin: 50rpx;
		margin-bottom: 30rpx;
		height: 1px;
		position: relative;
		background-color: #eee;
	}
	.friends-circle-nodata-line::after{
		content: " ";
		width: 13rpx;
		height: 13rpx;
		border-radius: 50%;
		background-color: #eee;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.friends-circle-nodata-text{
		font-size: 24rpx;
		text-align: center;
		color: #999;
	}
	.friendsCircle-content-video{
		width: 140rpx;
		height: 140rpx;
		position: relative;
		margin-right: 14rpx;
	}
	.friendsCircle-content-video-img{
		width: 100%;
		height: 100%;
	}
	.friendsCircle-content-video-icon{
		z-index: 1;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 60rpx !important;
		height: 60rpx !important;
		transform: translate(-50%,-50%);
	}
</style>
