<template>
	<view>
		<radio-group class="zmm-radio-group" @change="radioChange">
			<label class="zmm-radio-group-label" v-for="(item,index) in ranges" :key="index" :class="{'checked':index === current}">
				<view class="zmm-radio-group-radio">
					<radio style="transform:scale(0.9)" :value="item.value" :checked="index === current" />
				</view>
				<view class="zmm-radio-group-label-text">{{ item.label }}</view>
				<uni-icons class="zmm-radio-group-label-icon" type="checkmarkempty" color="#09C160" size="20"></uni-icons>
			</label>
		</radio-group>
	</view>
</template>

<script>
export default {
	emits: ['update:modelValue','change'],
	data() {
		return {
			current: '',
			val: '',
			ranges: []
		};
	},
	props: {
		modelValue: {
			type: [String]
		},
		range: {
			//数组label value
			type: Array,
			default: []
		}
	},
	watch: {
		range(v) {
			this.init();
		},
		modelValue(val) {
			this.init();
		},
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.ranges = JSON.parse(JSON.stringify(this.range));
			this.getval(this.modelValue);
		},
		getval(e) {
			if (!e) {
				return;
			}
			var val = e;
			var items = this.ranges;
			for (var i = 0; i < items.length; ++i) {
				const item = items[i];
				if (item.value==val) {
					this.current=i
					break;
				}
			}
		},
		radioChange(e) {
			this.getval(e.detail.value);
			this.$emit('update:modelValue', e.detail.value)
			this.$emit('change', e.detail.value)
		}
	}
};
</script>
<style>
.zmm-radio-group {
	display: flex;
	flex-direction: column;
}
.zmm-radio-group-radio{
	display: none;
}
.zmm-radio-group-label.checked{
}
.zmm-radio-group-label-icon{display: none;}
.zmm-radio-group-label.checked .zmm-radio-group-label-icon{
	display: block;
}
.zmm-radio-group-label {
	height: 90rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #fff;
	border-bottom: 1px #eee solid;
	padding: 24rpx;
}
.zmm-radio-group-label:nth-last-child(1){
	margin-right: 0;
}
.zmm-radio-group-label-text{
	margin-left: 10rpx;
	font-size: 28rpx;
	margin-right: auto;
}
</style>
