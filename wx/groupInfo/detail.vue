<template>
	<view class="bgColor" v-if="detail">
		<watermark></watermark>
		<view class="wxgroup-list">
			<view class="wxgroup-list-item" v-for="(v, i) in detail.user" @click="gofriend(v)" :key="i">
				<image class="wxgroup-list-img" :src="v.portrait" mode="aspectFill"></image>
				<text class="wxgroup-list-text">{{ v.nickName }}</text>
			</view>
			<view class="wxgroup-list-item" @click="qunAdd">
				<view class="wxgroup-list-icon"><view class="wxfont jia"></view></view>
			</view>
			<view class="wxgroup-list-item" @click="qunless">
				<view class="wxgroup-list-icon"><view class="wxfont jian"></view></view>
			</view>
		</view>
		<tool-list-wx :list="list3" @itemClick="itemClick3"></tool-list-wx>
		<view class="wxgroupInfo">
			<view class="xw-tool-list">
				<view class="xw-tool-list-content">
					<view class="xw-tool-item">
						<text class="xw-tool-text">消息免打扰</text>
						<switch color="#05C160" :checked="Baneddisturb" @change="switchChange($event, 'xxmdr')" style="transform:scale(0.75);" />
					</view>
				</view>
				<view class="xw-tool-list-content">
					<view class="xw-tool-item">
						<text class="xw-tool-text">置顶聊天</text>
						<switch color="#05C160" :checked="Banedtop" @change="switchChange($event, 'zdlt')" style="transform:scale(0.75);" />
					</view>
				</view>
				<view class="xw-tool-list-content">
					<view class="xw-tool-item">
						<text class="xw-tool-text">保存到通讯录</text>
						<switch color="#05C160" :checked="BanedkeepGroup" @change="switchChange($event, 'bcdtxl')" style="transform:scale(0.75);" />
					</view>
				</view>
			</view>
			<view class="xw-tool-list">
				<view class="xw-tool-list-content" v-if="detail.master == 'Y'" @click="jiesan">
					<view class="xw-tool-btn-item"><view class="xw-tool-btn-text" style="color: #FF5A5F;">解散该群</view></view>
				</view>
				<view class="xw-tool-list-content" @click="qingchu">
					<view class="xw-tool-btn-item"><view class="xw-tool-btn-text" style="color: #FF5A5F;">清空群消息</view></view>
				</view>
				<view class="xw-tool-list-content" @click="quitqun">
					<view class="xw-tool-btn-item"><view class="xw-tool-btn-text" style="color: #FF5A5F;">删除并退出</view></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {
				set: {
					top: 'N',
					keepGroup: 'N',
					disturb: 'N'
				},
				group: {
					notice: ''
				},
				user: []
			}
		};
	},
	computed: {
		list3() {
			return [
				{
					title: '群聊名称',
					path: '#'
				},
				{
					title: '群二维码',
					path: '#',
					else: [
						{
							type: 'img',
							content: '../../static/wx/t05.png'
						}
					]
				},
				{
					title: '群公告',
					path: '#',
					else: [
						{
							type: 'text',
							content: this.detail.group.notice ? this.detail.group.notice : ''
						}
					]
				}
			];
		},
		Banedtop() {
			return this.detail.set.top == 'Y' ? true : false;
		},
		BanedkeepGroup() {
			return this.detail.set.keepGroup == 'Y' ? true : false;
		},
		Baneddisturb() {
			return this.detail.set.disturb == 'Y' ? true : false;
		}
	},
	onLoad(e) {
		this.param = e.param;
	},
	onShow() {
		this.getInfo(this.param);
	},
	methods: {
		qunAdd() {
			uni.navigateTo({
				url: '../../wx/groupInfo/qunAdd?groupId=' + this.detail.group.groupId
			});
		},
		qunless() {
			uni.navigateTo({
				url: '../../wx/groupInfo/qunless?groupId=' + this.detail.group.groupId
			});
		},
		jiesan() {
			// 解散群聊
			uni.showModal({
				title: '提示',
				content: '确认解散群聊吗？',
				success: res => {
					if (res.confirm) {
						this.$http.request({
							url: '/group/removeGroup/' + this.detail.group.groupId,
							success: res => {
								if (res.data.code == 200) {
									delete this.$store.state.chatlist[this.detail.group.groupId]
									this.$store.dispatch('updateChatListInfoById',{
										userId: this.detail.group.groupId,
										data: {}
									});
									this.$store.dispatch('updateChatById', {
										userId: this.detail.group.groupId,
										data: []
									});
									uni.navigateBack({
										delta:2
									}).then(()=>{
										uni.showToast({
											title:'解散成功',
											icon:'none'
										})
									})
								}
							}
						});
					}
				}
			});
		},
		quitqun() {
			uni.showModal({
				title: '提示',
				content: '确认退出群聊吗？',
				success: res => {
					if (res.confirm) {
						this.$http.request({
							url: '/group/logoutGroup/' + this.detail.group.groupId,
							success: res => {
								if (res.data.code == 200) {
									delete this.$store.state.chatlist[this.detail.group.groupId]
									this.$store.dispatch('updateChatListInfoById',{
										userId: this.detail.group.groupId,
										data: {}
									});
									this.$store.dispatch('updateChatById', {
										userId: this.detail.group.groupId,
										data: []
									});
									uni.navigateBack({
										delta:2
									}).then(()=>{
										uni.showToast({
											title:'退出成功',
											icon:'none'
										})
									})
								}
							}
						});
					}
				}
			});
		},
		qingchu() {
			uni.showModal({
				title: '提示',
				content: '确认清除群聊消息吗？',
				success: res => {
					if (res.confirm) {
						delete this.$store.state.chatlist[this.detail.group.groupId]
						this.$store.dispatch('updateChatListInfoById',{
							userId: this.detail.group.groupId,
							data: {}
						});
						this.$store.dispatch('updateChatById', {
							userId: this.detail.group.groupId,
							data: []
						});
						uni.navigateBack({
							delta:2
						}).then(()=>{
							uni.showToast({
								title:'清除成功',
								icon:'none'
							})
						})
					}
				}
			});
		},
		gofriend(e) {
			uni.navigateTo({
				url: '../../wx/personInfo/detail?param=' + e.userId+'&source=7'
			});
		},
		switchChange(e, type) {
			var yn = e.detail.value ? 'Y' : 'N';
			var url, formData, ynText;
			switch (type) {
				case 'xxmdr':
					url = '/group/editDisturb';
					formData = {
						groupId: this.param,
						disturb: yn
					};
					ynText = e.detail.value ? '已静默消息' : '已取消静默消息';
					var data=JSON.parse(JSON.stringify(this.$store.state.chatlist[this.detail.group.groupId]))
					var ynx = data.disturb=='N' ? 'Y' : 'N';
					data.disturb=ynx
					this.$store.dispatch('updateChatListInfoById', {
						userId: this.detail.group.groupId,
						data: data
					})
					this.$store.dispatch('getChatList')
					break;
				case 'zdlt':
					url = '/group/editTop';
					formData = {
						groupId: this.param, //群组id
						top: yn
					};
					ynText = e.detail.value ? '已置顶' : '已取消置顶';
					var data=JSON.parse(JSON.stringify(this.$store.state.chatlist[this.detail.group.groupId]))
					var ynx = data.top=='N' ? 'Y' : 'N';
					data.top=ynx
					this.$store.dispatch('updateChatListInfoById', {
						userId: this.detail.group.groupId,
						data: data
					})
					this.$store.dispatch('getChatList')
					break;
				case 'bcdtxl':
					url = '/group/editKeepGroup';
					formData = {
						groupId: this.param, //群组id
						keepGroup: yn
					};
					ynText = e.detail.value ? '已保存' : '已移除';
					break;
				default:
					break;
			}
			this.$http.request({
				url: url,
				method: 'POST',
				data: JSON.stringify(formData),
				success: res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: ynText,
							icon: 'none'
						});
					}
				}
			});
		},
		itemClick3(e, i) {
			switch (i) {
				case 0:
					uni.navigateTo({
						url: 'editGroupName?groupId=' + this.detail.group.groupId + '&name=' + this.detail.group.name
					});
					break;
				case 1:
					uni.navigateTo({
						url: 'QRcode?groupId=' + this.detail.group.groupId
					});
					break;
				case 2:
					uni.navigateTo({
						url: 'editGroupNotice?groupId=' + this.detail.group.groupId + '&notice=' + this.detail.group.notice
					});
					break;
				default:
					break;
			}
		},
		getInfo(e) {
			//详情
			this.$http.request({
				url: '/group/getInfo/' + e,
				success: res => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
						uni.setNavigationBarTitle({
							title: '聊天信息(' + this.detail.user.length + ')'
						});
					}
				}
			});
		}
	}
};
</script>

