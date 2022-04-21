<template name="zy-search">
	<view class="good-search-page" :class="Theme">
		<view class="good-search-head">
			
			<input :class="{'clearvalue':clearValuebtn}" :maxlength="maxLength" :style="{'line-height': inputHeight+'px','height': inputHeight+'px'}" :focus="isFocus" type="text" confirm-type="search" @confirm="searchStart()" :placeholder="inputPlaceholder" :confirm-hold="true" v-model="searchText" />
			<!-- <view v-if="searchText.length>0&&clearValuebtn" class="good-search-icon clearvalue-icon iconfont iconshanchu1" @click="clearvalue()"></view> -->
			<view class="good-search-icon search-icon2" @click="goback()">取消</view>
			<view class="good-search-icon search-icon iconfont iconsousuo-copy" @click="searchStart()"></view>
			<scroll-view class="autocomplay" :style="{'top': inputHeight+5+'px'}" v-if="autocomplaystate" scroll-y>
				<view class="autocomplay-item" v-for="(item,index) in autocomplayarr" :key="index" @click="tagsClick(item.value)">
					<rich-text :nodes="item.richtxt"></rich-text>
				</view>
				<view style="color: #999;text-align: center;justify-content: center; line-height: 70rpx;" v-if="autocomplayarr.length<1">没有相关信息</view>
			</scroll-view>
		</view>
		<view class="good-search-body">
			<view class="search-history" v-if="hList.length > 0">
				<view class="header">
					<text>历史记录</text>
					<view class="good-search-icon delete-icon iconfont iconshanchu" @click="delhistory()"></view>
				</view>
				<view class="list">
					<view v-for="(item,index) in hList" :key="index" @click="tagsClick(item)">{{item}}</view>
				</view>
			</view>
			<view class="search-showhot" v-if="hotList.length>0">
				<view class="header">
					<text>猜你想搜的</text>
				</view>
				<view class="list">
					<view v-for="(item,index) in hotList" :key="index" @click="tagsClick(item)">{{item}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			clearValuebtn: { //是否显示清空按钮
				type: Boolean,
				default: true
			},
			isFocus: { //是否自动获取焦点
				type: Boolean,
				default: false
			},
			Theme: { //选择主题class
				type: String,
				default: 'good-search-circle'
			},
			maxLength: { //字符最大长度
				type: [String, Number],
				default: '140'
			},
			inputHeight: { //搜索框高度单位px
				type: [String, Number],
				default: '35'
			},
			inputPlaceholder: { //搜索框默认提示
				type: String,
				default: '请输入关键词搜索'
			},
			autoComplaylist: { //自动联想数据
				type: Array,
				default () {
					return []
				}
			},
			historyNum: { //历史记录保存数量
				type: Number,
				default: 6
			},
			hotList: { //推荐列表数据
				type: Array,
				default () {
					return []
				}
			},
			speechEngine: { //语音引擎=>讯飞:iFly,百度:'baidu'
				type: String,
				default: 'iFly'
			},
			Punctuation: { //是否开启语音识别标点符号
				type: Boolean,
				default: false
			},
			callbackTime: { //input回调缓冲时间(不返回500毫秒以内输入的数据，防止每输入一个值就会触发一次)
				type: Number,
				default: 500
			},
		},
		data() {
			return {
				speechengine: this.speechEngine,
				punctuation: this.Punctuation,
				historynum: this.historyNum,
				callbacktime: this.callbackTime,
				autocomplaylist: this.getcomplaylist(this.autoComplaylist),
				autocomplayarr: [],
				autocomplaystate: false,
				searchText: '',
				hList: uni.getStorageSync('search_cache'),
			};
		},
		watch: {
			historyNum: function(val) {
				this.historynum = val;
			},
			speechEngine: function(val) {
				this.engine = val;
			},
			hotList: function(val) {
				this.hotList = val;
			},
			autoComplaylist: function(val) {
				this.autocomplaylist = this.getcomplaylist(val);
				if (!this.searchText || this.searchText == '') {
					this.autocomplaystate = false
					return
				}
				this.autocomplayarr = this.replacekeyword(this.autocomplaylist, this.searchText)
				this.autocomplaystate = this.autocomplayarr.length > 0 ? true : false;
			},
			searchText: function(val) {
				let _this = this;
				var searchWords = val.replace(/^ +| +$/g, '');
				if (!searchWords || searchWords == '') {
					this.autocomplaystate = false
					return
				}
				if (this.calbacktime) {
					clearTimeout(_this.calbacktime)
				}
				this.calbacktime = setTimeout(function() {
					_this.inputChange(searchWords)
				}, _this.callbackTime);
				this.autocomplayarr = this.replacekeyword(this.autocomplaylist, searchWords)
				this.autocomplaystate = this.autocomplayarr.length > 0 ? true : false;
			},
		},
		methods: {
			goback(){
				uni.navigateBack({
					delta:1
				})
			},
			clearvalue() { //删除input值
				let _this = this;
				setTimeout(function() { //增加延时解决键盘收回时导致的@input事件
					_this.searchText = ''
				}, 20);
				this.searchText = ''
			},
			getcomplaylist(arr) { //初始化自动联想数组
				var data = []
				for (var i = 0; i < arr.length; i++) {
					data.push({
						richtxt: arr[i],
						value: arr[i]
					})
				}
				return data
			},
			replacekeyword(arr, searchWords) { //返回符合关键词的高亮数组
				var data = []
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].richtxt.search(searchWords) != -1) {
						data.push({
							richtxt: arr[i].richtxt.replace(searchWords, "<span style='color: #333;font-weight:bold'>" + searchWords +
								"</span>"),
							value: arr[i].value
						})
					}
				}
				return data
			},
			tagsClick(item) { //标签点击事件
				let _this = this;
				setTimeout(function() { //增加延时解决键盘收回时导致的@input事件
					_this.searchText = item
					_this.searchStart()
				}, 20);
				this.$emit('tagsClick', item)
			},
			inputChange(e) { //input回调
				this.$emit('inputChange', e)
			},
			notSupport() { //不支持提醒
				uni.showToast({
					title: '该平台暂不支持',
					icon: 'none',
					duration: 1000
				});
			},
			searchStart() { //触发搜索
				let _this = this;
				if (_this.searchText == '') {
					uni.showToast({
						title: '请输入关键字',
						icon: 'none',
						duration: 1000
					});
					return false;
				}
				// else {
				// 	if(this.autocomplayarr.length<1){
				// 		this.autocomplaystate=true
				// 		return
				// 	}
				// 	uni.getStorage({
				// 		key: 'search_cache',
				// 		success(res) {
				// 			let list = res.data;
				// 			if (list.length >= _this.historynum) {
				// 				for (let item of list) {
				// 					if (item == _this.searchText) {
				// 						return false;
				// 					}
				// 				}
				// 				list.pop();
				// 				list.unshift(_this.searchText);
				// 			} else {
				// 				for (let item of list) {
				// 					if (item == _this.searchText) {
				// 						return false;
				// 					}
				// 				}
				// 				list.unshift(_this.searchText);
				// 			}
				// 			_this.hList = list;
				// 			uni.setStorage({
				// 				key: 'search_cache',
				// 				data: _this.hList
				// 			});
				// 		},
				// 		fail() {
				// 			_this.hList = [];
				// 			_this.hList.push(_this.searchText);
				// 			uni.setStorage({
				// 				key: 'search_cache',
				// 				data: _this.hList
				// 			});
				// 		}
				// 	})
				// }
				this.$emit('clickSearch', _this.searchText)
			},
			delhistory() { //清空历史记录
				this.hList = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
				this.$emit('delhHistory')
			},
			startRecognize() { //语音输入
				let _this = this;
				let options = {};
				options.engine = _this.speechengine;
				options.punctuation = _this.punctuation; // 是否需要标点符号 
				options.timeout = 1000;
				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
				});
			}
		}
	}
