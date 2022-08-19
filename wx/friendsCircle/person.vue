<template>
	<view class="friendsCircle">
		<watermark></watermark>
		<friends-circle-top :cover="cover" :userInfo="userInfox" @userClick="userClick" :showChangePoster="showChangePoster"></friends-circle-top>
		<view class="friendsCircle-content-today">
			<view class="friends-circle-today" v-if="showMsglist">
				<view class="friends-circle-today-text">今天</view>
				<view class="friends-circle-today-icon" @click="goFriendsCircleSendMsg">
					<view class="wxfont xiangji"></view>
				</view>
			</view>
			<friends-circle-person-item v-model:content="content" @clickItem="goFriendsCircleDetail"></friends-circle-person-item>
		</view>
		<uni-load-more v-show="content.length>9" :status="queryParams.status"></uni-load-more>
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
			content: [],
			showMsglist:false,
			showChangePoster:false,
			userInfox:{},
			cover:{type:'img',name:'',url:''},
			userId:''
		};
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo
		}
	},
	onLoad(e) {
		if(e.userId){
			this.userId=e.userId
		}else{
			this.userId=this.userInfo.userId
		}
		if(this.userId==this.userInfo.userId){
			this.showMsglist=true
			this.showChangePoster=true
		}
	},
	mounted() {
		this.$fc.setTitleNViewBtns(0,'')
		if(this.showMsglist){
			this.$fc.setTitleNViewBtns(0,'\ue6f4')
		}
		this.getUserInfo(this.userId)
	},
	onShow(){
		this.queryParams.refreshing=true
		this.getlist(this.userId)
	},
	methods: {
		getUserInfo(e){//好友详情
			this.$http.request({
				url: '/friend/info/'+e,
				success: (res) => {
					if (res.data.code == 200) {
						this.cover=res.data.data.cover ? JSON.parse(res.data.data.cover) : {type:'img',name:'',url:''}
						this.userInfox=res.data.data
					}
				}
			});
		},
		userClick(cover,user){
			uni.navigateTo({
				url:'../../wx/personInfo/detail?param='+user.userId
			})
		},
		getlist(userId){
			this.queryParams.status='loading'
			this.$fc.loadMore({
				url: '/topic/userTopic/'+userId+'/?',
				queryParams: this.queryParams
			}).then(res => {
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
					list.push({
						userId: item.topic.userId,
						nickName: item.topic.nickName,
						avatar: item.topic.portrait,
						topicId: item.topic.topicId,
						text: JSON.parse(item.topic.content).content,
						topicType:item.topic.topicType,
						files:JSON.parse(item.topic.content).files,
						location: item.topic.location ? JSON.parse(item.topic.location) : {},
						time:item.topic.createTime,
						like:item.like,
						likeList:item.likeList,
						replyList:item.replyList
					});
				}
				if (res.status=='2') {
					this.content = list;
				}
				if (res.status=='1') {
					this.content = this.content.concat(list);
				}
			});
		},
		goFriendsCircleSendMsg(){
			uni.navigateTo({
				url:'../friendsCircle/sendMsg'
			})
		},
		goFriendsCircleDetail(e){
			uni.navigateTo({
				url:'../friendsCircle/detail?topicId='+ e.topicId
			})
		}
	},
	onPullDownRefresh() {
		this.queryParams.refreshing=true
		this.getlist(this.userId);
	},
	onReachBottom() {
		this.getlist(this.userId);
	},
	onNavigationBarButtonTap(e) {
		if(!this.showMsglist){
			return
		}
		switch (e.index){
			case 0://更多
				uni.navigateTo({
					url:'../friendsCircle/msglist'
				})
				break;
			default:
				break;
		}
	},
};
</script>

<style scoped lang="scss">
	.friendsCircle-content-today{
		padding: 18rpx;
		padding-top: 160rpx;
		display: flex;
		flex-direction: column;
	}
	.friends-circle-today{
		display: flex;flex-direction: row;margin-bottom: 60rpx;
	}
	.friends-circle-today-text{
		font-size: 52rpx;
		font-weight: bold;
		margin-right: 50rpx;
	}
	.friends-circle-today-icon{
		display: flex;
		width: 145rpx;
		height: 145rpx;
		border-radius: 8rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #F7F7F7;
	}
	.friends-circle-today-icon .wxfont{
		font-size: 90rpx;
		color: #fff;
	}
	.friendsCircle-msglistin{
		z-index: 999;
		position: fixed;
		right: 24rpx;
		top: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.friendsCircle-msglistin .wxfont{
		color: #fff;
		font-size: 48rpx;
	}
</style>
