<template>
	<view class="bgColor">
		<watermark></watermark>
		<form @submit="subform" class="remarkForm">
			<view class="remarkForm-item">
				<zmm-city-picker v-model="city"></zmm-city-picker>
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			city:'',
			// rangeCityarr: [[], []],
			form:{
				provinces:'',//省份
				city:''//城市
			},
			list:[{
				label:'男',
				value:'1'
			},{
				label:'女',
				value:'0'
			}]
		};
	},
	onLoad(e) {
		this.form.userId=e.userId
		this.city=e.provinces ? e.provinces+','+e.city : '请选择'
		this.form.provinces=e.provinces
		this.form.city=e.city
	},
	methods: {
		subform(e) {
			var rules = {
				gender: {
					rules: [{
						checkType: "required",
						errorMsg: "请填写内容"
					}]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var city=this.city.split(',')
			formData.provinces=city[0]
			formData.city=city[1]
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			if (checkRes) {
				this.$http.request({
					url: '/my/editCity',
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
	.remarkForm{
		// padding:24rpx 44rpx;
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
