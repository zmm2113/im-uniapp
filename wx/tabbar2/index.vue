<template>
	<view class="xw-book">
		<watermark></watermark>
		<uni-indexed-list-wx :options="list" @click="bindClick"></uni-indexed-list-wx>
		<top-right-tool-wx ref="trtw"></top-right-tool-wx>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {},
		onShow() {
			this.getflist()
			this.$store.dispatch('tabBarpull')
		},
		methods: {
			bindClick(e){
				uni.navigateTo({
					url:'../personInfo/detail?param='+e.item.data.userId
				})
			},
			getflist(){
				this.$http.request({
					url: '/friend/friendList',
					method: 'POST',
					data:JSON.stringify({}),
					success: (res) => {
						if (res.data.code == 200) {
							var data=res.data.data
							var list=[]
							for (var i = 0; i < data.length; i++) {
								var item=data[i]
								list.push({
									name:item.nickName,
									avatar:item.portrait,
									userId:item.userId,
									userType:item.userType,
									chatNo:item.chatNo
								})
							}
							this.list=this.$fc.sortList({list:list,key:'name'})
						}
					}
				});
			},
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0: //更多
					this.$refs['trtw'].showTab();
					break;
				case 1: //搜索
					uni.navigateTo({
						url: '../search/index'
					});
					break;
				default:
					break;
			}
		},
	}
</script>

<style scoped>
	
</style>
