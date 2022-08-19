<template>
	<view class="friendsCircle-send">
		<watermark></watermark>
		<form @submit="subform">
			<view class="friendsCircle-send-item">
				<textarea class="friendsCircle-send-textarea" auto-height placeholder="这一刻的想法..." maxlength="200" v-model="form.content"></textarea>
			</view>
			<view class="friendsCircle-send-item">
				<zmm-upload-image chooseType="chooseMedia" @oneComplete="upLoadoneComplete" ref="upup" v-model:fileList="form.files" :limit="limit"></zmm-upload-image>
			</view>
			<view class="friendsCircle-send-item">
				<view class="friendsCircle-send-itemxlist">
					<view class="friendsCircle-send-itemx" :class="{'lcation':location}" @click="getlocation">
						<view class="friendsCircle-send-itemx-icon wxfont dingwei2"></view>
						<view class="friendsCircle-send-itemx-c">
							<text class="friendsCircle-send-itemx-text" v-if="location">{{location.name}}</text>
							<text class="friendsCircle-send-itemx-text" v-else>所在位置</text>
							<uni-icons style="margin-left: 24rpx;" type="right" size="16" color="#b5b5b5"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type:'TEXT',
			limit:9,
			location:'',
			form:{
				files:[
					// {
					// 	name:'1',
					// 	url:'../../static/img/avatar/avatar1.jpg',
					// 	type:'WAITING'
					// },
					// {
					// 	name:'2',
					// 	url:'../../static/img/avatar/avatar2.jpg',
					// 	type:'IMAGE'
					// },
					// {
					// 	name:'3',
					// 	url:'../../static/img/avatar/avatar3.jpg',
					// 	videoUrl:'../../static/img/avatar/avatar3.jpg',
					// 	type:'VIDEO'
					// }
				],
				content:'',
			}
		};
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo
		}
	},
	onLoad(e) {
	},
	methods: {
		returnParse(txt) {
			return JSON.parse(txt);
		},
		getlocation(){
			uni.chooseLocation({
				success: res => {
					this.location=res
				}
			});
		},
		upLoadoneComplete(e,type){
			if(e.type=='VIDEO'){
				this.limit=1
				this.type='VIDEO'
				var vlist=[]
				for (var i = 0; i < this.form.files.length; i++) {
					var item=this.form.files[i]
					if(item.type=='VIDEO'){
						vlist.push(item)
					}
				}
				this.form.files=vlist
			}else{
				this.limit=9
				this.type='IMAGE'
			}
		},
		subform(e) {
			var rules = {
				content: {
					rules: [{
						checkType: "required",
						errorMsg: "请填写文字内容"
					}]
				}
			};
			var formData = JSON.parse(JSON.stringify(this.form));
			var checkRes = this.$zmmFormCheck.check(formData, rules);
			if (checkRes) {
				this.$http.request({
					url: '/topic/sendTopic',
					method: 'POST',
					data:JSON.stringify({
						topicType:this.type,
						content:JSON.stringify(formData),
						location:JSON.stringify(this.location)
					}),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '发表成功',
								icon: "none",
							}).then(()=>{
								uni.redirectTo({
									url:'./person'
								})
							});
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
	.friendsCircle-send{
		padding:24rpx 46rpx;
	}
	.friendsCircle-send-item{
		margin-bottom: 24rpx;
	}
	.friendsCircle-send-textarea{
		width: 100%;
		line-height: 48rpx;
		min-height: 240rpx;
	}
	.friendsCircle-send-itemx{
		padding:0 24rpx;
		display: flex;flex-direction: row;align-items: center;
	}
	.friendsCircle-send-itemx-c{
		flex: 1;
		padding: 24rpx 0;
		display: flex;flex-direction: row;align-items: center;
		border-bottom: 1px #eee solid;
	}
	.friendsCircle-send-itemx-c:nth-last-child(1){
		border: none;
	}
	.friendsCircle-send-itemxlist{
		border-bottom: 1px #eee solid;
		border-top: 1px #eee solid;
	}
	.friendsCircle-send-itemx-icon{
		margin-right: 34rpx;
		color: #333;
		font-size: 42rpx;
	}
	.friendsCircle-send-itemx-text{
		font-size: 32rpx;
		color: #333;
		margin-right: auto;
	}
	.lcation .friendsCircle-send-itemx-icon,.lcation .friendsCircle-send-itemx-text{
		color: #05C160;
	}
</style>
