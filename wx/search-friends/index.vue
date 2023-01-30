<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="search-friends">
			<form @submit="subform">
				<input class="search-friends-input" placeholder="请填写微聊号/手机号" v-model="form.param" type="text" />
			</form>
			<view class="search-friends-list-title" v-if="list.length>0">历史</view>
			<view class="search-friends-list">
				<view class="search-friends-list-item" v-for="(v,i) in list" :key="i">
					<image class="search-friends-list-img" :src="v.portrait" mode="aspectFill" @click="godetail(v)"></image>
					<view class="search-friends-list-user" @click="godetail(v)">
						<view class="search-friends-list-username">{{v.nickName}}</view>
						<view class="search-friends-list-remark">{{v.reason}}</view>
					</view>
					<view class="search-friends-list-btns">
						<view class="search-friends-list-btn-text">
							<view v-if="v.applyStatus=='0'" class="search-friends-list-btn btn1" @click="agreeApply(v.applyId)">接受</view>
							<text v-if="v.applyStatus=='1'">已同意</text>
							<text v-if="v.applyStatus=='2'">已拒绝</text>
							<text v-if="v.applyStatus=='3'">已忽略</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more v-show="list.length>9" :status="queryParams.status"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryParams: {
					refreshing: false,
					status: 'more',
					pageNum: 1,
					pageSize: 10
				},
				form:{
					param:''
				},
				list:[]
			};
		},
		computed: {},
		onLoad() {
		},
		onShow() {
			this.queryParams.refreshing=true
			this.applyList()
		},
		methods: {
			godetail(e){
				uni.navigateTo({
					url:'../personInfo/addFriendsDetail?param='+e.applyId+'&type=2'
				})
			},
			agreeApply(e){
				this.$http.request({
					url: '/apply/agree',
					method: 'POST',
					data:JSON.stringify({applyId:e}),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title:'已同意',
								icon:'none'
							})
							this.queryParams.refreshing=true
							this.applyList()
						}
					}
				});
			},
			applyList(){
				this.queryParams.status='loading'
				this.$fc.loadMore({
					url: '/apply/list?',
					queryParams: this.queryParams
				}).then(res => {
					this.$store.commit('update_friendApply',{})
					uni.removeStorageSync('friendApply');
					this.queryParams = res.queryParams;
					if (res.status=='3') {
						this.list=[]
						return
					}
					if (res.status=='0') {
						return
					}
					var rows = res.list;
					var list = [];
					for (var i = 0; i < rows.length; i++) {
						var item = rows[i];
						list.push(item);
					}
					if (res.status=='2') {
						this.list = list;
					}
					if (res.status=='1') {
						this.list = this.list.concat(list);
					}
				});
			},
			subform(e) {
				var rules = {
					param: {
						rules: [{
							checkType: "required",
							errorMsg: "请填写微聊号/手机号"
						}]
					}
				};
				var formData = this.form;
				var checkRes = this.$zmmFormCheck.check(formData, rules);
				if (checkRes) {
					uni.navigateTo({
						url:'../personInfo/addFriendsDetail?param='+this.form.param+'&type=1'
					})
				} else {
					uni.showToast({
						title: this.$zmmFormCheck.error,
						icon: "none",
						position: 'bottom'
					});
				}
			},
		},
		onPullDownRefresh() {
			this.queryParams.refreshing=true
			this.applyList();
		},
		onReachBottom() {
			this.applyList();
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					this.subform()
					break;
				default:
					break;
			}
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
	.search-friends{
		display: flex;
		flex-direction: column;
	}
	.search-friends-input{
		margin:20rpx 24rpx;
		margin-bottom: 0;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background-color: #fff;
		border-radius: 24rpx;
	}
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
	.search-friends-list-btns{
		margin-left: auto;
	}
	.search-friends-list-btn{
		text-align: center;
		border-radius: 12rpx;
		padding:  8rpx 12rpx;
	}
	.search-friends-list-btn-text{
		color: #999;
		font-size: 28rpx;
	}
	.search-friends-list-btn.btn1{
		background-color: #1BC418;
		color: #fff;
	}
	.search-friends-list-btn.btn2{
		background-color: #c4c4c4;
		color: #fff;
	}
	.search-friends-list-btn.btn3{
		background-color: #ff6767;
		color: #fff;
	}
</style>
