<template>
	<view>
		<watermark></watermark>
		<zy-search :inputPlaceholder="inputPlaceholder" :inputHeight="inputHeight" :isFocus="isFocus" :theme="theme"
		 :callbackTime="callbacktime" :autoComplaylist="autoComplaylist" :hotList="hotList" :historyNum="historyNum"
		 :speechEngine="speechEngine" :Punctuation="Punctuation" @clickSearch="clickearch" @tagsClick="tagsclick"
		 @delhHistory="delhistory" @inputChange="inputchange" v-model="searchinput"></zy-search>
		 <view class="search-friends-list">
		 	<view class="search-friends-list-item" v-for="(v,i) in list" :key="i">
		 		<image class="search-friends-list-img" :src="v.portrait" mode="aspectFill" @click="godetail(v)"></image>
		 		<view class="search-friends-list-user" @click="godetail(v)">
		 			<view class="search-friends-list-username">{{v.nickName}}</view>
		 			<view class="search-friends-list-remark">{{v.chatNo}}</view>
		 		</view>
		 	</view>
		 </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				autoComplaylist: [], //可以调百度淘宝和自己的接口
				hotList: [], //推荐列表
				historyNum: 4, //历史记录保存数量
				inputPlaceholder: '输入好友名称', //默认提示语
				inputHeight: 40, //input高度
				theme: 'good-search-circle', //主题
				speechEngine: 'iFly', //语音识别引擎
				Punctuation: false, //是否开启语音识别标点符号
				callbacktime: 500, //input回调缓冲时间(不返回500毫秒以内输入的数据，防止每输入一个值就会触发一次)
				isFocus: true, //是否自动获取焦点
				urlList:[],
				searchinput:''
			};
		},
		computed: {},
		onLoad() {},
		methods: {
			godetail(e){
				uni.navigateTo({
					url:'../../wx/personInfo/detail?param='+e.userId
				})
			},
			clickearch(e) { //点击搜索回调
				this.getflist(e.trim())
			},
			getflist(e){
				this.$http.request({
					url: '/friend/friendList',
					method: 'POST',
					data:JSON.stringify({
						param:e
					}),
					success: (res) => {
						if (res.data.code == 200) {
							var data=res.data.data
							var list=[]
							for (var i = 0; i < data.length; i++) {
								var item=data[i]
								list.push(item)
							}
							this.list=list
						}
					}
				});
			},
			tagsclick(e) { //点击标签回调
				console.log(e)
			},
			delhistory() { //清除按钮回调
			},
			inputchange(e) { //input实时回调(可以用来调自动联想词接口)
				
			},
		}
	}
</script>

<style scoped>
	.search-friends-list{
		background-color: #fff;
		display: flex;flex-direction: column;
	}
	.search-friends-list-item{
		padding:0 24rpx;
		display: flex;flex-direction: row;align-items: center;
	}
	.search-friends-list-user{
		flex: 1;
		padding: 24rpx;
		border-bottom: 1px #eee solid;
		max-width: 470rpx;
	}
	.search-friends-list-username{
		font-size: 32rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.search-friends-list-title{
		font-size: 28rpx;
		color: #666;
		margin: 24rpx;
	}
	.search-friends-list-remark{
		font-size: 27rpx;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 12rpx;
	}
	.search-friends-list-item:nth-last-child(1) .search-friends-list-user{
		border: none;
	}
	.search-friends-list-img{
		min-width: 90rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 10rpx;
	}
</style>
