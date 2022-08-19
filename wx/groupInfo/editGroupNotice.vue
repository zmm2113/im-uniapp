<template>
	<view>
		<watermark></watermark>
		<form @submit="subform" class="remarkForm">
			<view class="remarkForm-item">
				<view class="remarkForm-label">群公告</view>
				<input class="remarkForm-input" placeholder="修改群公告" type="text" v-model="form.notice" />
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form:{
				groupId:'',
				notice:''
			}
		};
	},
	onLoad(e) {
		this.form.groupId=e.groupId
		this.form.notice=e.notice
	},
	methods: {
		subform(e) {
			var rules = {
				notice: {
					rules: [{
						checkType: "required",
						errorMsg: "请填写内容"
					}]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			if (checkRes) {
				this.$http.request({
					url: '/group/editGroupNotice',
					method: 'POST',
					data:JSON.stringify(formData),
					success: (res) => {
						if (res.data.code == 200) {
							uni.navigateBack({
								delta:1
							}).then(()=>{
								uni.showToast({
									title:'修改成功',
									icon:'success'
								})
							})
						}
					}
				});
			} else {
				uni.showToast({
					title: this.$zmmFormCheck.error,
					icon: "none",
					position: 'bottom'
				});
			}
		}
	},
	onNavigationBarButtonTap(e) {
		switch (e.index) {
			case 0:
				this.subform()
				break;
			default:
				break;
		}
	},
};
</script>

<style scoped lang="scss">
	.remarkForm{
		padding:24rpx 44rpx;
		display: flex;flex-direction: column;
	}
	.remarkForm-item{
		display: flex;flex-direction: column;
		margin-bottom: 24rpx;
	}
	.remarkForm-textarea{
		width: 100%;
		line-height: 48rpx;
		min-height: 240rpx;
	}
	.remarkForm-label{font-size: 26rpx;color: #5C5C5C;margin-bottom: 15rpx;}
	.remarkForm-input{
		border-radius: 12rpx;
		background-color: #F7F7F7;
		height: 110rpx;
		line-height: 110rpx;
		padding:0 34rpx;
	}
</style>
