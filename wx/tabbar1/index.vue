<template>
	<view>
		<watermark></watermark>
		<uni-list-wx>
			<uni-list-wx :border="true">
				<view class="alertTips" v-if="list.length <= 0">暂无消息,快去联系你的好朋友吧</view>
				<template v-for="(v, i) in toplist" :key="i">
					<uni-list-chat-wx color="#eeeeee" :itemKey="i" :item="v" @longpressItem="longpressItem" :longTapItemKey="longTapItemKey" @click="clickChat(v)" clickable :title="v.nickName" :note="v.content" :time="v.time" badge-positon="left" :badge-text="v.num"></uni-list-chat-wx>
				</template>
				<template v-for="(v, i) in NOTtoplist" :key="i">
					<uni-list-chat-wx color="#fff" :itemKey="i" :item="v" @longpressItem="longpressItem" :longTapItemKey="longTapItemKey" @click="clickChat(v)" clickable :title="v.nickName" :note="v.content" :time="v.time" badge-positon="left" :badge-text="v.num"></uni-list-chat-wx>
				</template>
			</uni-list-wx>
		</uni-list-wx>
		<top-right-tool-wx ref="trtw"></top-right-tool-wx>
	</view>
</template>

<script>
export default {
	data() {
		return {
			longTapItemKey: 0,
			tranMsg: '',
			list: [],
			toplist: [],
			NOTtoplist: [],
			clickToSubmitSure: null
		};
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo;
		},
		chatlist() {
			return this.$store.state.chatlist;
		},
		chatlistkeys() {
			return Object.keys(this.chatlist);
		},
		chatListNum() {
			return this.$store.state.chatListNum;
		},
		topicReply() {
			return this.$store.state.topicReply;
		},
		friendApply() {
			return this.$store.state.friendApply;
		}
	},
	onLoad() {
		this.clickToSubmitSure = this.$fc.debounce(
			e => {
				uni.navigateTo({
					url: '../chatWindow/index?userId=' + e.userId + '&windowType=' + e.windowType
				});
			},
			1000,
			true
		);
	},
	watch: {
		chatListNum: {
			deep: true, //深度监听可见听对象中的元素变化例:obj.id
			immediate: false, //在进入页面时，第一次绑定值，不会立刻执行监听，只有数据发生改变才会执行handler中的操作
			handler(val) {
				//watch事件
				if (val > 0) {
					uni.setTabBarBadge({
						index: 0,
						text: val.toString()
					});
				} else {
					uni.removeTabBarBadge({
						index: 0
					});
				}
			}
		},
		topicReply: {
			deep: true, //深度监听可见听对象中的元素变化例:obj.id
			immediate: false, //在进入页面时，第一次绑定值，不会立刻执行监听，只有数据发生改变才会执行handler中的操作
			handler(val) {
				//watch事件
				if (val.count && val.count > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: val.count.toString()
					});
				} else {
					uni.removeTabBarBadge({
						index: 2
					});
				}
			}
		},
		friendApply: {
			deep: true, //深度监听可见听对象中的元素变化例:obj.id
			immediate: false, //在进入页面时，第一次绑定值，不会立刻执行监听，只有数据发生改变才会执行handler中的操作
			handler(val) {
				//watch事件
				if (val.count && val.count > 0) {
					uni.setTabBarBadge({
						index: 1,
						text: val.count.toString()
					});
				} else {
					uni.removeTabBarBadge({
						index: 1
					});
				}
			}
		},
		chatlist: {
			deep: true, //深度监听可见听对象中的元素变化例:obj.id
			immediate: false, //在进入页面时，第一次绑定值，不会立刻执行监听，只有数据发生改变才会执行handler中的操作
			handler(val) {
				//watch事件
				var obj = JSON.parse(JSON.stringify(val));
				var newarr = [];
				var toplist = [];
				var NOTtoplist = [];
				for (var k in obj) {
					obj[k]['xtime'] = new Date(obj[k]['time']).getTime().toString();
					if (obj[k]['userId']) {
						newarr.push(obj[k]);
					}
					if (obj[k]['userId'] && obj[k]['top'] == 'Y') {
						toplist.push(obj[k]);
					}
					if (obj[k]['userId'] && obj[k]['top'] == 'N') {
						NOTtoplist.push(obj[k]);
					}
				}
				newarr.sort((a, b) => {
					return b['xtime'] - a['xtime'];
				});
				toplist.sort((a, b) => {
					return b['xtime'] - a['xtime'];
				});
				NOTtoplist.sort((a, b) => {
					return b['xtime'] - a['xtime'];
				});
				this.list = newarr;
				this.toplist = toplist;
				this.NOTtoplist = NOTtoplist;
			}
		}
	},
	onShow() {
		this.$store.dispatch('tabBarpull');
	},
	mounted() {
		// #ifdef APP-PLUS
		plus.push.addEventListener('click', msg => {
			this.tranMsg = JSON.stringify(msg);
			var data = JSON.parse(msg.content);
			this.$fc.getPush(data);
		});
		plus.push.addEventListener('receive', msg => {
			this.tranMsg = JSON.stringify(msg);
			var data = JSON.parse(msg.content);
			this.$fc.getPush(data);
		});
		// #endif
		// // #ifdef H5
		// console.log('模拟消息体')
		// 	var resbody={
		// }
		// 	this.$fc.getPush(resbody)
		// // #endif
	},
	methods: {
		longpressItem(e, i, v) {
			// console.log(e,i,v)
			this.longTapItemKey = i;
		},
		returnAvatar(text) {
			var data = JSON.parse(text);
			var avatars = [];
			for (var i = 0; i < data.length; i++) {
				avatars.push({
					url: data[i]
				});
			}
			return avatars;
		},
		clickChat(e) {
			this.clickToSubmitSure(e);
		}
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
	}
};
</script>

<style scoped>
.alertTips {
	line-height: 80rpx;
	background-color: #fcfcfc;
	color: #999999;
	text-align: center;
	font-size: 28rpx;
}
</style>
