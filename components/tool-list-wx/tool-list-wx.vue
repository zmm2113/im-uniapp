<template>
	<view class="xw-tool-list">
		<view class="xw-tool-list-content" v-if="type=='list'">
			<template v-for="(item, i) in list" :key="i">
				<view class="xw-tool-item" @click="onClick(item,i)" @longpress="onlongpress(item,i)" v-if="item.title">
					<image v-if="item.icon" class="xw-tool-img" :src="item.icon" mode="aspectFill"></image>
					<view class="xw-tool-text">
						<uni-badge v-if="item.type == 'dottext'" text="1" is-dot absolute="rightTop" size="normal">
							<text>{{ item.title }}</text>
						</uni-badge>
						<text v-else>{{ item.title }}</text>
					</view>
					<view class="xw-tool-else">
						<view v-for="(v, index) in item.else" :key="index">
							<uni-badge v-if="v.type == 'dotimg'" class="xw-tool-badge" text="1" is-dot absolute="rightTop" size="normal"><image :src="v.content" mode="aspectFill"></image></uni-badge>
							<image v-if="v.type == 'img'" :src="v.content" mode="aspectFill"></image>
							<uni-badge v-if="v.type == 'dottext'" class="xw-tool-badge" text="1" is-dot absolute="rightTop" size="normal"><view class="text">{{ v.content }}</view></uni-badge>
							<view class="text" v-if="v.type == 'text'">{{ v.content }}</view>
						</view>
					</view>
					<uni-icons v-if="!item.hideRight" class="xw-tool-right" type="right" size="16" color="#b5b5b5"></uni-icons>
				</view>
			</template>
		</view>
		<view class="xw-tool-list-content" v-if="type=='btns'">
			<view class="xw-tool-btn-item" v-for="(item, i) in list" :key="i" @click="onClick(item,i)" @longpress="onlongpress(item,i)">
				<view class="xw-tool-btn-icon wxfont " :class="item.icon"></view>
				<view class="xw-tool-btn-text">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'toolListWx', //微信功能列表
	data() {
		return {};
	},
	emits: ['itemClick','onlongpress'],
	props: {
		list: {
			type: Array
		},
		type: {
			type: String,
			default: 'list' //list列表icon为图片，btns按钮组icon为字体
		}
	},
	methods: {
		onlongpress(e,i){
			this.$emit('onlongpress', e,i);
		},
		onClick(e,i) {
			this.$emit('itemClick', e,i);
			if (e.path=='#') {
				return;
			}
			if (!e.path&&!e.hideRight) {
				uni.showToast({
					title: '未开通',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: e.path
			});
		}
	}
};
</script>

<style scoped>
.xw-tool-list {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	margin-bottom: 18rpx;
}

.xw-tool-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 26rpx 24rpx;
	border-bottom: 1px #eee solid;
}
.xw-tool-item:nth-last-child(1) {
	border: none;
}
.xw-tool-img {
	width: 52rpx;
	height: 52rpx;
	margin-right: 24rpx;
}

.xw-tool-text {
	white-space: nowrap;
	margin-right: auto;
}

.xw-tool-badge {
}

.xw-tool-else {
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
}
.xw-tool-else image {
	width: 60rpx;
	height: 60rpx;
	border-radius: 6rpx;
}
.xw-tool-else .text {
	color: #666;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	max-width: 520rpx;
}
.xw-tool-else image,
.xw-tool-else .text {
	margin-left: 12rpx;
}

.xw-tool-right {
	margin-left: 12rpx;
}
.xw-tool-btn-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 34rpx 44rpx;
	border-bottom: 1px #eee solid;
	font-weight: bold;
	color: #5F698C;
}
.xw-tool-btn-icon{
	margin-right: 14rpx;
}
</style>
