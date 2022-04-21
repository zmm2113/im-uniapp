<template>
	<view class="friendsCircle-top" :class="{ 'friendsCircle-top-opend': CircleTop, 'friendsCircle-top-type-img': cover.type == 'img' }" :key="ikey">
		<view style="width: 100%;height: 100%;" v-if="cover.type == 'img'">
			<image class="friendsCircle-top-img" @click="changeCircleTop" :src="cover.url" mode="aspectFill"></image>
			<view class="friendsCircle-top-post" @click="changePoster" v-if="showChangePoster">
				<view class="wxfont tupian"></view>
				<text class="text">换封面</text>
			</view>
			<view class="friendsCircle-top-information" @click="userClick" v-if="userInfo">
				<view class="friendsCircle-top-information-user">
					<view class="friendsCircle-top-information-nikeName">{{userInfo.nickName}}</view>
					<image class="friendsCircle-top-information-avatar" :src="userInfo.portrait" mode="aspectFill"></image>
				</view>
				<view class="friendsCircle-top-information-signature">{{userInfo.intro}}</view>
			</view>
		</view>
		<video v-else class="friendsCircle-top-video" id="videodemo" ref="videodemo" :key="vkey" :autoplay="false" :src="cover.url" :controls="false" :loop="true" :show-center-play-btn="false" object-fit="cover" muted>
			<cover-view class="friendsCircle-top-video-model-img-box"><cover-image class="friendsCircle-top-video-model-img" :src="cover.screenShot"></cover-image></cover-view>
			<cover-view class="friendsCircle-top-video-model" @click="changeCircleTop"></cover-view>
			<cover-view class="friendsCircle-top-post" @click="changePoster" v-if="showChangePoster">
				<cover-image @click="changePoster" class="friendsCircle-top-post-img" src="../../static/img/f01.png"></cover-image>
				<cover-view @click="changePoster" class="text">换封面</cover-view>
			</cover-view>
			<cover-view class="friendsCircle-top-information" @click="userClick" v-if="userInfo">
				<cover-view class="friendsCircle-top-information-user">
					<cover-view class="friendsCircle-top-information-nikeName">{{userInfo.nickName}}</cover-view>
					<cover-image class="friendsCircle-top-information-avatar" :src="userInfo.portrait" mode="aspectFill"></cover-image>
				</cover-view>
				<cover-view class="friendsCircle-top-information-signature">{{userInfo.intro}}</cover-view>
			</cover-view>
		</video>
	</view>
</template>

<script>
export default {
	emits:['userClick'],
	data() {
		return {
			CircleTop: false,
			vkey: 0,
			ikey:0,
			videodemo: null
		};
	},
	props:{
		cover:{
			type:Object,
			default(){
				return{
					type:'img',
					name:'',
					url:''
				}
			}
		},
		userInfo:{
			type:[Object,String]
		},
		showChangePoster:{
			type:[Boolean],
			default:true
		},
	},
	watch:{
		cover(v){
			this.ikey++
			this.vkey++;
		}
	},
	methods: {
		userClick(){//前往个人朋友圈
			this.$emit('userClick',this.cover,this.userInfo)
		},
		changeCircleTop() {//顶部预览
			this.CircleTop = !this.CircleTop;
			if(this.type=='img'){
				return
			}
			this.videodemo = uni.createVideoContext('videodemo', this);
			this.$nextTick(() => {
				setTimeout(() => {
					this.vkey++;
					this.$nextTick(() => {
						if (this.CircleTop) {
							this.videodemo.seek(0);
							this.videodemo.play();
						} else {
							this.videodemo.pause();
							this.videodemo.seek(0);
						}
					});
				}, 105);
			});
		},
		updateCover(formdata){
			this.$http.request({
				url: '/topic/editCover',
				method: 'POST',
				data:JSON.stringify({
					cover:JSON.stringify(formdata)
				}),
				success: (res) => {
					if (res.data.code == 200) {
						this.$store.dispatch('get_UserInfo')
						this.changeCircleTop()
					}
				}
			});
		},
		changePoster() {//修改封面
			uni.showActionSheet({
			    // itemList: ['图片封面', '视频封面'],
			    itemList: ['图片封面'],
			    success: (res) => {
					switch (res.tapIndex){
						case 0:
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album','camera'], //从相册选择
								success: (res) => {
									uni.showLoading({
										title:'上传中'
									})
									this.$http.uploadFile({
										url: '/file/upload',
										filePath: res.tempFilePaths[0],
										name: 'file',
										fileType: 'image',
										success: (res) => {
											var data=JSON.parse(res.data)
											if (data.code == 200) {
												var formdata={
													type:'img',
													name:data.data.fileName,
													url:data.data.fullPath
												}
												this.updateCover(formdata)
											}
										}
									})
								}
							});
							break;
						case 1:
							uni.chooseVideo({
								sourceType: ['camera', 'album'],
								success: (res) => {
									uni.showLoading({
										title:'上传中'
									})
									this.$http.uploadFile({
										url: '/file/uploadVideo',
										filePath: res.tempFilePath,
										name: 'file',
										fileType: 'video',
										success: (res) => {
											var data=JSON.parse(res.data)
											if (data.code == 200) {
												var formdata={
													type:'video',
													name:data.data.fileName,
													url:data.data.fullPath,
													screenShot:data.data.screenShot
												}
												this.updateCover(formdata)
											}
										}
									})
								}
							});
							break;
						default:
							break;
					}
			    },
			    fail: function (res) {
			        console.log(res.errMsg);
			    }
			});
		},
	},
};
</script>