<style scoped>
/* #ifdef APP-PLUS */
.bgColor {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #ededed;
	overflow: auto;
}
/* #endif */
/* #ifdef H5 */
page {
	background: #ededed;
}
/* #endif */

.xw-tool-list {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	margin-bottom: 18rpx;
}

.xw-tool-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 26rpx 24rpx;
	border-bottom: 1px #eee solid;
}
.xw-tool-list-content:nth-last-child(1) .xw-tool-item {
	border: none;
}

.xw-tool-text {
	margin-right: auto;
}

.xw-tool-btn-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 34rpx 44rpx;
	border-bottom: 1px #eee solid;
	font-weight: bold;
	color: #5f698c;
}
.wxgroup-list {
	background-color: #fff;
	padding: 24rpx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 24rpx;
}
.wxgroup-list-item {
	width: 20%;
	overflow: hidden;
	box-sizing: border-box;
	margin-top: 12rpx;
	margin-bottom: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.wxgroup-list-icon .wxfont {
	color: #999;
	font-size: 46rpx;
}
.wxgroup-list-img {
	width: 105rpx;
	height: 105rpx;
	border-radius: 12rpx;
}
.wxgroup-list-icon {
	display: flex;
	flex-direction: column;
	width: 105rpx;
	height: 105rpx;
	border-radius: 12rpx;
	align-items: center;
	justify-content: center;
	border: 1px #ddd dashed;
}
.wxgroup-list-text {
	text-align: center;
	width: 105rpx;
	font-size: 24rpx;
	color: #999;
	margin-top: 12rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.xw-tool-else .text {
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 520rpx;
}
</style>
