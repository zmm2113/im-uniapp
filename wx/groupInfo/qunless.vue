<template>
	<view class="wx-createGroup" :style="'height: calc(100vh - ' + windowTop + 'px)'">
		<watermark></watermark>
		<view class="wx-createGroup-check"><uni-indexed-list-wx showSelect :showAdd="false" :options="list" @click="bindClick"></uni-indexed-list-wx></view>
		<view class="wx-createGroup-foot">
			<view class="wx-btn wx-btn-error" @click="createGroup">
				删除 
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
	computed:{
		userInfo(){
			return this.$store.state.userInfo
		}
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
				ids.push(this.select[i].data.userId);
			}
			var formData = {
				groupId: this.groupId,
				list: ids
			};
			this.$http.request({
				url: '/group/kickedGroup',
				method: 'POST',
				data: JSON.stringify(formData),
				success: res => {
					if (res.data.code == 200) {
						uni.navigateBack({
							delta: 1
						}).then(res=>{
							uni.showToast({
								title:'已删除',
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
						var data = this.detail.user;
						var list = [];
						for (var i = 0; i < data.length; i++) {
							var item = data[i];
							if (item.userId !== this.userInfo.userId) {
								list.push({
									name: item.nickName,
									avatar: item.portrait,
									userId: item.userId
								});
							}
						}
						this.list = this.$fc.sortList({ list: list, key: 'name' });
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
.wx-btn-error{
	background-color: #FF5A5F;
}
</style>
