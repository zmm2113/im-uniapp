<template>
	<view class="zfb-login-box">
		<view class="zfb-tk-login-form animate__animated animate__zoomInDown">
			<form @submit="sublogin">
				<view class="zfb-tk-item">
					<view class="zfb-login-title-box">
						<view class="zfb-login-title masked-text">{{title}}</view>
					</view>
				</view>
				<view class="zfb-tk-item">
					<view class="zfb-tk-avatar-box">
						<view class="zfb-tk-avatar" @click="openAvatarTab(1)">
							<image class="zfb-tk-avatar-img" :src="avatar" mode=""></image>
						</view>
					</view>
				</view>
				<view class="zfb-tk-item">
					<input class="zfb-tk-item-input zfb-tk-border-radius" value="" name="phone" placeholder="手机号" />
				</view>
				<view class="zfb-tk-item">
					<input class="zfb-tk-item-input zfb-tk-border-radius" value="" :password="showPassword" name="password" placeholder="密码" />
					<view class="login-form-icon login-form-seepass" @click="changePassword">
						<image src="../../static/img/l03.png" mode="" v-if="showPassword"></image>
						<image src="../../static/img/l04.png" mode="" v-else></image>
					</view>
				</view>
				<view class="zfb-tk-item">
					<button class="zfb-tk-button zfb-tk-border-radius" form-type="submit">登入</button>
				</view>
				<view class="login-agree">
					<view class="login-agree-checkd" @click="agree = !agree">
						<label for="agree">
							<checkbox id="agree" style="transform:scale(0.7)" :checked="agree" />
							<text class="login-agree-btn">我同意</text>
						</label>
					</view>
					<view class="login-agree-text" @click="goagreement()">《隐私及服务协议》</view>
				</view>
				<view style="height: 240rpx;"></view>
				<view class="zfb-tk-item">
					<view class="zfb-by" @click="copyTxt(info)">{{info}}</view>
				</view>
			</form>
		</view>
		<view class="zfb-tk-AvatarTab-box" v-show="AvatarTab!==0">
			<view @click="openAvatarTab(2)" class="zfb-tk-AvatarTab-box-maske animate__animated animate__faster" :class="[{'animate__fadeIn':AvatarTab==1},{'animate__fadeOut':AvatarTab==2}]"></view>
			<view class="zfb-tk-AvatarTab-box-c animate__animated animate__faster" :class="[{'animate__fadeInBottomLeft':AvatarTab==1},{'animate__fadeOutBottomLeft':AvatarTab==2}]">
				<view class="zfb-tk-AvatarTab-box-list" scrollable>
					<view v-for="i in 45" class="zfb-tk-AvatarTab-box-list-img" :key="i">
						<!-- #ifdef APP-NVUE -->
						<cell>
							<!-- #endif -->
							<image @click="setAvatar('../../static/img/avatar/avatar'+i+'.jpg'),openAvatarTab(2)" :src="'../../static/img/avatar/avatar'+i+'.jpg'"
							 mode=""></image>
							<!-- #ifdef APP-NVUE -->
						</cell>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPassword: true,
				agree:false,
				avatar: '../../static/img/avatar/avatar1.jpg',
				AvatarTab: 0,
				info: '微聊',
				title: '微聊',
				name: ''
			}
		},
		onLoad() {},
		methods: {
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			goagreement() {
				uni.navigateTo({
					url:'../agreement/index'
				})
			},
			setAvatar(e) {
				this.avatar = e
			},
			openAvatarTab(e) {
				this.AvatarTab = e
				if (e == 2) {
					setTimeout(() => {
						this.AvatarTab = 0
					}, 300)
				}
			},
			copyTxt(e) {
				// #ifdef H5
				return
				// #endif
				// uni.setClipboardData({
				// 	data: e,
				// 	success: function() {
				// 		uni.showToast({
				// 			title: '复制邮箱成功',
				// 			icon: 'none',
				// 			position: 'bottom'
				// 		})
				// 	}
				// });
			},
			rMathfloor(min, max) { //返回包括最大/小值
				return Math.floor(Math.random() * (max - min + 1)) + min
			},
			sublogin(e) {
				var rule = [{
					name: "phone",
					checkType: "phone",
					checkRule: "1,20000",
					errorMsg: "请先输入你的手机号"
				}];
				var formData = e.detail.value;
				var id=JSON.stringify(this.rMathfloor(10000000, 99999999))
				formData.userId = id
				formData.avatar=this.avatar
				formData.nickname=formData.phone
				var checkRes = this.$graceChecker.check(formData, rule);
				if (checkRes) {
					if (!this.agree) {
						uni.showToast({
							title: '请先同意《隐私及服务协议》',
							icon: 'none'
						});
						return;
					}
				} else {
					uni.showToast({
						title: this.$graceChecker.error,
						icon: "none",
						position: 'bottom'
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	$text:#333;
	$inputbg:#222;
	$inputcolor:#fff;
	$avatarSize:240rpx;

	.zfb-login-box {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.zfb-login-title-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 68rpx;
	}

	.zfb-login-title {
		color: $text;
		font-size: 42rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 50rpx;
		border-bottom: 2px $inputbg solid;
		padding-bottom: 6rpx;
		letter-spacing: 4rpx;
	}

	.masked-text {
		display: inline-block;
		background-image: -webkit-linear-gradient(left, #666, #000 25%, #666 50%, #000 75%, #666);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		-webkit-background-size: 200% 100%;
		-webkit-animation: masked-animation 2s infinite linear;
	}

	@-webkit-keyframes masked-animation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: -100% 0;
		}
	}

	@keyframes masked-animation {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: -100% 0;
		}
	}

	.zfb-tk-login-form {
		min-width: 500rpx;
	}

	.zfb-tk-item {
		position: relative;
		margin-bottom: 24rpx;
	}

	.zfb-tk-border-radius {
		border-radius: 44rpx;
	}

	.zfb-tk-item-input {
		color: $inputcolor;
		border: none;
		background: $inputbg;
		height: 74rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		text-align: center;
	}

	.zfb-tk-button {
		width: auto;
		line-height: 80rpx;
		outline: none;
		border: 2px $text solid;
		border-left-width: 1px;
		border-right-width: 1px;
		background: none;
		color: $text;
	}

	.zfb-tk-button:after {
		border: none;
	}

	.zfb-tk-avatar-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding-bottom: 24rpx;
	}

	.zfb-tk-avatar {
		width: $avatarSize;
		height: $avatarSize;
		border-radius: 50%;
		overflow: hidden;
		border: 2px $inputbg solid;
		box-shadow: 0px 5px 10px $inputbg;
	}

	.zfb-tk-avatar-img {
		border-radius: 50%;
		width: $avatarSize;
		height: $avatarSize;
	}

	.zfb-by {
		text-align: center;
		color: rgba(0, 0, 0, 0.15);
	}

	.zfb-tk-AvatarTab-box {}

	.zfb-tk-AvatarTab-box-maske {
		background: rgba(0, 0, 0, 0.35);
		;
		position: absolute;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
	}

	.zfb-tk-AvatarTab-box-c {
		overflow: hidden;
		border-radius: 34rpx 34rpx 0rpx 0px;
		box-shadow: 0px -5px 20px rgba(0, 0, 0, 0.2);
		width: 750rpx;
		height: 780rpx;
		background: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.zfb-tk-AvatarTab-box-list {
		overflow: auto;
		height: 692rpx;
		box-sizing: border-box;
		margin: 44rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.zfb-tk-AvatarTab-box-list .zfb-tk-AvatarTab-box-list-img {
		width: 180rpx;
		height: 180rpx;
		margin: 12rpx;
		margin-bottom: 24rpx;
	}

	.zfb-tk-AvatarTab-box-list .zfb-tk-AvatarTab-box-list-img image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
	}
	.login-agree {
		margin: 24rpx;
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
		color: #1062e2;
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
	}
	.login-form-icon image {
		width: 50rpx;
		height: 50rpx;
	}
</style>
