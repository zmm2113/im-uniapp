<template>
	<view class="zmm-picker-region" :style="{'cursor':disabled ? 'move' : 'default'}">
		<picker
			:disabled="disabled"
			mode="multiSelector"
			@columnchange="Citycolumnchange($event)"
			@change="pickerchange"
			:value="Index"
			:range="pickerArr"
			range-key="label"
			@tap="iconopen"
			@cancel="opend = false"
		>
			<view class="zmm-picker-region-uni-input" :style="{'color':disabled ? '#666' : '#333'}" :class="{ 'zmm-picker-region-placeholder': modelValue == '' }">
				<text :style="{ 'text-align': textAlign }" v-if="modelValue == ''">{{ placeholder }}</text>
				<text :style="{ 'text-align': textAlign }" v-else>{{ modelValue }}</text>
			</view>
		</picker>
	</view>
</template>

<script>
import citydata from '@/common/city.js';
export default {
	emits: ['update:modelValue','change'],
	data() {
		return {
			opend: false,
			Index: [0,0,0],
			citydata:citydata.data
		};
	},
	behaviors: ['uni://form-field'], //必须要写不然微信小程序收不到值
	props: {
		rangeLeave:{//联动级别
			type:Number,
			default:2
		},
		textAlign: {
			type: String,
			default: 'center'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: '请点击选择'
		},
		modelValue: {
			type: [String]
		}
	},
	mounted() {
	},
	computed:{
		pickerArr(){
			var arr=[]
			function findarr(arrx){
				var arr=[]
				for (var i = 0; i < arrx.length; i++) {
					var item = arrx[i]
					arr.push({
						label:item.label,
						value:item.value,
						position:item.position
					})
				}
				return arr
			}
			for (var i = 0; i < this.rangeLeave; i++) {
				arr.push([])
				if(i==0){//一级数据
					arr[i]=findarr(this.citydata)
				}
				if(i==1){//二级数据
					if(this.citydata[this.Index[0]]){
						arr[i]=findarr(this.citydata[this.Index[0]]['children'])
					}else{
						arr[i]=[]
					}
				}
				if(i==2){//三级数据
					if(this.citydata[this.Index[0]]&&this.citydata[this.Index[0]]['children'][this.Index[1]]){
						arr[i]=findarr(this.citydata[this.Index[0]]['children'][this.Index[1]]['children'])
					}else{
						arr[i]=[]
					}
				}
			}
			return arr
		}
	},
	watch: {
		modelValue:{
			deep: true,
			immediate:true,
			handler(val) {
				this.iniIndex()
			}
		}
	},
	methods: {
		iniIndex(){
			var arr=this.modelValue.split(',')
			function findLabelIndex(arr,label){
				if(!label){
					return 0
				}
				for (var i = 0; i < arr.length; i++) {
					if(arr[i].label==label){
						return i
						break;
					}
				}
				return 0
			}
			for (var i = 0; i < arr.length; i++) {
				this.Index[i]=findLabelIndex(this.pickerArr[i],arr[i])
			}
		},
		iconopen() {
			if (this.disabled) {
				return;
			}
			this.opend = true;
		},
		pickerchange(e) {
			var text=[]
			if(this.rangeLeave==1){
				text.push(this.pickerArr[0][e.detail.value[0]].label)
			}
			if(this.rangeLeave==2){
				text.push(this.pickerArr[0][e.detail.value[0]].label)
				text.push(this.pickerArr[1][e.detail.value[1]].label)
			}
			if(this.rangeLeave==3){
				text.push(this.pickerArr[0][e.detail.value[0]].label)
				text.push(this.pickerArr[1][e.detail.value[1]].label)
				text.push(this.pickerArr[2][e.detail.value[2]].label)
			}
			this.opend = !this.opend;
			this.$emit('update:modelValue', text.toString());
			this.$emit('change', text.toString())
		},
		Citycolumnchange(e) {
			if (e.detail.column == 0&&this.rangeLeave>1) {//第一行发生变化重置第二列索引
				this.Index.splice(1, 1, 0);
			}
			if (e.detail.column == 1&&this.rangeLeave>2) {
				this.Index.splice(2, 1, 0);
			}
			this.Index[e.detail.column] = e.detail.value;//设置index
			this.$forceUpdate();
		},
	}
};
</script>

<style>
.zmm-picker-region {
}
.zmm-picker-region-uni-input {
	height: 90rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background-color: #fff;
}

.zmm-picker-region-uni-input text {
	flex: 1;
	font-size: 28rpx;
	padding:0 12rpx;
}


.zmm-picker-region-placeholder {
	width: 100%;
}
.zmm-picker-region-placeholder text{
	color: #666;
	
}
</style>
