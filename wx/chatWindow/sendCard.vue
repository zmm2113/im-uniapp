<template>
	<view class="xw-book">
		<watermark></watermark>
		<uni-indexed-list-wx :showAdd="false" :options="list" @click="bindClick"></uni-indexed-list-wx>
	</view>
</template>

<script>
	export default {
		emits:['click'],
		data() {
			return {
				list: [],
				path:''
			}
		},
		mounted() {
			this.getflist()
		},
		methods: {
			bindClick(e){
				this.$emit('click',e)
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
									chatNo:item.chatNo
								})
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
</style>
