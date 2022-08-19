<template>
	<view class="wx-createGroup" :style="'height: calc(100vh - '+windowTop+'px)'">
		<watermark></watermark>
		<view class="wx-createGroup-check">
			<uni-indexed-list-wx showSelect :showAdd="false" :options="list" @click="bindClick"></uni-indexed-list-wx>
		</view>
		<view class="wx-createGroup-foot">
			<view class="wx-btn wx-btn-info" @click="createGroup">完成<text v-if="select.length>0">({{select.length}})</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				select:[],
				windowTop:0
			}
		},
		mounted() {
			this.getflist()
			uni.getSystemInfo({
				success: (res)=> {
					this.windowTop=res.windowTop
				}
			});
		},
		methods: {
			createGroup(){
				var ids=[]
				for (var i = 0; i < this.select.length; i++) {
					ids.push(this.select[i].data.userId)
				}
				this.$http.request({
					url: '/group/createGroup',
					method: 'POST',
					data:JSON.stringify(ids),
					success: (res) => {
						if (res.data.code == 200) {
							uni.navigateBack({
								delta:1
							})
						}
					}
				});
			},
			bindClick(e){
				this.select=e.select
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
								if(item.userType=='normal'){
									list.push({
										name:item.nickName,
										avatar:item.portrait,
										userId:item.userId,
										chatNo:item.chatNo
									})
								}
							}
							this.list=this.$fc.sortList({list:list,key:'name'})
						}
					}
				});
			},
		},
	}
</script>

<style scoped>
	.wx-createGroup{
		display: flex;flex-direction: column;
	}
	.wx-createGroup-check{
		height: 90%;
		position: relative;
	}
	.wx-createGroup-foot{
		box-sizing: border-box;
		height: 10%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		background-color: #eee;
		padding: 24rpx;
	}
	.wx-btn {
		min-width: 200rpx;
		height: 75rpx;
		line-height: 75rpx;
		text-align: center;
		border-radius: 12rpx;
		background-color: #007AFF;
		color: #fff;
		font-size: 32rpx;
	}
	
	.wx-btn-info {
		background-color: #05C160;
	}
	
</style>
