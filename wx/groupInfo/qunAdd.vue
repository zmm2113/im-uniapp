<template>
	<view class="wx-createGroup" :style="'height: calc(100vh - ' + windowTop + 'px)'">
		<watermark></watermark>
		<view class="wx-createGroup-check"><uni-indexed-list-wx showSelect :showAdd="false" :options="list" @click="bindClick"></uni-indexed-list-wx></view>
		<view class="wx-createGroup-foot">
			<view class="wx-btn wx-btn-info" @click="createGroup">
				完成
				<text v-if="select.length > 0">({{ select.length }})</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {
				user: []
			},
			list: [],
			select: [],
			windowTop: 0,
			groupId: ''
		};
	},
	onLoad(e) {
		this.groupId = e.groupId;
	},
	mounted() {
		this.getflist();
		uni.getSystemInfo({
			success: res => {
				this.windowTop = res.windowTop;
			}
		});
	},
	methods: {
		createGroup() {
			if(this.select.length<=0){
				uni.showToast({
					title:'未选择',
					icon:'none'
				})
				return
			}
			var ids = [];
			for (var i = 0; i < this.select.length; i++) {
				if(this.select[i].data.addtype=='N'){
					ids.push(this.select[i].data.userId);
				}
			}
			var formData = {
				groupId: this.groupId,
				list: ids
			};
			this.$http.request({
				url: '/group/invitationGroup',
				method: 'POST',
				data: JSON.stringify(formData),
				success: res => {
					if (res.data.code == 200) {
						uni.navigateBack({
							delta: 1
						}).then(res=>{
							uni.showToast({
								title:'已邀请',
								icon:'none'
							})
						});
					}
				}
			});
		},
		bindClick(e) {
			this.select = e.select;
		},
		getflist() {
			this.$http.request({
				url: '/group/getInfo/' + this.groupId,
				success: res => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
						this.$http.request({
							url: '/friend/friendList',
							method: 'POST',
							data:JSON.stringify({}),
							success: res => {
								if (res.data.code == 200) {
									var data = res.data.data;
									var list = [];
									for (var i = 0; i < data.length; i++) {
										var item = data[i];
										if (item.userType == 'normal') {
											list.push({
												name: item.nickName,
												avatar: item.portrait,
												userId: item.userId,
												chatNo: item.chatNo
											});
										}
									}

									var newlist=[]
									var data1=leesData(this.detail.user, list,'userId')
									var data2=leesDataRE(this.detail.user, list,'userId')
									for (var i = 0; i < data1.length; i++) {
										var item=data1[i]
										newlist.push({
											name: item.name,
											avatar: item.avatar,
											userId: item.userId,
											chatNo: item.chatNo,
											addtype:'N',
											checked: false
										})
									}
									for (var i = 0; i < data2.length; i++) {
										var item=data2[i]
										newlist.push({
											name: item.name,
											avatar: item.avatar,
											userId: item.userId,
											chatNo: item.chatNo,
											addtype:'Y',
											checked: true
										})
									}
									this.list = this.$fc.sortList({ list: newlist, key: 'name' });
									function leesData(arr1,arr2,key){//去掉相同的属性
										var result = [];
										for (var i = 0; i < arr2.length; i++) {
											var obj = arr2[i];
											var num = obj[key];
											var flag = false;
											for (var j = 0; j < arr1.length; j++) {
												var aj = arr1[j];
											var n = aj[key];
											if (n == num) {
													flag = true;
													break;
												}
											}
											if (!flag) {
												result.push(obj);
											}
										}
										return result
									}
									function leesDataRE(arr1,arr2,key){//保留相同的属性
										var result = [];
										for (var i = 0; i < arr2.length; i++) {
											var obj = arr2[i];
											var num = obj[key];
											var flag = false;
											for (var j = 0; j < arr1.length; j++) {
												var aj = arr1[j];
											var n = aj[key];
											if (n == num) {
													flag = true;
													break;
												}
											}
											if (flag) {
												result.push(obj);
											}
										}
										return result
									}
								}
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.wx-createGroup {
	display: flex;
	flex-direction: column;
}
.wx-createGroup-check {
	height: 90%;
	position: relative;
}
.wx-createGroup-foot {
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
	background-color: #007aff;
	color: #fff;
	font-size: 32rpx;
}

.wx-btn-info {
	background-color: #05c160;
}
</style>
