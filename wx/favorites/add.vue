<template>
	<view class="friendsCircle-send">
		<watermark></watermark>
		<form @submit="subform">
			<view class="friendsCircle-send-item">
				<textarea class="friendsCircle-send-textarea" auto-height placeholder="建议反馈..." maxlength="200" v-model="form.content"></textarea>
			</view>
			<view class="friendsCircle-send-item">
				<zmm-upload-image v-model:fileList="form.images" :limit="9"></zmm-upload-image>
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form:{
				images:[],
				content:''
			}
		};
	},
	onLoad() {},
	methods: {
		subform(e) {
			var rules = {
				content: {
					rules: [{
						checkType: "required",
						errorMsg: "请填写内容"
					}]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			formData.images=JSON.stringify(formData.images)
			if (checkRes) {
				this.$http.request({//手机+密码
					url: '/common/feedback',
					method: 'POST',
					data:JSON.stringify(formData),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title:'提交成功',
								icon:'success'
							})
							this.form={
								images:[],
								content:''
							}
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
	.friendsCircle-send{
		padding:24rpx 46rpx;
	}
	.friendsCircle-send-item{
		margin-bottom: 24rpx;
	}
	.friendsCircle-send-textarea{
		width: 100%;
		line-height: 48rpx;
		min-height: 240rpx;
	}
</style>