</script>

<style scoped>
	@font-face {
		font-family: 'iconfont';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAARsAAsAAAAACTAAAAQeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqFOIR/ATYCJAMUCwwABCAFhG0HXhshCBEVnP3IfiTGtg+yYk9cckRpaoLn+Ty/c9976WTSnw8NxB3gNgOIO3pXjJjRVmgD9Ab4PpuONYw5YTol8dSz/I/7dt/vpPE4jVIIiZD8//ctbT0e2HotiyTD+1qXxepTJ4rjgALadwoja4DGBsTHZGxxVg7MnJ/5HAI4FKQ80rBxy47YGGidADJs8MDe2B0bZoEj2MbAxFGDrMLCVovVA2Bl8fPyhapig8LS0Na2Axr1o66P31LPSsyiW0ZDfjgPYJ0CDZQHDMiYSd8wdJUrj8YJfs9QF3CwUSgfP9sv7bdMJCBU3ZDBkT5QN/OPp0ECkC4J7Lp5Az6JCAr8bBEE/NKyZX1L2NA60zI4Byq8AakDdnGd+mjadOnkCgUCQZe2JBWQrrOPLDlENBrCKQ7NOhx0lx6dfcRxJB73ZLxDIpGOsVjY60kZ8igzOXw9LgUBGelc6m3cuuVAZsRx5GvKIpG66zZnkSW0fl+aqQyrs2/PC4MqGm3k3o57OnjwGM/GYh13Xl76sMCgA5cKaldtu1A8yVt6VE6qgY0tiXyypWtSP/W45FhtsVi3dUuywx3Tq47MzuWFN8w+ujQr5G1cenhWZsfQenHrt0Nual5cNWf/2RnJgwa45BXXcaVvHjDIwtCj5mC0pbqoUevXj0rVykS01XygQmPGhkWi1q5CD1V4zJiwAgLTK6ixKmnjng+VFzQ3pz5/PqlPaRCoT+KaU6ZLu+LnFx6adKNhoZbr9a1bap1EeNbrdQ2mn6ZhlWmvN9uLq2TsP7U4b5W8FB5bv7F076IbRQtPLDExo9Ibadiy2+o5q1t1pdHrcsP37+hG3bvu21zld1OnSNq6uuWtV79fm/JtF9YYl+plfM3wiugNm1M99VW1huenTU6hsK5/2fz9ay5L1EmqairU5E15Nq0kzL1F8ywu6YspBjsP5znMJAAS1011/YKXvq7rYabb2/VcX9P+QgCB5CWns3um1PxmBw0AT9ymU0Q0kYEv+0/oCeR/Hjmzz4RKslvG701kftwixF9Dp4KSAyQQSufFYQxZ7EYQbLIaUOSgAGhsitMNuzxYBKkOAWzqgEM5PdXpIBlYa8TkBMryFiCk8gFFMpdBk8qXbtg/sMjmDwFSZQ0O4WVcGaSktKcGFplHCXyGVtCklNOfyuYb1mFgtq0suC+0rk1Ckeb9YoUT2kPscLEuvVegLI1wFa/hMBBoSx0Knzbe60uWqakPpYLGxYkGLMR4SAK4GdASyERlo73T4Ps3qBYMGLtAGYi/IMtpJwcKUnIGvdJNLMpLme1EtRLPU/oqxSIj4AoPGmSOAHp6UQcJXkqzQ0a7kGmDFFeXnt4wvsdjgAPNtkSJFiOWBEi7b3fydkLpGqZRkJ7PYym4QEmj2U8UJtGEQ+EtFgsAAA==') format('woff2');
	}

	.iconfont {
		font-family: 'iconfont' !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.iconcombinedshapecopy:before {
		content: "\e616";
	}

	.iconsousuo-copy:before {
		content: "\e600";
	}

	.iconshanchu:before {
		content: "\e64c";
	}

	.iconshanchu1:before {
		content: "\e628";
	}

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F5F5F5;
	}

	view {
		display: flex;
		font-size: 28upx;
		line-height: inherit
	}

	.good-search-page {
		box-sizing: border-box;
		width: 750rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.good-search-head {
		position: relative;
	}

	.good-search-head input {
		box-sizing: border-box;
		width: 100%;
		background-color: #F7F7F7;
		font-size: 28rpx;
		border-radius: 50rpx;
		padding: 0 73rpx;
		padding-left: 34rpx;
		padding-right: 160rpx;
	}
	.good-search-head input.clearvalue{
	}
	.good-search-icon {
		color: #888;
		justify-content: center;
		align-items: center;
		font-size: 38rpx;
	}

	.good-search-head .good-search-icon {
		width: 73rpx;
		height: 100%;
		position: absolute;
		z-index: 2;
		top: 0rpx;
	}

	.good-search-head .voice-icon {
		left: 0;
	}

	.good-search-head .search-icon {
		width: 63rpx;
		right: 97rpx;
	}
	.good-search-head .search-icon2 {
		font-size: 28rpx;
		right: 0;
		width: 73rpx;
		padding-right: 24rpx;
	}
	.good-search-head .clearvalue-icon {
		width: auto;
		right: 146rpx;
		color: #ccc;
	}

	.good-search-head .autocomplay {
		left: 0;
		top: 80rpx;
		border-radius: 20rpx;
		height: 70vh;
		background: #f7f7f7;
		position: absolute;
		z-index: 9;
	}

	.good-search-head .autocomplay .autocomplay-item {
		padding: 0 24rpx;
		line-height: 70rpx;
		height: 70rpx;
		border-bottom: 1px #eee solid;
		color: #999;
	}

	.good-search-body {
		display: flex;
		flex-direction: column;
	}

	.good-search-page .search-history {
		display: flex;
		flex-direction: column;
	}

	.good-search-page .search-showhot {
		display: flex;
		flex-direction: column;
	}

	/* 主题1 */
	.good-search-rect {}

	.good-search-rect .good-search-head input {
		border-radius: 0;
	}
	.good-search-rect .good-search-head input.clearvalue{
	}
	.good-search-rect .good-search-head .voice-icon {}

	.good-search-rect .good-search-head .search-icon {}

	.good-search-rect .good-search-head .clearvalue-icon {}

	.good-search-rect .header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 24rpx 0;
		padding: 0 12rpx;
	}

	.good-search-rect .header text {
		color: #666;
		font-weight: bold;
		font-size: 32rpx;
		margin-right: auto;
	}


	.good-search-rect .list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.good-search-rect .list view {
		display: block;
		width: 49%;
		color: #8A8A8A;
		font-size: 28rpx;
		box-sizing: border-box;
		text-align: center;
		padding: 20rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		background-color: #F7F7F7;
		margin: 0.5%;
	}

	.good-search-rect .search-showhot {}

	/* 主题2 */
	.good-search-circle {}

	.good-search-circle .good-search-head input {
		border-radius: 50rpx;
	}
	.good-search-circle .good-search-head input.clearvalue{
	}
	.good-search-circle .good-search-head .voice-icon {}
	
	.good-search-circle .good-search-head .search-icon {}
	
	.good-search-circle .good-search-head .clearvalue-icon {}
	.good-search-circle .header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 24rpx 0;
		padding: 0 12rpx;
	}

	.good-search-circle .header text {
		color: #666;
		font-weight: bold;
		font-size: 32rpx;
		margin-right: auto;
	}


	.good-search-circle .list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.good-search-circle .list view {
		display: block;
		padding: 8rpx 18rpx;
		margin: 12rpx;
		margin-top: 0;
		font-size: 28rpx;
		color: #8A8A8A;
		background-color: #F7F7F7;
		box-sizing: border-box;
		text-align: center;
		border-radius: 20rpx;
	}

	.good-search-circle .search-showhot {}

	/* 主题3 */
	.good-search-tb {}

	.good-search-tb .good-search-head input {
		border-radius: 0;
	}
	.good-search-tb .good-search-head input.clearvalue{
		padding-right: 133rpx;
	}
	.good-search-tb .good-search-head .voice-icon {}
	
	.good-search-tb .good-search-head .search-icon {
		background: #FF9A33;
		color: #fff;
	}
	
	.good-search-tb .good-search-head .clearvalue-icon {
		width: 60rpx;
	}
	.good-search-tb .header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 24rpx 0;
		padding: 0 12rpx;
	}

	.good-search-tb .header text {
		color: #666;
		font-weight: bold;
		font-size: 32rpx;
		margin-right: auto;
	}


	.good-search-tb .list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.good-search-tb .list view {
		display: block;
		padding: 8rpx 30rpx;
		margin: 12rpx;
		margin-top: 0;
		font-size: 28rpx;
		color: #8A8A8A;
		background-color: #F7F7F7;
		box-sizing: border-box;
		text-align: center;
		border-radius: 20rpx;
	}

	.good-search-tb .search-showhot {}
</style>
