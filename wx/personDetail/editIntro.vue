<template>
	<view>
		<watermark></watermark>
		<form @submit="subform" class="remarkForm">
			<view class="remarkForm-item">
				<view class="remarkForm-label">个性签名 (发表你的个性签名吧)</view>
				<input class="remarkForm-input" placeholder="个性签名" type="text" v-model="form.intro" />
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form:{
				intro:'',
				userId:''
			}
		};
	},
	onLoad(e) {
		this.form.userId=e.userId
		this.form.intro=e.intro
	},
	methods: {
		subform(e) {
			var rules = {
				intro: {
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
					url: '/my/editIntro',
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
								this.$store.dispatch('get_UserInfo')
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
