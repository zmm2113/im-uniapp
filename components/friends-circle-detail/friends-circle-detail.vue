<template>
	<view class="friendsCircle-content-item">
		<image class="friendsCircle-content-avatar" :src="content.avatar" mode="aspectFill"></image>
		<view class="friendsCircle-content-right">
			<view class="friendsCircle-content-nikeName">{{ content.nikeName }}</view>
			<view class="friendsCircle-content-text">{{ content.text }}</view>
			<view class="friendsCircle-content-imgs" v-if="content.topicType=='IMAGE'&&content.files.length>0">
				<image v-for="(item, ii) in content.files" :key="ii" class="friendsCircle-content-img" :class="'fci' + content.files.length" :src="item.url" mode="aspectFill" @click="pimgs(content.files,ii)"></image>
			</view>
			<view class="friendsCircle-content-video" @click="openVideo(content.files[0].videoUrl)" v-if="content.topicType=='VIDEO'&&content.files.length>0">
				<image class="friendsCircle-content-video-icon" src="../../static/img/bf.png" mode="aspectFill"></image>
				<image class="friendsCircle-content-video-img" :src="content.files[0].url" mode="aspectFill"></image>
			</view>
			<view v-if="content.location" class="friendsCircle-content-location" @click="goMap(content.location)">{{ content.location.name }}</view>
			<view class="friendsCircle-content-tools">
				<view class="friendsCircle-content-time">{{ content.time }}</view>
				<view class="friendsCircle-content-tool" :class="{ 'tabon': tabToolIndex }">
					<view class="wxfont caidan" @click="tabTool(i)"></view>
					<view class="friendsCircle-content-tool-absolute">
						<view class="friendsCircle-popup">
							<view class="friendsCircle-popup-item" @click="zan(content)">
								<view class="friendsCircle-popup-icon wxfont zan"></view>
								<view class="friendsCircle-popup-text" v-if="content.like=='Y'">取消</view>
								<view class="friendsCircle-popup-text" v-else>赞</view>
							</view>
							<view class="friendsCircle-popup-item" @click="comment(content)">
								<view class="friendsCircle-popup-icon wxfont pinglun"></view>
								<view class="friendsCircle-popup-text">评论</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
	<view class="friendsCircle-content-item-detail">
		<view class="friendsCircle-content-item-detail-item" v-if="content.likeList&&content.likeList.length>0">
			<view class="friendsCircle-like-icon wxfont zan"></view>
			<view class="friendsCircle-like">
				<image class="friendsCircle-like-img" mode="aspectFill" v-for="(z,zindex) in content.likeList" :src="z.portrait"></image>
			</view>
		</view>
		<view class="friendsCircle-content-item-detail-item" v-if="content.replyList&&content.replyList.length>0">
			<view class="friendsCircle-comment-icon wxfont pinglun"></view>
			<view class="friendsCircle-comment">
				<view class="friendsCircle-comment-item" v-for="(c,ci) in content.replyList" :key="ci">
					<image class="friendsCircle-comment-img" :src="c.portrait" mode="aspectFill"></image>
					<view class="friendsCircle-comment-item-text">
						<view class="friendsCircle-comment-item-name">
							<text class="friendsCircle-comment-text">{{c.nickName}}</text>
							<text class="friendsCircle-comment-item-time">{{c.createTime}}</text>
						</view>
						<view style="width: 100%;" @click="replyclick(c,ci)">
							<view class="friendsCircle-comment-feedback" v-if="c.replyType=='2'">
								<text>回复</text>
								<text class="friendsCircle-comment-text">{{c.toNickName}}</text>
							</view>
							<text class="friendsCircle-comment-textx">{{c.content}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view style="height: 120rpx;"></view>
	<view class="zfb-tk-send-tool" :style="{bottom:keyboardHeight+'px'}">
		<form @submit="sendMsg(msg)">
			<view class="zfb-tk-send-tool-c">
				<view class="zfb-tk-send-tool-input-box" @click="msgFocus=true">
					<textarea class="zfb-tk-send-tool-input" :adjust-position="false" :focus="msgFocus" v-model="msg" :placeholder="placeholder" confirm-type="send" @confirm="sendMsg(msg)" hold-keyboard :maxlength="-1" auto-height />
				</view>
				<view class="zfb-tk-send-tool-text" @click="sendMsg(msg)" :style="{ background: msg !== '' ? '#1BC418' : '#F7F7F7', color: msg !== '' ? '#fff' : '#ddd', 'border-color': msg !== '' ? '#1BC418' : '#ddd' }">发送</view>
			</view>
		</form>
	</view>
</template>

<script>
export default {
	// 朋友圈列表内容区
	data() {
		return {
			timer:null,
			placeholder:'评论',
			keyboardHeight:0,
			msg: '',
			type:'msg',
			replydata:'',
			msgFocus:false,
			tabToolIndex: false,
			content:this.detail
		};
	},
	props:{
		detail:{
			type:Object
		}
	},
	watch:{
		detail(v){
			this.content=v
		}
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo
		}
	},
	mounted() {
		// #ifdef APP-PLUS
		uni.onKeyboardHeightChange(res => {
		  this.keyboardHeight=res.height
		})
		// #endif
	},
	methods: {
		scrolltoBottom() {
			this.$nextTick(()=>{
				this.timer = setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 9999999,
						duration: 10
					});
					this.$forceUpdate()
				}, 100);
			})
		},
		replyclick(e,ci){
			if(e.canDeleted=='Y'){
				this.hidenTool()
				uni.showActionSheet({
					itemList: ['复制','删除'],
					success: (res) => {
						switch (res.tapIndex){
							case 0:
							uni.setClipboardData({
								data: e.content,
								success: function() {
									uni.showToast({
										title: '复制成功',
										icon: 'none',
										position: 'bottom'
									})
								}
							});
								break;
							case 1:
							this.$http.request({
								url: '/topic/removeReply/'+e.replyId,
								success: (res) => {
									if (res.data.code == 200) {
										uni.showToast({
											title:'删除成功',
											icon:'none'
										})
										this.content.replyList.splice(ci,1)
									}
								}
							});
								break;
							default:
								break;
						}
					}
				});
			}else{
				this.replydata=e
				this.type='reply'
				this.placeholder='回复'+e.nickName
				this.$nextTick(()=>{
					this.msgFocus=true
				})
			}
		},
		gofriend(e){
			uni.navigateTo({
				url:'../../wx/personInfo/detail?param='+e.userId
			})
		},
		pimgs(arr,ii){
			var imgs=[]
			for (var i = 0; i < arr.length; i++) {
				imgs.push(arr[i].url)
			}
			this.$fc.previewImages(imgs, ii)
		},
		goMap(e) {
			uni.openLocation({
				latitude: e.latitude,
				longitude: e.longitude,
				success: function() {}
			});
		},
		openVideo(e){
			this.$fc.plusDownload({onlinePath:e}).then(res=>{
				this.$fc.plusOpenFile({filePath:res})
			})
		},
		tabTool(e) {
			this.tabToolIndex=!this.tabToolIndex
		},
		comment(e) {
			this.hidenTool()
			//评论
			this.type='msg'
			this.placeholder='评论'
			this.$nextTick(()=>{
				this.msgFocus=true
			})
		},
		zan(e,i){//点赞
			switch (e.like){
				case 'N':
				this.$http.request({
					url: '/topic/like/'+e.topicId,
					success: (res) => {
						if (res.data.code == 200) {
							var like=e.like=='N' ? e.like='Y' : e.like='N'
							this.content.like=like
							this.content.likeList.push({
								userId: this.userInfo.userId,
								nickName: this.userInfo.nickName,
								portrait: this.userInfo.portrait
							})
						}
					}
				});
					break;
				case 'Y':
				this.$http.request({
					url: '/topic/cancelLike/'+e.topicId,
					success: (res) => {
						if (res.data.code == 200) {
							var like=e.like=='N' ? e.like='Y' : e.like='N'
							this.content.like=like
							var thisObj=this.$fc.arrFindkey({arr:this.content.likeList,key:'userId',val:this.userInfo.userId})
							this.content.likeList.splice(thisObj.index,1)
						}
					}
				});
					break;
				default:
					break;
			}
		},
		sendMsg(e) {
			if (!e) {
				return;
			}
			var replyId=''
			var replyType=''
			if(this.type=='msg'){
				replyId=this.content.topicId
				replyType='1'
			}
			if(this.type=='reply'){
				replyId=this.replydata.replyId
				replyType='2'
			}
			this.$http.request({
				url: '/topic/reply',
				method: 'POST',
				data:JSON.stringify({
					replyId: replyId, 
					replyType: replyType, 
					content: e
				}),
				success: (res) => {
					if (res.data.code == 200) {
						this.content.replyList.push(res.data.data)
						this.$nextTick(()=>{
							this.scrolltoBottom()
						})
					}
				}
			});
			this.msg=''
		},
		hidenTool() {//隐藏选项和输入框
			this.tabToolIndex = false;
		}
	}
};
</script>

