<template>
	<view class="uni-indexed-list" ref="list" id="list">
		<!-- #ifdef APP-NVUE -->
		<list class="uni-indexed-list__scroll" scrollable="true" show-scrollbar="false">
			<cell v-for="(list, idx) in lists" :key="idx" :ref="'uni-indexed-list-' + idx">
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<scroll-view :scroll-into-view="scrollViewId" class="uni-indexed-list__scroll" scroll-y>
					<view class="xw-book-add" v-if="showAdd">
						<view class="xw-book-add-item" v-for="(v,i) in addlist" :key="i" @click="gopath(v)">
							<uni-badge v-if="v.num" :text="v.num+''" absolute="rightTop">
								<view class="xw-book-add-icon">
									<view class="wxfont jiahaoyou"></view>
								</view>
							</uni-badge>
							<view v-else class="xw-book-add-icon" :style="{background:v.color}">
								<view class="wxfont jiahaoyou"></view>
							</view>
							<view class="xw-book-add-item-text">{{v.title}}</view>
						</view>
					</view>
					<view v-for="(list, idx) in lists" :key="idx" :id="'uni-indexed-list-' + idx">
						<!-- #endif -->
						<indexed-list-item :list="list" :loaded="loaded" :idx="idx" :showSelect="showSelect"
							@itemClick="onClick"></indexed-list-item>
						<!-- #ifndef APP-NVUE -->
					</view>
				</scroll-view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
			</cell>
			
		</list>
		<!-- #endif -->
		<view class="uni-indexed-list__menu" @touchstart="touchStart" @touchmove.stop.prevent="touchMove"
			@touchend="touchEnd" @mousedown.stop="mousedown" @mousemove.stop.prevent="mousemove"
			@mouseleave.stop="mouseleave">
			<view v-for="(list, key) in lists" :key="key" class="uni-indexed-list__menu-item"
				:class="touchmoveIndex == key ? 'uni-indexed-list__menu--active' : ''">
				<text class="uni-indexed-list__menu-text"
					:class="touchmoveIndex == key ? 'uni-indexed-list__menu-text--active' : ''">{{ list.key }}</text>
			</view>
		</view>
		<view v-if="touchmove" class="uni-indexed-list__alert-wrapper">
			<text class="uni-indexed-list__alert">{{ lists[touchmoveIndex].key }}</text>
		</view>
	</view>
