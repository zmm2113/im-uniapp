<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="search-friends-send">
			<form @submit="subform">
				<view class="search-friends-send-title">你需要发送验证消息，等对方通过</view>
				<view class="search-friends-send-item">
					<textarea class="search-friends-send-textarea" auto-height placeholder="请输入验证信息..." maxlength="200" v-model="form.reason"></textarea>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form:{
				userId:'',
				source:'',
				reason:''
			}
		};
	},
	onLoad(e) {
		this.form.userId=e.userId
		this.form.source=e.source
	},
	methods: {
		subform(e) {
			var rules = {
				content: {
					reason: [{
						checkType: "required",
						errorMsg: "请填写验证内容"
					}]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			if (checkRes) {
				this.$http.request({
					url: '/apply/add',
					method: 'POST',
					data:JSON.stringify(formData),
					success: (res) => {
						if (res.data.code == 200) {
							uni.navigateBack({
								delta:1
							}).then(()=>{
								uni.showToast({
									title: '发送成功',
									icon: "none",
								});
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
	/* #ifdef APP-PLUS */
	.bgColor{
	    position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    background: #EDEDED;
		overflow: auto;
	  }
	/* #endif */
	/* #ifdef H5 */
	page{
		background: #EDEDED;
	}
	/* #endif */
	.search-friends-send{
	}
	.search-friends-send-item{
		padding: 24rpx;
		margin-bottom: 24rpx;
		background-color: #fff;
	}
	.search-friends-send-textarea{
		width: 100%;
		min-height: 50rpx;
	}
	.search-friends-send-title{
		padding:12rpx 24rpx;
		color: #999;font-size: 24rpx;
	}
</style>
