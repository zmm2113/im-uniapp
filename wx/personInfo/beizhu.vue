<template>
	<view>
		<watermark></watermark>
		<form @submit="subform" class="remarkForm">
			<view class="remarkForm-item">
				<view class="remarkForm-label">备注</view>
				<input class="remarkForm-input" placeholder="添加备注" type="text" v-model="form.remark" />
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				remark: '',
				userId: ''
			}
		};
	},
	computed: {
		chatListInfo() {
			return this.$store.state.chatlist[this.form.userId];
		}
	},
	onLoad(e) {
		this.form.userId = e.userId;
		this.form.remark = e.remark;
	},
	methods: {
		subform(e) {
			var rules = {
				remark: {
					rules: [
						{
							checkType: 'required',
							errorMsg: '请填写内容'
						}
					]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			if (checkRes) {
				this.$http.request({
					url: '/friend/remark',
					method: 'POST',
					data: JSON.stringify(formData),
					success: res => {
						if (res.data.code == 200) {
							this.chatListInfo.nickName = this.form.remark;
							var ChatData=JSON.parse(JSON.stringify(this.$store.state.chatDatalist[this.form.userId]))
							ChatData.fromInfo.nickName=this.form.remark
							this.$store.dispatch('updateChatObjById', {
								userId: this.form.userId,
								data: ChatData
							})
							this.$store.dispatch('updateChatListInfoById', { userId: this.form.userId, data: this.chatListInfo });
							uni.navigateBack({
								delta: 1
							}).then(() => {
								uni.showToast({
									title: '备注成功',
									icon: 'success'
								});
							});
						}
					}
				});
			} else {
				uni.showToast({
					title: this.$zmmFormCheck.error,
					icon: 'none',
					position: 'bottom'
				});
			}
		}
	},
	onNavigationBarButtonTap(e) {
		switch (e.index) {
			case 0:
				this.subform();
				break;
			default:
				break;
		}
	}
};
</script>

<style scoped lang="scss">
.remarkForm {
	padding: 24rpx 44rpx;
	display: flex;
	flex-direction: column;
}
.remarkForm-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 24rpx;
}
.remarkForm-textarea {
	width: 100%;
	line-height: 48rpx;
	min-height: 240rpx;
}
.remarkForm-label {
	font-size: 26rpx;
	color: #5c5c5c;
	margin-bottom: 15rpx;
}
.remarkForm-input {
	border-radius: 12rpx;
	background-color: #f7f7f7;
	height: 110rpx;
	line-height: 110rpx;
	padding: 0 34rpx;
}
</style>
