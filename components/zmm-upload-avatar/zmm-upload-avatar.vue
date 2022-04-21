<template>
	<view>
		<image class="zmm-upload-avatar" :src="modelValue" :style="{ width: imgSize + 'rpx', height: imgSize + 'rpx', 'border-radius': imgRadius + 'rpx' }" mode="aspectFill" @click="selectImage"></image>
	</view>
</template>

<script>
import http from '@/common/request.js';
export default {
	name: 'zmm-upload-avatar',
	emits: ['update:modelValue','change'],
	props: {
		modelValue: {
			type: [String]
		},
		imgSize: {
			//图片大小
			type: Number,
			default: 120
		},
		imgRadius: {
			//图片圆角
			type: Number,
			default: 12
		},
		disabled: {
			type: Boolean,
			default: false
		},
		action: {
			//后台上传接口
			type: String,
			default: http.baseUrl + '/file/upload'
		},
		formData: {
			//上传所附带数据
			type: Object
		},
		header: {
			//自定义头
			type: Object,
			default() {
				return {
					Authorization: uni.getStorageSync('Authorization'),
					device: uni.getStorageSync('device'),
					version: uni.getStorageSync('version')
				};
			}
		},
		fileKey: {
			//后端接受的filekey
			type: String,
			default: 'file'
		}
	},
	data() {
		return {
			isDestroyed: false,
			showUploadProgress: true
		};
	},
	mounted: function() {},
	destroyed: function() {
		this.isDestroyed = true;
	},
	computed: {},
	methods: {
		selectImage: function() {
			var _self = this;
			uni.chooseImage({
				count: 1,
				sourceType: ['album', 'camera'],
				success: function(e) {
					var imagePathArr = e.tempFilePaths;
					//检查服务器地址是否设置，设置即表示图片要上传到服务器
					if (_self.action) {
						uni.showToast({
							title: '上传中',
							icon: 'none',
							mask: false
						});

						var remoteIndexStart = 1 - imagePathArr.length;
						var promiseWorkList = [];
						var keyname = _self.fileKey ? _self.fileKey : 'upload-images';
						var completeImages = 0;

						for (let i = 0; i < imagePathArr.length; i++) {
							promiseWorkList.push(
								new Promise((resolve, reject) => {
									let remoteUrlIndex = remoteIndexStart + i;
									uni.uploadFile({
										url: _self.action,
										fileType: 'image',
										header: _self.header,
										formData: _self.formData,
										filePath: imagePathArr[i],
										name: keyname,
										success: function(res) {
											if (res.statusCode === 200) {
												if (_self.isDestroyed) {
													return;
												}

												completeImages++;

												if (_self.showUploadProgress) {
													uni.showToast({
														title: '上传中',
														icon: 'none',
														mask: false,
														duration: 500
													});
												}
												// console.log('success to upload image: ' + res.data)
												resolve(res.data);
											} else {
												console.log('fail to upload image:' + res.data);
												reject('fail to upload image:' + remoteUrlIndex);
											}
										},
										fail: function(res) {
											uni.showToast({
												title: '上传失败请检查网络',
												icon: 'none'
											});
											console.log('fail to upload image:' + res);
											reject('fail to upload image:' + remoteUrlIndex);
										}
									});
								})
							);
						}
						Promise.all(promiseWorkList).then(result => {
							if (_self.isDestroyed) {
								return;
							}
							for (let i = 0; i < result.length; i++) {
								var resItem = JSON.parse(result[i]);
								_self.$emit('update:modelValue', resItem.data.fullPath);
								_self.$emit('change', resItem.data.fullPath);
							}
						});
					} else {
						_self.$emit('update:modelValue', '../../static/img/avatar/avatar2.jpg');
						_self.$emit('change', '../../static/img/avatar/avatar2.jpg');
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.zmm-upload-avatar {
}
</style>
