<template>
	<view class="bgColor" v-if="detail">
		<watermark></watermark>
		<view class="QRcode-box">
			<l-painter :board="poster" ref="painter" />
		</view>
	</view>
</template>

<script>
	import {
		name
	} from '@/manifest.json';
	export default {
		data() {
			return {
				name:name,
				QRimg:'',
				detail:'',
				portraits:[]
			}
		},
		onLoad(e) {
			this.getQrCode(e.groupId)
			this.getInfo(e.groupId)
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			},
			poster() {
				return {
					css: {
						// 根节点若无尺寸，自动获取父级节点
						width: '750rpx'
					},
					views: [{
						css: {
							background: "#ffffff",
							width: "600rpx",
							display: "block",
							margin: "15px auto",
							borderRadius: "12px",
							padding: "34rpx",
							boxShadow:"0px 0px 15px rgba(0,0,0,0.1)"
						},
						type: "view",
						views: [{
							type: "view",
							css: {
								display: "block",
								textAlign: "center"
							},
							views: [{
								css: {
									color: "#111",
									fontSize: "36rpx",
									fontWeight: "bold"
								},
								text: this.detail.group.name,
								type: "text"
							}],
						}, {
							type: "view",
							css: {
								marginTop: "24rpx",
								display: "block",
								textAlign: "center"
							},
							views: [{
								text: this.QRimg,
								type: "qrcode",
								css: {
									width: "488rpx",
									height: "488rpx"
								},
							}],
						}, {
							type: "view",
							css: {
								marginTop: "24rpx",
								display: "block",
								textAlign: "center"
							},
							views: [{
								css: {
									color: "#999",
									fontSize: "26rpx",
									textAlign: "center"
								},
								text: "请使用《" + this.name + "》扫描二维码，加入群聊",
								type: "text"
							}],
						}]
					}]
				}
			}
		},
		onShow(){},
		methods: {
			getInfo(e){//详情
				this.$http.request({
					url: '/group/getInfo/'+e,
					success: (res) => {
						if (res.data.code == 200) {
							this.detail=res.data.data
							var portraits=[]
							for (var i = 0; i < this.detail.user.length; i++) {
								portraits.push({
									url:this.detail.user[i].portrait
								})
							}
							this.portraits=portraits
						}
					}
				});
			},
			getQrCode(e){
				this.$http.request({
					url: '/group/getGroupQrCode/'+e,
					success: (res) => {
						if (res.data.code == 200) {
							this.QRimg=res.data.data
						}
					}
				});
			}
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
				uni.showActionSheet({
				    // itemList: ['换个样式', '保存到手机', '扫描二维码', '重置二维码'],
				    itemList: ['保存到手机'],
				    success: (res)=> {
						switch (res.tapIndex) {
							case 0:
								// #ifdef H5
								uni.showToast({
									icon: 'none',
									title: 'H5端长按保存'
								});
								// #endif
								// #ifndef H5
								this.$refs.painter.canvasToTempFilePath({
								  fileType: "jpg",
								  // 如果返回的是base64是无法使用 saveImageToPhotosAlbum，需要设置 pathType为url
								  pathType: 'url',
								  quality: 1,
								  success: (res) => {
									// 非H5 保存到相册
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: () => {
											uni.showToast({
												icon: 'none',
												title: '保存成功'
											});
										}
									});
								  },
								});
								// #endif
								break;
							default:
								break;
						}
				    },
				    fail: (res)=> {
				        console.log(res.errMsg);
				    }
				});
					break;
				default:
					break;
			}
		}
	}
</script>

<style scoped>
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
	.QRcode-box{
		width: 750rpx;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.QRcode-img{
		width: 600rpx;
		height: 600rpx;
	}
	.QRcode-img image{width: 100%;height: 100%;}
	.QRcode-tips{
		margin-top: 6rpx;
		font-size: 26rpx;
		color: #999;
	}
	.person-wx {
		width: 100%;
		margin-bottom: 24rpx;
	}
	
	.person-wx-user {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.person-wx-avatar {
		width: 120rpx;
		min-width: 120rpx;
		height: 120rpx;
		margin-right: 42rpx;
		border-radius: 16rpx;
	}
	
	.person-wx-user-detail {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 440rpx;
	}
	
	.person-wx-nikename {
		font-size: 32rpx;
		display: flex;flex-direction: row;align-items: center;
	}
	.person-wx-nikename .text{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 480rpx;
	}
	.person-wx-name {
		color: #666;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 12rpx;
	}
	.person-wx-nikename-icon.nan{
		color: #007AFF;
	}
	.person-wx-nikename-icon.nv{
		color: #FF5A5F;
	}
	.person-wx-nikename-icon{
		margin-right: auto;
	}
</style>
