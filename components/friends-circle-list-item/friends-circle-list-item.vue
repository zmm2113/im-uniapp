<template>
	<view class="friendsCircle-content-item" v-for="(v, i) in content" :key="i">
		<image class="friendsCircle-content-avatar" :src="v.avatar" mode="aspectFill" @click="gofriend(v)"></image>
		<view class="friendsCircle-content-right">
			<view class="friendsCircle-content-nickName" @click="gofriend(v)">{{ v.nickName }}</view>
			<view class="friendsCircle-content-text">{{ v.text }}</view>
			<view class="friendsCircle-content-imgs" v-if="v.topicType=='IMAGE'&&v.files.length>0">
				<image v-for="(item, ii) in v.files" :key="ii" class="friendsCircle-content-img" :class="'fci' + v.files.length" :src="item.url" mode="aspectFill" @click="pimgs(v.files,ii)"></image>
			</view>
			<view class="friendsCircle-content-video" @click="openVideo(v.files[0].videoUrl)" v-if="v.topicType=='VIDEO'&&v.files.length>0">
				<image class="friendsCircle-content-video-icon" src="../../static/img/bf.png" mode="aspectFill"></image>
				<image class="friendsCircle-content-video-img" :src="v.files[0].url" mode="aspectFill"></image>
			</view>
			<view class="friendsCircle-content-location" v-if="v.location.name" @click="goMap(v.location)">{{ v.location.name }}</view>
			<view class="friendsCircle-content-tools">
				<view class="friendsCircle-content-time">{{ v.time }}</view>
				<view class="friendsCircle-content-tool" :class="{ tabon: i == showToolIndex }">
					<view class="wxfont caidan" @click="showTool(i)"></view>
					<view class="friendsCircle-content-tool-absolute">
						<view class="friendsCircle-popup">
							<view class="friendsCircle-popup-item" @click="zan(v,i)">
								<view class="friendsCircle-popup-icon wxfont zan"></view>
								<view class="friendsCircle-popup-text" v-if="v.like=='Y'">取消</view>
								<view class="friendsCircle-popup-text" v-else>赞</view>
							</view>
							<view class="friendsCircle-popup-item" @click="comment(v)">
								<view class="friendsCircle-popup-icon wxfont pinglun"></view>
								<view class="friendsCircle-popup-text">评论</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="friendsCircle-like" v-if="v.likeList&&v.likeList.length>0">
				<view class="friendsCircle-like-icon wxfont zan"></view>
				<text class="friendsCircle-like-text" v-for="(z,zindex) in v.likeList">{{z.nickName}}</text>
			</view>
			<view class="friendsCircle-comment" v-if="v.replyList&&v.replyList.length>0">
				<view class="friendsCircle-comment-item" v-for="(c,ci) in v.replyList" :key="ci">
					<text class="friendsCircle-comment-text" @click="gofriend(c)">{{c.nickName}}</text>
					<view class="friendsCircle-comment-feedback" v-if="c.replyType=='2'">
						回复
						<text class="friendsCircle-comment-text" @click="gofriend(c)">{{c.toNickName}}</text>
					</view>
					<view class="friendsCircle-comment-content" v-if="c.content" @click="replyclick(c,ci,i)">
						<text>{{c.content}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="zfb-tk-send-tool" v-if="toggleMsgBox" :style="{bottom:keyboardHeight+'px'}">
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
			keyboardHeight:0,
			msg: '',
			msgFocus:false,
			toggleMsgBox: false,
			showToolIndex: null,
			chooseUserIndex:null,
			type:'msg',
			placeholder:'评论',
			replydata:''
		};
	},
	props:{
		content:{
			type:Array,
			default:[]
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
		replyclick(e,ci,i){
			this.chooseUserIndex=i
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
										this.content[i].replyList.splice(ci,1)
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
					this.toggleMsgBox = true;
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
		returnParse(txt) {
			return JSON.parse(txt);
		},
		showTool(e) {
			this.chooseUserIndex=e
			if (this.showToolIndex === e) {
				this.showToolIndex = null;
			} else {
				this.showToolIndex = e;
			}
		},
		comment(e) {
			//评论
			this.showToolIndex = null;
			this.type='msg'
			this.placeholder='评论'
			this.$nextTick(()=>{
				this.toggleMsgBox = true;
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
							this.hidenTool()
							var like=e.like=='N' ? e.like='Y' : e.like='N'
							this.content[this.chooseUserIndex].like=like
							this.content[this.chooseUserIndex].likeList.push({
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
							this.hidenTool()
							var like=e.like=='N' ? e.like='Y' : e.like='N'
							this.content[this.chooseUserIndex].like=like
							var thisObj=this.$fc.arrFindkey({arr:this.content[this.chooseUserIndex].likeList,key:'userId',val:this.userInfo.userId})
							this.content[this.chooseUserIndex].likeList.splice(thisObj.index,1)
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
				replyId=this.content[this.chooseUserIndex].topicId
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
						this.hidenTool()
						this.content[this.chooseUserIndex].replyList.push(res.data.data)
					}
				}
			});
			this.msg=''
		},
		hidenTool() {//隐藏选项和输入框
			this.showToolIndex = null;
			this.toggleMsgBox = false;
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
		display: flex;flex-direction: row;
		padding:24rpx 34rpx;
		border-bottom: 1px #F2F2F2 solid;
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
	.friendsCircle-content-nickName{
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
		margin-bottom: 14rpx;
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
		border-radius: 8rpx;
		padding: 12rpx;
		background-color: #F7F7F7;
		display: flex;flex-direction: row;align-items: center;flex-wrap: wrap;
		margin-bottom: 1px;
	}
	.friendsCircle-like-icon,.friendsCircle-like-text,.friendsCircle-comment-text{
		color: #5F698C !important;
		font-size: 28rpx;
	}
	.friendsCircle-comment-feedback .friendsCircle-comment-text{
		margin:0 6rpx;
	}
	.friendsCircle-comment-text::after{
		content: ":";
		color: #333;
	}
	.friendsCircle-like-text{
		margin-left: 4rpx;
		margin-right: 10rpx;
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
	}
	.friendsCircle-comment-item{
		line-height: 40rpx;
		font-size: 28rpx;
		padding: 12rpx;
		white-space: pre-wrap;
		display: flex;flex-direction: row;flex-wrap: wrap;
	}
	.friendsCircle-comment-feedback{
		display: inline-block;
	}
	
	.friendsCircle-content-video{
		width: auto;
		height: 550rpx;
		max-width: 400rpx;
		position: relative;
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
		width: 80rpx !important;
		height: 80rpx !important;
		transform: translate(-50%,-50%);
	}
	.friendsCircle-comment-content{
	}
	.friendsCircle-comment-content text{
		word-break: break-all;
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
