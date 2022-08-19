<template>
	<view>
		<watermark></watermark>
		<form @submit="subform" class="remarkForm">
			<view class="remarkForm-item">
				<view class="remarkForm-label">原密码</view>
				<input class="remarkForm-input" placeholder="请填写原密码" type="password" v-model="form.password" />
			</view>
			<view class="remarkForm-item">
				<view class="remarkForm-label">新密码 (密码最长8-16位且由数字与字母组合)</view>
				<input class="remarkForm-input" placeholder="请填写新密码" type="password" v-model="form.pwd" />
			</view>
			<view class="remarkForm-item">
				<view class="remarkForm-label">确认密码</view>
				<input class="remarkForm-input" placeholder="请再次填写新密码" type="password" v-model="form.repwd" />
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form:{
				password:'',
				pwd:'',
				repwd:''
			}
		};
	},
	onLoad(e) {
		
	},
	methods: {
		subform(e) {
			var rules = {
				password: {
					rules: [{
						checkType: "required",
						errorMsg: "请填写原密码"
					}]
				},
				pwd: {
					rules: [{
						checkType: "required",
						errorMsg: "请填写新密码"
					},{
						checkType: "reg",
						checkRule:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
						errorMsg: "密码8-16位,由数字与字母组成"
					}]
				},
				repwd: {
					rules: [{
						checkType: "required",
						errorMsg: "请再次填写新密码"
					},{
						checkType: "same",
						checkRule:"pwd",
						errorMsg: "两次密码不一致"
					}]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			formData.password=this.$md5.hex_md5(formData.password)
			formData.pwd=this.$md5.hex_md5(formData.pwd)
			if (checkRes) {
				this.$http.request({
					url: '/my/editPass',
					method: 'POST',
					data:JSON.stringify(formData),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title:'修改成功',
								icon:'success'
							})
							this.form={
								password:'',
								pwd:'',
								repwd:''
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
