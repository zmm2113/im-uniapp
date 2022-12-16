<template>
	<view class="zmm-upload-image" v-if="show">
		<zmm-upload-image-drag :key="key" :rowNum="rows" :imgRadius="imgRadius" :imgSize="imgSize" :imgPadding="imgPadding" :imgList="fileList" @deleteImage="deleteImage" @itemclick="itemclick">
			<view v-if="showAdd && fileList.length < limit" @tap="chooseTap" :style="{ width: imgSize + 'rpx', height: imgSize + 'rpx',padding:imgPadding+'rpx' }" class="zmm-upload-image-item-slot">
				<view class="zmm-upload-image-item-slotIcon">
					<uni-icons type="plusempty" color="#6E6E6E" size="24" />
				</view>
			</view>
		</zmm-upload-image-drag>
	</view>
</template>

<script>
import zmmUploadImageDrag from './zmm-upload-image-drag.vue';
import http from '@/common/request.js';
export default {
	components: {
		zmmUploadImageDrag
	},
	name: 'zmm-upload-image',
	emits: ['update:modelValue', 'deleteImage','allComplete','oneComplete'],
	props: {
		modelValue: {
			type: [Array]
		},
		chooseType:{
			type:String,
			default:'chooseImage'//chooseImage图片 chooseVideo视频 chooseMedia图片或视频
		},
		imgSize: {
			//图片大小
			type: Number,
			default: 214
		},
		imgPadding: {
			//图片间距
			type: Number,
			default: 6
		},
		imgRadius: {
			//图片圆角
			type: Number,
			default: 4
		},
		fileList: {
			//图片数据
			type: Array,
			default(){
				return []
			}
		},
		rowNumber: {
			//一行多少个图片
			type: Number,
			default: 3
		},
		showAdd: {
			//增加按钮
			type: Boolean,
			default: true
		},
		show: {
			//是否显示
			type: Boolean,
			default: true
		},
		fileAction: {
			//后台文件上传接口
			type: String,
			default: http.baseUrl + '/file/upload'
		},
		videoAction: {
			//后台上传接口
			type: String,
			default: http.baseUrl + '/file/uploadVideo'
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
		limit: {
			//图片数量
			type: Number,
			default: 9
		},
		fileKey: {
			//后端接受的filekey
			type: String,
			default: 'file'
		}
	},
	data() {
		return {
			key:0,
			isDestroyed: false,
			showUploadProgress:true
		};
	},
	watch: {
		modelValue(val) {
			console.log(val);
		},
		fileList(e){
			// console.log('变化了list')
			this.key++
		},
		rows(e){
			this.key++
		}
		// fileList: {
		// 	deep: true,//深度监听可见听对象中的元素变化例:obj.id
		// 	immediate:false,//在进入页面时，第一次绑定值，不会立刻执行监听，只有数据发生改变才会执行handler中的操作
		// 	handler(val) {//watch事件
		// 		console.log('变化了list')
		// 		this.key++
		// 	}
		// }
	},
	mounted: function() {},
	destroyed: function() {
		this.isDestroyed = true;
	},
	computed: {
		rows() {
			var buzhu=this.showAdd && this.fileList.length < this.limit ? 1 : 0;
			var rows=Math.ceil((this.fileList.length+buzhu) / this.rowNumber);
			return rows
		}
	},
	methods: {
		itemclick(e,i){
			if(!e.videoUrl){
				var imgs=[]
				for (var i = 0; i < this.fileList.length; i++) {
					var item=this.fileList[i]
					if(!item.videoUrl){
						imgs.push(item.url)
					}
				}
				this.previewImage(imgs,i)
			}else{
				this.$fc.plusDownload({onlinePath:e.videoUrl}).then(res=>{
					this.$fc.plusOpenFile({filePath:res})
				})
			}
		},
		chooseTap(){
			switch (this.chooseType){
				case 'chooseImage':
				this.selectImage()
					break;
				case 'chooseVideo':
				this.selectVideo()
					break;
				case 'chooseMedia':
				uni.showActionSheet({
					itemList: ['图片', '视频'],
					success: (res) => {
						switch (res.tapIndex){
							case 0:
							this.selectImage()
								break;
							case 1:
							this.selectVideo()
								break;
							default:
								break;
						}
					}
				});
					break;
				default:
					break;
			}
		},
		selectImage: function() {
			var _self = this;
			if (!_self.fileList) {
				_self.fileList = [];
			}
			uni.chooseImage({
				count: _self.limit ? _self.limit - _self.fileList.length : 999,
				sourceType: ['album', 'camera'],
				sizeType:['original','compressed'],
				success: function(e) {
					var imagePathArr = e.tempFilePaths;
					//如果设置了limit限制，在web上count参数无效，这里做判断控制选择的数量是否合要求
					//在非微信小程序里，虽然可以选多张，但选择的结果会被截掉
					//在app里，会自动做选择数量的限制
					if (_self.limit) {
						var availableImageNumber = _self.limit - _self.fileList.length;
						if (availableImageNumber < imagePathArr.length) {
							uni.showToast({
								title: '图片总数限制为' + _self.limit + '张，当前还可以选' + availableImageNumber + '张',
								icon: 'none',
								mask: false,
								duration: 2000
							});
							return;
						}
					}

					//检查服务器地址是否设置，设置即表示图片要上传到服务器
					if (_self.fileAction) {
						uni.showToast({
							title: '上传进度：0/' + imagePathArr.length,
							icon: 'none',
							mask: false
						});

						var remoteIndexStart = _self.fileList.length - imagePathArr.length;
						var promiseWorkList = [];
						var keyname = _self.fileKey ? _self.fileKey : 'upload-images';
						var completeImages = 0;

						for (let i = 0; i < imagePathArr.length; i++) {
							promiseWorkList.push(
								new Promise((resolve, reject) => {
									let remoteUrlIndex = remoteIndexStart + i;
									uni.uploadFile({
										url: _self.fileAction,
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
														title: '上传进度：' + completeImages + '/' + imagePathArr.length,
														icon: 'none',
														mask: false,
														duration: 500
													});
												}
												// console.log('success to upload image: ' + res.data)
												var resItem=JSON.parse(res.data)
												_self.$emit('oneComplete', {
													name: resItem.data.fileName,
													url: resItem.data.fullPath,
													type:'IMAGE'
												},_self.chooseType);
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
							var fresult=[]
							for (let i = 0; i < result.length; i++) {
								var resItem=JSON.parse(result[i])
								_self.fileList.push({
									name: resItem.data.fileName,
									url: resItem.data.fullPath,
									type:'IMAGE'
								});
								fresult.push({
									name: resItem.data.fileName,
									url: resItem.data.fullPath,
									type:'IMAGE'
								})
							}
							_self.$emit('allComplete', fresult,_self.chooseType);
						});
					} else {
						var testImg='图片地址'
						for (let i = 0; i < imagePathArr.length; i++) {
							_self.fileList.push({
								name: 'avatar'+i+'.jpg',
								url: testImg
							});
						}
					}
				}
			});
		},
		selectVideo: function() {
			var _self = this;
			if (!_self.fileList) {
				_self.fileList = [];
			}
			uni.chooseVideo({
				sourceType: ['album', 'camera'],
				compressed:true,
				success: function(e) {
					if (_self.showUploadProgress) {
						uni.showLoading({
							title:'上传中...'
						})
					}
					uploadVideo(e).then(res=>{
						uni.hideLoading()
						_self.fileList.push(res);
						_self.$emit('allComplete', res ,_self.chooseType);
					})
					function uploadVideo(e){
						return new Promise((resolve, reject) => {
							uni.uploadFile({
								url: _self.videoAction,
								fileType: 'video',
								header: _self.header,
								formData: _self.formData,
								filePath: e.tempFilePath,
								name: _self.fileKey,
								success: function(res) {
									if (res.statusCode === 200) {
										if (_self.isDestroyed) {
											return;
										}
										var resItem=JSON.parse(res.data)
										var fresult={
											name: resItem.data.fileName,
											videoUrl: resItem.data.fullPath,
											url: resItem.data.screenShot,
											type:'VIDEO'
										}
										_self.$emit('oneComplete', {
											name: resItem.data.fileName,
											videoUrl: resItem.data.fullPath,
											url: resItem.data.screenShot,
											type:'VIDEO'
										},_self.chooseType);
										resolve(fresult)
									} else {
										reject(res)
									}
								},
								fail: function(res) {
									uni.showToast({
										title: '上传失败请检查网络',
										icon: 'none'
									});
									reject(res)
								}
							});
						})
					}
				}
			});
		},
		deleteImage: function(e) {
			this.$emit('deleteImage', e);
		},
		previewImage: function(arr,index) {
			uni.previewImage({
				current: index,
				indicator: 'number',
				loop: true,
				urls: arr
			});
		},
	}
};
</script>

<style scoped>
.zmm-upload-image {
	width: 100%;
	position: relative;
	/* display: flex;flex-direction: row;justify-content: center; */
}

.zmm-upload-image-list {
	/* width: 714rpx; */
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
}

.zmm-upload-image-item {
	width: 214rpx;
	height: 214rpx;
	margin: 12rpx;
	box-sizing: border-box;
	position: relative;
	border-radius: 4rpx;
}
.zmm-upload-image-item-img {
	width: 100%;
	height: 100%;
	border-radius: 4rpx;
}
.zmm-upload-image-item-slot{
	box-sizing: border-box;
}
.zmm-upload-image-item-slotIcon {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: #f7f7f7;
}

</style>
