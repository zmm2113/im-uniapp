<template>
	<view class="friendsCircle">
		<watermark></watermark>
		<friends-circle-top :cover="cover" :userInfo="userInfo" @userClick="userClick"></friends-circle-top>
		<view class="friendsCircle-content">
			<view class="friendsCircle-msgalert-box" v-if="topicReply.count && topicReply.count > 0" @click="gomsglist">
				<view class="friendsCircle-msgalert">
					<image class="friendsCircle-msgalert-img" :src="topicReply.portrait" mode="aspectFill"></image>
					<text class="friendsCircle-msgalert-text">{{ topicReply.count }}条新消息</text>
				</view>
			</view>
			<friends-circle-list-item ref="fcli" v-model:content="content"></friends-circle-list-item>
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
			content: []
		};
	},
	computed: {
		cover() {
			var cover = this.$store.state.userInfo.cover ? JSON.parse(this.$store.state.userInfo.cover) : { type: 'img', name: '', url: '' };
			return cover;
		},
		userInfo() {
			return this.$store.state.userInfo;
		},
		topicReply() {
			return this.$store.state.topicReply;
		}
	},
	onLoad() {
		this.getlist();
	},
	methods: {
		getlist() {
			this.queryParams.status='loading'
			this.$fc.loadMore({
				url: '/topic/topicList?',
				queryParams: this.queryParams
			}).then(res => {
				this.$store.commit('update_topicRed',{})
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
						topicType: item.topic.topicType,
						files: JSON.parse(item.topic.content).files,
						location: item.topic.location ? JSON.parse(item.topic.location) : {},
						time: item.topic.createTime,
						like: item.like,
						likeList: item.likeList,
						replyList: item.replyList
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
		userClick(cover, user) {
			uni.navigateTo({
				url: '../../wx/friendsCircle/person'
			});
		},
		gomsglist() {
			uni.navigateTo({
				url: './msglist'
			});
		}
	},
	onPageScroll(e) {
		this.$refs['fcli'].hidenTool();
	},
	onNavigationBarButtonTap(e) {
		switch (e.index) {
			case 0:
				uni.navigateTo({
					url: '../friendsCircle/sendMsg'
				});
				break;
			default:
				break;
		}
	},
	onPullDownRefresh() {
		this.queryParams.refreshing=true
		this.getlist();
	},
	onReachBottom() {
		this.getlist();
	}
};
</script>

<style scoped lang="scss">
.friendsCircle {
}

.friendsCircle-content {
	padding-top: 160rpx;
	display: flex;
	flex-direction: column;
	position: relative;
}
.friendsCircle-msgalert-box {
	margin-top: -64rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.friendsCircle-msgalert {
	border-radius: 12rpx;
	background-color: #4c4c4c;
	padding: 14rpx 24rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.friendsCircle-msgalert-img {
	width: 60rpx;
	height: 60rpx;
	min-width: 60rpx;
	border-radius: 12rpx;
	margin-right: 24rpx;
}
.friendsCircle-msgalert-text {
	color: #fff;
}
</style>
