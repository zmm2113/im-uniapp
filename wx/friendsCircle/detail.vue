<template>
	<view>
		<watermark></watermark>
		<friends-circle-detail :detail="detail"></friends-circle-detail>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {},
			showtitleNViewBtns:false
		};
	},
	onLoad(e) {
		this.getInfo(e.topicId)
	},
	mounted() {
		this.$fc.setTitleNViewBtns(0,'')
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo
		}
	},
	methods: {
		getInfo(id){
			this.$http.request({
				url: '/topic/topicInfo/'+id,
				success: (res) => {
					if (res.data.code == 200) {
						var item=res.data.data
						var detail={
							canDeleted:this.userInfo.userId==item.topic.userId ? true : false,
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
							replyList:item.replyList,
						}
						this.detail=detail
						if(this.detail.canDeleted){
							this.showtitleNViewBtns=true
							this.$fc.setTitleNViewBtns(0,'\ue623')
						}
					}
				}
			});
		}
	},
	onNavigationBarButtonTap(e) {
		if(!this.showtitleNViewBtns){
			return
		}
		switch (e.index) {
			case 0: //更多
			uni.showActionSheet({
				itemList: ['删除'],
				success: (res) => {
					this.$http.request({
						url: '/topic/removeTopic/'+this.detail.topicId,
						success: (res) => {
							if (res.data.code == 200) {
								uni.navigateBack({
									delta:1
								}).then(res=>{
									uni.showToast({
										title:'删除成功',
										icon:'none'
									})
								})
							}
						}
					});
					switch (res.tapIndex) {
						case 0:
							break;
						case 1:
							break;
						default:
							break;
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});	
				break;
			default:
				break;
		}
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
}
</style>
