<template>
	<view class="wx-login">
		<watermark></watermark>
		<view class="wx-login-title">手机号注册</view>
		<view class="xw-login-form">
			<form @submit="sublogin">
				<view class="xw-login-form-item">
					<view class="xw-login-form-label">手机号</view>
					<input class="xw-login-form-input" maxlength="11" placeholder="请填写手机号" type="text" name="phone" v-model="phone" />
					<view class="login-form-icon login-form-seepass" @click="phone=''" v-if="phone.length>0">
						<uni-icons type="clear" size="26" color="#B9CCE0"></uni-icons>
					</view>
				</view>
				<view class="xw-login-form-item">
					<view class="xw-login-form-label">验证码</view>
					<input class="xw-login-form-input" placeholder="请填写验证码" v-model="code" name="code" type="text" />
					<view class="wx-btn wx-btn-info" @click="getMsgCode()" v-if="!loading">获取验证码</view>
					<view class="wx-btn wx-btn-info" v-else>{{time}}秒后重试</view>
				</view>
				<view class="xw-login-form-item">
					<view class="xw-login-form-label">密码</view>
					<input class="xw-login-form-input" placeholder="请输入密码" name="password" :password="showPassword"
						type="text" value="" />
					<view class="login-form-icon login-form-seepass" @click="changePassword">
						<image src="../../static/img/l03.png" mode="aspectFill" v-if="showPassword"></image>
						<image src="../../static/img/l04.png" mode="aspectFill" v-else></image>
					</view>
				</view>
				<view class="xw-login-form-item">
					<view class="xw-login-form-label">昵称</view>
					<input class="xw-login-form-input" placeholder="请输入你的昵称" type="text" name="nickName" value="" />
				</view>
				<text class="xw-login-form-code" @click="goLogin">已注册，去登录</text>
				<button class="wx-btn wx-btn-info xw-login-form-btn" form-type="submit">注册</button>
				<view class="login-agree">
					<view class="login-agree-checkd" @click="agree = !agree">
						<label for="agree">
							<checkbox id="agree" style="transform:scale(0.7)" :checked="agree" />
							<text class="login-agree-btn">已阅读并同意</text>
						</label>
					</view>
					<view class="login-agree-text" @click="goagreement()">《隐私及服务协议》</view>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code:'',
				loading: false,
				timer: null,
				time: 60,
				logintype: 0,
				phone: '',
				cid: '',
				showPassword: true,
				agree: false,
			}
		},
		onLoad() {
		},
		methods: {
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			goLogin(){
				uni.navigateTo({
					url: '../login/index'
				})
			},
			goagreement() {
				// uni.navigateTo({//本地协议
				// 	url: '../../pages/agreement/index?name=微聊'
				// })
				this.$http.request({//在线协议
					url: '/common/getAgreement',
					success: (res) => {
						if (res.data.code == 200) {
							// #ifdef H5
							window.open(res.data.data)
							// #endif
							// #ifdef APP-PLUS
							this.$fc.openWebView(res.data.data)
							// #endif
						}
					}
				});
			},
			getMsgCode() {
				var reg = /^1[0-9]{10,10}$/;
				if(!this.phone||!reg.test(this.phone)){
					uni.showToast({
						title:'请输入正确的手机号',
						icon:'none'
					})
					return
				}
				this.loading = true
				this.timer = setInterval(() => {
					this.time--
					if (this.time <= 0) {
						clearInterval(this.timer)
						this.loading = false
						this.time = 60
					}
				}, 1000)
				var formData={
					phone:this.phone,
					type:'1'//注册
				}
				this.$http.request({
					url: '/auth/sendCode',
					method: 'POST',
					data:JSON.stringify(formData),
					success: (res) => {
						if (res.data.code == 200) {
							// todo验证码
							this.code=res.data.data.code
							uni.showToast({
								title:'验证码已发送至你的手机',
								icon:'none'
							})
						}
					}
				});
			},
			rMathfloor(min, max) { //返回包括最大/小值
				return Math.floor(Math.random() * (max - min + 1)) + min
			},
			sublogin(e) {
				var rules = {
					phone: {
						rules: [{
							checkType: "required",
							errorMsg: "请填写手机号码"
						}, {
							checkType: "phone",
							errorMsg: "请填写正确的手机号码"
						}]
					},
					password: {
						rules: [{
							checkType: "required",
							errorMsg: "请输入密码"
						}, {
							checkType: "string",
							checkRule: "8,20",
							errorMsg: "密码至少输入8-20位"
						}]
					},
					nickName: {
						rules: [{
							checkType: "required",
							errorMsg: "请输入昵称"
						}, {
							checkType: "string",
							checkRule: "1,20",
							errorMsg: "昵称至少输入1-20位"
						}]
					},
					code: {
						rules: [{
							checkType: "required",
							errorMsg: "请输入验证码"
						}]
					}
				};
				var formData = e.detail.value;
				var checkRes = this.$zmmFormCheck.check(formData, rules);
				formData.password=this.$md5.hex_md5(formData.password)
				if (checkRes) {
					if (!this.agree) {
						uni.showToast({
							title: '请先同意《隐私及服务协议》',
							icon: 'none'
						});
						return;
					}
					this.$http.request({
						url: '/auth/register',
						method: 'POST',
						data:JSON.stringify(formData),
						success: (res) => {
							if (res.data.code == 200) {
								uni.showToast({
									title:'注册成功',
									complete() {
										setTimeout(()=>{
											uni.redirectTo({
												url:'/wx/login/index'
											})
										},1500)
									}
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wx-login-title {
		text-align: center;
		padding-top: 120rpx;
		font-size: 42rpx;
		padding-bottom: 24rpx;
	}

	.xw-login-form {
		padding: 34rpx;
	}

	.xw-login-form-item {
		position: relative;
		padding: 0 12rpx;
		border-bottom: 1px #eee solid;
		display: flex;
		flex-direction: row;
		align-items: center;
		line-height: 100rpx;
		height: 100rpx;
	}

	.xw-login-form-label {
		width: 160rpx;
		min-width: 160rpx;
	}

	.xw-login-form-input {}

	.login-agree {
		margin-top: 34rpx;
		justify-content: center;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.login-agree-text,
	.login-agree-btn {
		font-size: 24rpx;
		color: #222;
	}

	.login-agree-text {
		color: #8295a5;
	}

	.login-form-icon {
		width: 50rpx;
		height: 50rpx;
	}

	.login-form-seepass {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.login-form-icon image {
		float: left;
		width: 50rpx;
		height: 50rpx;
	}

	.xw-login-form-code {
		padding: 0 12rpx;
		height: 100rpx;
		line-height: 100rpx;
		color: #8295a5;
	}

	.wx-btn {
		min-width: 200rpx;
		height: 75rpx;
		line-height: 75rpx;
		text-align: center;
		border-radius: 12rpx;
		background-color: #007AFF;
		color: #fff;
		font-size: 32rpx;
	}

	.wx-btn-info {
		background-color: #05C160;
	}

	.xw-login-form-btn {
		width: 300rpx;
		margin-top: 120rpx;
	}
</style>