<style scoped lang="scss">
	.friendsCircle-top{
		transition: all 0.1s;
		width: 750rpx;
		height: 590rpx;
		position: relative;
		background-image: linear-gradient( 135deg, #9708CC 10%, #43CBFF 100%);
	}
	.friendsCircle-top-type-img{
		transition: all 0.3s;
	}
	.friendsCircle-top-img{
		width: 100%;
		height: 100%;
	}
	.friendsCircle-top-opend{
		height: 80vh;
	}
	.friendsCircle-top-post-img{
		width: 40rpx;
		height: 40rpx;
		margin: 0 auto;
	}
	.friendsCircle-top-post{
		text-align: center;
		z-index:99;
		position: absolute;
		bottom: 24rpx;
		right: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		display: none;
	}
	.friendsCircle-top-post .tupian{
		color: #f5f5f5;
		font-size: 38rpx;
	}
	.friendsCircle-top-post .text{
		font-size: 18rpx;
		color: #f5f5f5;
	}
	.friendsCircle-top-video-model-img-box{
		position: absolute;
		width: 100%;
		height: 80vh;
		bottom: 0;
		left: 0;
		z-index: 2;
	}
	.friendsCircle-top-video-model-img{
		width: 100%;
		height: 100%;
	}
	.friendsCircle-top-video-model{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 2;
		// background-color: rgba(255,0,0,0.3);
	}
	.friendsCircle-top-opend .friendsCircle-top-post{
		display: block;
	}
	.friendsCircle-top-video{
		width: 100%;
		height: 100%;
	}
	.friendsCircle-top-opend .friendsCircle-top-video-model-img-box{
		display: none;
	}
	.friendsCircle-top-opend .friendsCircle-top-video{
		height: 80vh;
	}
	.friendsCircle-top-information{
		
	}
	.friendsCircle-top-information-nikeName{
		font-size: 32rpx;
		color: #fff;
		margin-top: 20rpx;
		margin-right: 14rpx;
		font-weight: bold;
		text-shadow: 0px 0px 5px rgba(0,0,0,0.9);
	}
	.friendsCircle-top-information-avatar{
		width: 120rpx;
		min-width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
	}
	.friendsCircle-top-information{
		z-index: 99;
		display: flex;flex-direction: row;flex-wrap: wrap;
		position: absolute;
		bottom: -45rpx;
		right: 24rpx;
		display: flex;flex-direction: column;
	}
	.friendsCircle-top-information-signature{
		position: absolute;
		right: 0;
		bottom: -45rpx;
		width: 100%;
		font-size: 24rpx;
		color: #666;
		text-align: right;
	}
	.friendsCircle-top-information-user{
		display: flex;
		flex-direction: row;
		// border-radius: 12rpx;
		// background-color: #f00;
	}
	.friendsCircle-top-opend .friendsCircle-top-information{
		display: none;
	}
	
	.friendsCircle-top-video .friendsCircle-top-information{
		bottom: -65rpx;
	}
	.friendsCircle-top-video .friendsCircle-top-information-user{
		display: flex;
		flex-direction: row;
	}
	.friendsCircle-top-video .friendsCircle-top-information-avatar{
		float: left;
	}
	
	.friendsCircle-top-video .friendsCircle-top-information-nikeName{
		float: left;
	}
	.friendsCircle-top-video .friendsCircle-top-information-signature{
		position: inherit;
		float: left;
		margin-top: 10rpx;
	}
</style>