</template>
<script>
	import indexedListItem from './uni-indexed-list-item.vue'
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	// #endif
	// #ifdef APP-PLUS
	function throttle(func, delay) {
		var prev = Date.now();
		return function() {
			var context = this;
			var args = arguments;
			var now = Date.now();
			if (now - prev >= delay) {
				func.apply(context, args);
				prev = Date.now();
			}
		}
	}

	function touchMove(e) {
		let pageY = e.touches[0].pageY
		let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
		if (this.touchmoveIndex === index) {
			return false
		}
		let item = this.lists[index]
		if (item) {
			// #ifndef APP-NVUE
			this.scrollViewId = 'uni-indexed-list-' + index
			this.touchmoveIndex = index
			// #endif
			// #ifdef APP-NVUE
			dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
				animated: false
			})
			this.touchmoveIndex = index
			// #endif
		}
	}
	const throttleTouchMove = throttle(touchMove, 40)
	// #endif

	/**
	 * IndexedList 索引列表 微信版
	 * @description 用于展示索引列表
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=375
	 * @property {Boolean} showSelect = [true|false] 展示模式
	 * 	@value true 展示模式
	 * 	@value false 选择模式
	 * @property {Object} options 索引列表需要的数据对象
	 * @event {Function} click 点击列表事件 ，返回当前选择项的事件对象
	 * @example <uni-indexed-list options="" showSelect="false" @click=""></uni-indexed-list>
	 */
	export default {
		name: 'UniIndexedListWX',
		components: {
			indexedListItem
		},
		emits: ['click'],
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			},
			showAdd: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				
				lists: [],
				winHeight: 0,
				itemHeight: 0,
				winOffsetY: 0,
				touchmove: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmovable: true,
				loaded: false,
				isPC: false
			}
		},
		computed:{
			friendApply() {
				return this.$store.state.friendApply
			},
			addlist(){
				return [{
					title:'新的朋友',
					path:'../../wx/search-friends/index',
					num:this.$store.state.friendApply.count ? this.$store.state.friendApply.count : '',
					icon:'jiahaoyou',
					color:'#FB9E3E'
				},{
					title:'群聊',
					path:'../../wx/groupInfo/grouplist',
					icon:'qunl',
					num:'',
					color:'#0ABF62'
				}]
			}
		},
		watch: {
			options: {
				handler: function() {
					this.setList()
				},
				deep: true
			}
		},
		mounted() {
			// #ifdef H5
			this.isPC = this.IsPC()
			// #endif
			setTimeout(() => {
				this.setList()
			}, 50)
			setTimeout(() => {
				this.loaded = true
			}, 300);
		},
		methods: {
			gopath(e){
				uni.navigateTo({
					url:e.path
				})
			},
			setList() {
				let index = 0;
				this.lists = []
				this.options.forEach((value, index) => {
					if (value.data.length === 0) {
						return
					}
					let indexBefore = index
					let items = value.data.map(item => {
						let obj = {}
						obj['key'] = value.letter
						obj['data'] = item
						obj['itemIndex'] = index
						index++
						obj.checked = item.checked ? item.checked : false
						return obj
					})
					this.lists.push({
						title: value.letter,
						key: value.letter,
						items: items,
						itemIndex: indexBefore
					})
				})
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					.in(this)
					.select('#list')
					.boundingClientRect()
					.exec(ret => {
						this.winOffsetY = ret[0].top
						this.winHeight = ret[0].height
						this.itemHeight = this.winHeight / this.lists.length
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['list'], (res) => {
					this.winOffsetY = res.size.top
					this.winHeight = res.size.height
					this.itemHeight = this.winHeight / this.lists.length
				})
				// #endif
			},
			touchStart(e) {
				this.touchmove = true
				let pageY = this.isPC ? e.pageY : e.touches[0].pageY
				let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
					// #ifdef APP-NVUE
					dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
						animated: false
					})
					// #endif
				}
			},
			touchMove(e) {
				// #ifndef APP-PLUS
				let pageY = this.isPC ? e.pageY : e.touches[0].pageY
				let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
				if (this.touchmoveIndex === index) {
					return false
				}
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
				}
				// #endif
				// #ifdef APP-PLUS
				throttleTouchMove.call(this, e)
				// #endif
			},
			touchEnd() {
				this.touchmove = false
				// this.touchmoveIndex = -1
			},

			/**
			 * 兼容 PC @tian
			 */

			mousedown(e) {
				if (!this.isPC) return
				this.touchStart(e)
			},
			mousemove(e) {
				if (!this.isPC) return
				this.touchMove(e)
			},
			mouseleave(e) {
				if (!this.isPC) return
				this.touchEnd(e)
			},

			// #ifdef H5
			IsPC() {
				var userAgentInfo = navigator.userAgent;
				var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
				var flag = true;
				for (let v = 0; v < Agents.length - 1; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = false;
						break;
					}
				}
				return flag;
			},
			// #endif


			onClick(e) {
				let {
					idx,
					index
				} = e
				let obj = {}
				for (let key in this.lists[idx].items[index]) {
					obj[key] = this.lists[idx].items[index][key]
				}
				let select = []
				if (this.showSelect) {
					this.lists[idx].items[index].checked = !this.lists[idx].items[index].checked
					this.lists.forEach((value, idx) => {
						value.items.forEach((item, index) => {
							if (item.checked) {
								let obj = {}
								for (let key in this.lists[idx].items[index]) {
									obj[key] = this.lists[idx].items[index][key]
								}
								select.push(obj)
							}
						})
					})
				}
				this.$emit('click', {
					item: obj,
					select: select
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-indexed-list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.uni-indexed-list__scroll {
		flex: 1;
		height: 100%;
	}

	.uni-indexed-list__menu {
		width: 24px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-indexed-list__menu-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-indexed-list__menu-text {
		font-size: 12px;
		text-align: center;
		color: #aaa;
	}

	.uni-indexed-list__menu--active {
		// background-color: rgb(200, 200, 200);
	}

	.uni-indexed-list__menu--active {}

	.uni-indexed-list__menu-text--active {
		border-radius: 16px;
		width: 16px;
		height: 16px;
		line-height: 16px;
		// background-color: #007aff;
		// color: #fff;
	}

	.uni-indexed-list__alert-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.uni-indexed-list__alert {
		width: 80px;
		height: 80px;
		border-radius: 80px;
		text-align: center;
		line-height: 80px;
		font-size: 35px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.h5-buchang{
		height: 140rpx;
		display: none;
	}
	.uni-scroll-view-content view:nth-last-child(1) .h5-buchang{
		display: block;
	}
	.xw-book-add{
		width: 100%;
		display: flex;
		flex-direction: column;
		padding:0 24rpx;
		box-sizing: border-box;
		// height: 120rpx;
	}
	.xw-book-add-item{
		display: flex;flex-direction: row;align-items: center;
		// height: 90rpx;
		// line-height: 90rpx;
		padding-bottom: 16rpx;
		padding-top: 16rpx;
		// border-bottom: 1px #f8f8f8 solid;
	}
	.xw-book-add-icon{
		background: #FB9E3E;
		border-radius: 10rpx;
		width: 90rpx;
		height: 90rpx;
		display: flex;flex-direction: row;align-items: center;justify-content: center;
	}
	
	.xw-book-add-icon .wxfont{
		color: #fff;
		font-size: 58rpx;
	}
	.xw-book-add-item-text{
		flex: 1;
		font-size: 32rpx;
		margin-left: 26rpx;
		// height: 90rpx;
		// line-height: 90rpx;
		// border-bottom: 1px #f8f8f8 solid;
	}
</style>
