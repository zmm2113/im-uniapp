<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="xw-tool-list">
			<view class="xw-tool-list-content">
				<view class="xw-tool-item">
					<text class="xw-tool-text">头像</text>
					<zmm-upload-avatar v-model="avatar" @change="avatarChange"></zmm-upload-avatar>
				</view>
			</view>
		</view>
		<tool-list-wx :list="list1" @itemClick="itemClick"></tool-list-wx>
		<tool-list-wx :list="list2" @itemClick="itemClick2"></tool-list-wx>
		<tool-list-wx :list="list3" @itemClick="itemClick3"></tool-list-wx>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar:this.$store.state.userInfo.portrait,
				list2:[{
					title: '二维码名片',
					path: '#',
					else:[{
						type: 'img',
						content: '../../static/wx/t05.png'
					}]
				}]
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			},
			list1(){
				return [{
					title: '名字',
					path: '#',
					else:[{
						type: 'text',
						content: this.$store.state.userInfo.nickName
					}]
				},{
					title: '微聊号',
					path: '#',
					else:[{
						type: 'text',
						content: this.$store.state.userInfo.chatNo
					}]
				}]
			},
			list3(){
				return [{
					title: '性别',
					path: '#',
					else:[{
						type: 'text',
						content: this.$store.state.userInfo.genderLabel
					}]
				},{
					title: '地区',
					path: '#',
					else:[{
						type: 'text',
						content: this.$store.state.userInfo.provinces+' '+this.$store.state.userInfo.city
					}]
				},{
					title: '个性签名',
					path: '#',
					else:[{
						type: 'text',
						content: this.$store.state.userInfo.intro
					}]
				}]
			}
		},
		onLoad() {},
		methods: {
			itemClick(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'editNikeName?userId='+this.userInfo.userId+'&nickName='+this.userInfo.nickName
					})
						break;
					case 1:
					uni.navigateTo({
						url:'editchatNo?userId='+this.userInfo.userId+'&chatNo='+this.userInfo.chatNo
					})
						break;
					default:
						break;
				}
			},
			itemClick2(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'QRcode'
					})
						break;
					default:
						break;
				}
			},
			itemClick3(e,i){
				switch (i){
					case 0:
					uni.navigateTo({
						url:'editGender?userId='+this.userInfo.userId+'&gender='+this.userInfo.gender
					})
						break;
					case 1:
					uni.navigateTo({
						url:'editAddress?userId='+this.userInfo.userId+'&provinces='+this.userInfo.provinces+'&city='+this.userInfo.city
					})
						break;
					case 2:
					uni.navigateTo({
						url:'editIntro?userId='+this.userInfo.userId+'&intro='+this.userInfo.intro
					})
						break;
					default:
						break;
				}
			},
			avatarChange(e){
				this.$http.request({
					url: '/my/editPortrait',
					method: 'POST',
					data:JSON.stringify({portrait:e}),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title:'修改成功',
								icon:'none'
							})
							this.$store.dispatch('get_UserInfo')
						}
					}
				});
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
	.xw-tool-list {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border-bottom: 1px #eee solid;
	}
	
	.xw-tool-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 26rpx 24rpx;
	}
	.xw-tool-item:nth-last-child(1) {
		border: none;
	}
	
	.xw-tool-text {
		margin-right: auto;
	}
</style>