<style scoped lang="scss">
.zfb-tk-send-tool {
	background: #f7f7f7;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}

.zfb-tk-send-tool-c {
	padding: 16rpx 12rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	border: 1px #ddd solid;
	border-left: none;
	border-right: none;
}

.zfb-tk-send-tool-c .zfb-tk-send-tool-btn {
	transition: color 0.5s;
}

.zfb-tk-send-tool .zfb-tk-send-tool-input {
	padding:0 24rpx;
	box-sizing: border-box !important;
	width: 100%;
	background: #fff;
}

.zfb-tk-send-tool-text {
	white-space: nowrap;
	padding: 10rpx 24rpx;
	border-radius: 12rpx;
	border: 1px #ddd solid;
	background: #f7f7f7;
	color: #ddd;
}
.friendsCircle-content-item{
		display: flex;
		flex-direction: row;
		padding:24rpx;
	}
	.friendsCircle-content-item-detail{
		margin:0 24rpx;
		border-radius: 8rpx;
		margin-top: 24rpx;
		padding-bottom: 0;
		margin-bottom: 1px;
	}
	.friendsCircle-content-avatar{
		border-radius: 10rpx;
		width: 90rpx;
		height: 90rpx;
		min-width: 90rpx;
	}
	.friendsCircle-content-right{
		display: flex;flex-direction: column;
		padding-left: 18rpx;
		flex: 1;
		box-sizing: border-box;
	}
	.friendsCircle-content-nikeName{
		font-size: 32rpx;
		color: #5F698C;
		margin-bottom: 10rpx;
	}
	.friendsCircle-content-text{
		font-size: 32rpx;
		color: #333;
	}
	.friendsCircle-content-imgs{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		flex: 1;
		margin-top: 24rpx;
	}
	.friendsCircle-content-img{
		max-width: 100%;
	}
	.friendsCircle-content-img.fci1{
		height: 550rpx;
		max-width: 500rpx;
		margin-right: 5px;
	}
	.friendsCircle-content-img.fci2{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci2:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-img.fci3{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci3:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-img.fci4{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci4:nth-child(2n){
		margin-right: 185rpx;
	}
	.friendsCircle-content-img.fci5{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci5:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-img.fci6{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci6:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-img.fci7{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci7:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-img.fci8{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci8:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-img.fci9{
		width: 185rpx;
		height: 185rpx;
		margin-right: 5rpx;
		margin-bottom: 5rpx;
	}
	.friendsCircle-content-img.fci9:nth-child(3n){
		margin-right: 0;
	}
	.friendsCircle-content-location{
		font-size: 24rpx;
		color: #5F698C;
		margin-top: 12rpx;
	}
	.friendsCircle-content-time{
		font-size: 24rpx;
		color: #666666;
		margin-right: auto;
	}
	
	.friendsCircle-content-tools{
		margin-top: 24rpx;
		display: flex;flex-direction: row;align-items: center;
	}
	.friendsCircle-content-tool{
		padding:4rpx 16rpx;
		border-radius: 10rpx;
		background-color: #F8F8FA;
		color: #63678C;
		display: flex;flex-direction: row;
		position: relative;
	}
	.tabon .friendsCircle-content-tool-absolute{
		display: block;
	}
	.friendsCircle-content-tool-absolute{
		position: absolute;
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		display: none;
	}
	.friendsCircle-popup{
		margin-right: 24rpx;
		border-radius: 12rpx;
		background-color: rgba(0,0,0,0.7);
		height: 75rpx;
		display: flex;flex-direction: row;align-items: center;
		padding:0 24rpx;
	}
	.friendsCircle-popup-item{
		color: #fff;
		padding:0 25rpx;
		height: 100%;
		display: flex;flex-direction: row;align-items: center;
	}
	.friendsCircle-popup-item:nth-child(1):active .friendsCircle-popup-icon{
		font-size: 56rpx;
	}
	.friendsCircle-popup-icon{
		font-size: 46rpx;
	}
	.friendsCircle-popup-text{
		white-space: nowrap;
	}
	.friendsCircle-like{
		display: flex;flex-direction: row;align-items: center;flex-wrap: wrap;
		
	}
	.friendsCircle-like-icon,.friendsCircle-like-text,.friendsCircle-comment-text{
		color: #5F698C !important;
		font-size: 24rpx;
	}
	.friendsCircle-comment-feedback .friendsCircle-comment-text{
		margin:0 6rpx;
	}
	.friendsCircle-comment-feedback .friendsCircle-comment-text::after{
		content: ":";
		color: #333;
	}
	.friendsCircle-comment-item-name{
		display: flex;flex-direction: row;
		width: 100%;
	}
	.friendsCircle-comment-item-time{
		margin-left: auto;
		font-size: 24rpx;
		color: #999;
	}
	.friendsCircle-like-icon,.friendsCircle-comment-icon{
		width: 40rpx;
		min-width: 40rpx;
		height: 60rpx;
		display: flex;flex-direction: row;align-items: center;justify-content: center;
		font-size: 32rpx;
	}
	.friendsCircle-like-text{
		margin-left: 4rpx;
	}
	.friendsCircle-like-text::after{
		content: ",";
	}
	.friendsCircle-like-text:nth-last-child(1)::after{
		content: "";
	}
	.friendsCircle-comment{
		background-color: #F7F7F7;
		border-radius: 8rpx;
		flex: 1;
	}
	.friendsCircle-comment-item{
		font-size: 28rpx;
		padding: 12rpx;
		white-space: pre-wrap;
		display: flex;flex-direction: row;
	}
	.friendsCircle-comment-feedback{
		display: inline-block;
	}
	.friendsCircle-comment-feedback text{
		font-size: 28rpx;
		color: #333;
	}
	.friendsCircle-comment-textx{
		word-break: break-all;
	}
	.friendsCircle-like-img,.friendsCircle-comment-img{
		width: 60rpx;
		height: 60rpx;
		border-radius: 12rpx;
		margin-left: 10rpx;
		margin-bottom: 12rpx;
	}
	.friendsCircle-comment-img{
		margin-right: 12rpx;
		margin-left: 0px;
	}
	.friendsCircle-content-item-detail-item{
		display: flex;flex-direction: row;
		padding: 12rpx;
		padding-bottom: 0;
		margin-bottom: 4rpx;
		border-radius: 8rpx;
		background-color: #F7F7F7;
	}
	.friendsCircle-comment-item-text{
		flex: 1;
		display: flex;flex-direction: column;
		align-items:flex-start;
	}
	.friendsCircle-content-video{
		height: 550rpx;
		max-width: 400rpx;
		position: relative;
		margin-right: 14rpx;
		margin-top: 24rpx;
	}
	.friendsCircle-content-video-img{
		width: 100%;
		height: 100%;
	}
	.friendsCircle-content-video-icon{
		z-index: 1;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 60rpx !important;
		height: 60rpx !important;
		transform: translate(-50%,-50%);
	}
	.zfb-tk-send-tool-input-box{
		overflow: auto;
		width: 100%;
		margin: 0 12rpx;
		min-height: 75rpx;
		background-color: #fff;
		border-radius: 24rpx;
		padding-top: 18rpx;
		max-height: 225rpx;
		box-sizing: border-box;
	}
</style>
