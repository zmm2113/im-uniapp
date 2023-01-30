<template>
	<view class="bgColor">
		<watermark></watermark>
		<tool-list-wx :list="list"></tool-list-wx>
		<tool-list-wx :list="list3"></tool-list-wx>
		<tool-list-wx :list="list2" @itemClick="itemClick2"></tool-list-wx>
		<tool-list-wx :list="list4"></tool-list-wx>
		<tool-list-wx :list="list6"></tool-list-wx>
		<!-- <tool-list-wx :list="list7"></tool-list-wx> -->
		<top-right-tool-wx ref="trtw"></top-right-tool-wx>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list3:[{
					title: '视频号(未开通)',
					path:'',
					icon: '../../static/wx/t03.png',
					else: [{
						type: 'dotimg',
						content: '../../static/img/avatar/avatar2.jpg'
					}, {
						type: 'text',
						content: '两个朋友赞过'
					}]
				},{
					title: '直播(未开通)',
					path:'',
					icon: '../../static/wx/t11.png',
					else: [{
						type: 'dotimg',
						content: '../../static/img/avatar/avatar2.jpg'
					}, {
						type: 'text',
						content: '直播中'
					}]
				}],
				list2:[{
					title: '扫一扫',
					path:'#',
					icon: '../../static/wx/t02.png',
					else: []
				},{
					title: '摇一摇',
					path:'../../wx/shake/index',
					icon: '../../static/wx/t12.png',
					else: []
				},{
					title: '附近',
					path:'../../wx/nearby/index',
					icon: '../../static/wx/t15.png',
					else: []
				}],
				list4:[{
					title: '看一看(未开通)',
					path:'',
					icon: '../../static/wx/t13.png',
					else: []
				},{
					title: '搜一搜(未开通)',
					path:'',
					icon: '../../static/wx/t14.png',
					else: []
				}],
				list6:[{
					title: '购物(未开通)',
					path:'',
					icon: '../../static/wx/t16.png',
					else: []
				},{
					title: '游戏(未开通)',
					path:'',
					icon: '../../static/wx/t17.png',
					else: []
				}],
				list7:[{
					title: '小程序(未开通)',
					path:'',
					icon: '../../static/wx/t18.png',
					else: []
				}]
			}
		},
		onShow(){
			this.$store.dispatch('tabBarpull')
		},
		computed:{
			list(){
				return [{
					title: '朋友圈',
					type:this.$store.state.topicReply.count ? 'dottext' : '',
					path:'../../wx/friendsCircle/index',
					icon: '../../static/wx/t01.png',
					else: [{
						type: this.$store.state.topicRed.portrait ? 'dotimg' : '',
						content: this.$store.state.topicRed.portrait ? this.$store.state.topicRed.portrait : ''
					}]
				}]
			},
			topicRed() {
				return this.$store.state.topicRed
			}
		},
		onLoad() {},
		methods: {
			itemClick2(e,i){
				switch (i){
					case 0:
					this.$fc.saoyisao()
						break;
					default:
						break;
				}
			},
					
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0: //更多
					this.$refs['trtw'].showTab();
					break;
				case 1: //搜索
					uni.navigateTo({
						url: '../search/index'
					});
					break;
				default:
					break;
			}
		},
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
</style>
