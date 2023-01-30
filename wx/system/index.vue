<template>
	<view class="bgColor">
		<watermark></watermark>
		<tool-list-wx :list="list2" @onlongpress="onlongpress" @itemClick="itemClick0"></tool-list-wx>
		<tool-list-wx :list="list3" @itemClick="itemClick"></tool-list-wx>
		<tool-list-wx :list="list4" @itemClick="itemClick2"></tool-list-wx>
		<view class="xw-tool-list">
			<view class="xw-tool-list-content">
				<view class="xw-tool-btn-item" @click="loginOut">
					<view class="xw-tool-btn-text" style="color: #FF5A5F;">退出登录</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		versionName
	} from '@/manifest.json'
	// #ifdef APP-PLUS
	import appUpgrade from '@/common/appUpgrade.js';
	const TUICalling = uni.requireNativePlugin("TUICallingUniPlugin-TUICallingModule");
	// #endif
	export default {
		data() {
			return {
				version:versionName,
				list2:[{
					title: '建议反馈',
					path: '../feedback/index'
				},{
					title: '隐私及服务协议',
					path: '#'
				},{
					title: '关于',
					path: '#',
					hideRight:true,
					else:[{
						type: 'text',
						content: '微聊 v'+versionName
					}]
				},{
					title: '开源',
					path: '#',
					hideRight:true,
					else:[{
						type: 'text',
						content: '考拉开源，学习请加Q群535099683'
					}]
				}],
				list3:[{
					title: '修改密码',
					path: '#'
				}],
				list4:[{
					title: '清空聊天记录',
					path: '#'
				}],
			}
		},
		computed: {
			userinfo() {
				return this.$store.state.userInfo
			}
		},
		onLoad() {
			console.log()
		},
		methods: {
			copyText(e){
				uni.setClipboardData({
					data: e,
					success: function() {
						uni.showToast({
							title: 'QQ群号复制成功',
							icon: 'none',
							position: 'bottom'
						})
					}
				});
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
			onlongpress(e,i){
				switch (i){
					case 2:
					// #ifdef APP-PLUS
					//升级检测
					this.$http.request({
						url: '/common/getVersion',
						success: (res) => {
							appUpgrade.init({
								titleText: '覆盖安装'+res.data.data.version,
								packageUrl:res.data.data.url,
								content: res.data.data.content,
								cancelText:'取消',
								confirmText:'安装'
							});
							appUpgrade.show();
						}
					});
					// #endif
						break;
					default:
						break;
				}
			},
			loginOut(){
				uni.reLaunch({
					url:'../../pages/wxindex/index'
				}).then(res=>{
					uni.removeStorageSync('Authorization')
					// 退出登录
					this.$http.request({
						url: '/my/logout',
						success: (res) => {}
					});
					// #ifdef H5
					this.$socketTask.socketTaskClose()
					// #endif
					// #ifdef APP-PLUS
					TUICalling.logout((res) => {
					    console.log(JSON.stringify(res))
					})
					// #endif
				})
			},
			itemClick0(e,i){
				switch (i){
					case 1:
					this.goagreement()
					break;
					case 3:
					this.copyText('535099683')
					break;
					case 2:
					// #ifdef H5
					this.$http.request({
						url: '/common/getVersion',
						success: (res) => {
							if(res.data.data.upgrade=='Y'){
								console.log(
									`%c 有新版本 `+res.data.data.version,
									'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
								)
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					//升级检测
					uni.getSystemInfo({
						success: (res)=> {
							uni.setStorageSync('device', res.platform);
							plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=> {
								uni.setStorageSync('version', widgetInfo.version);
								this.$http.request({
									url: '/common/getVersion',
									success: (res) => {
										if(res.data.data.upgrade=='Y'){
											appUpgrade.init({
												titleText: '版本更新'+res.data.data.version,
												packageUrl:res.data.data.url,
												content: res.data.data.content,
												forceUpgrade:res.data.data.forceUpgrade=='Y' ? true : false
											});
											appUpgrade.show();
										}
									}
								});
							});
						}
					});
					// #endif
						break;
					default:
						break;
				}
			},
			itemClick(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'../personDetail/editPass'
					})
						break;
					default:
						break;
				}
			},
			itemClick2(e,i){
				switch (i){
					case 0:
					uni.showModal({
						title: '警告',
						content: '是否确认清空聊天信息',
						success: (res)=> {
							if (res.confirm) {
								// 不清理的key
								var whiteList=['Authorization','device','version']
								const res = uni.getStorageInfoSync();
								var removeList=res.keys.filter(item=>!whiteList.includes(item))
								for (var i = 0; i < removeList.length; i++) {
									uni.removeStorageSync(removeList[i]);
								}
								uni.showToast({
									title:'清除成功',
									icon:'none'
								})
							} else if (res.cancel) {
								uni.getStorageInfo({
								    success: function (res) {
								        console.log(res);
								    }
								});
							}
						}
					});
						break;
					default:
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
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
	.xw-tool-list {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		margin-bottom: 18rpx;
	}
	
	.xw-tool-btn-item{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 34rpx 44rpx;
		border-bottom: 1px #eee solid;
		font-weight: bold;
		color: #5F698C;
	}
	
</style>
