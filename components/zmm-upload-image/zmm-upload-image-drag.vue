<template>
	<view @touchmove.stop.prevent="moveHandle" class="moveWrap">
		<movable-area class="movarea" ref="areaBox" id="areaBox" :style="{height:imgSize*rowNum  +200+ 'rpx'}">
			<view class="imgBox" :style="{height:imgSize*rowNum  + 'rpx'}">
				<view :id="'img' + idx" class="imgItem" v-for="(item, idx) in imgList" :key="idx"
					:style="{transition:addJump?' all 0.5s':'',opacity:idx===selectIdx?'0':'1', width: imgSize + 'rpx', height: imgSize + 'rpx', borderRadius:imgRadius+'rpx',padding:imgPadding+'rpx',left:(hoverImgIdx==='img'+idx?curHoverBoxMove.x+'rpx':''),top:(hoverImgIdx==='img'+idx?curHoverBoxMove.y+'rpx':'')}">
					<view class="imgItem-img" @tap="itemclick(item,idx)" @touchstart="tstr(idx, $event)" @touchmove="tsmo" @touchend="toend">
						<image v-if="item.videoUrl" class="imgItem-play" src="../../static/img/bf.png" mode="aspectFill"></image>
						<image :style="{borderRadius:imgRadius+'rpx' }" :ref="'img' + idx" :src="item.url" mode="aspectFill"></image>
					</view>
				</view>
				<slot></slot>
			</view>
			<movable-view v-if="moveSrc" :animation="false" class="moveV" :x="x" :y="y" direction="all"
				@change="onChange"
				:style="{ width: imgSize + 'rpx', height: imgSize + 'rpx',padding:imgPadding+'rpx' }">
				<image v-if="moveSrc.videoUrl" class="imgItem-play" src="../../static/img/bf.png" mode="aspectFill"></image>
				<image :style="{borderRadius:imgRadius+'rpx' }" :src="moveSrc.url" mode="aspectFill"></image>
			</movable-view>
		</movable-area>
		<view v-if="showDelete">
			<view class="delete" :class="{'deleteType':deleteType}">
			   <text v-if="deleteType">松开删除</text>
			   <text v-else>拖动到此处删除</text>
			  </view>
		</view>
	</view>
</template>
<script>
	export default {
		emits:['itemclick','update:imgList','deleteImage','change','moveEndList'],
		props: {
			//图片列表
			imgList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			//图片大小
			imgSize: {
				type: Number
			},
			//图片间距
			imgPadding: {
				type: Number
			},
			//图片行数
			rowNum: {
				type: Number
			},
			//图片圆角
			imgRadius: {
				type: Number
			}
		},
		components: {},
		data() {
			return {
				showDelete:false,
				touchobj:null,
				deleteType:false,
				addJump:false,
				areaBoxInfo: {},
				x: 0,
				y: 0,
				selectIdx: null,
				moveSrc: null,
				areaBoxTop: 0,
				hoverImgIdx: '',
				inBoxXY: {},
				curHoverBoxMove: {
					x: 0,
					y: 0
				}
			};
		},
		watch: {
			hoverImgIdx(e) {
				let idx = this.selectIdx
				let hoverIdx = parseInt(e.split('img')[1]);
				if (this.imgList[idx]) {
					let selectRow = this.imgList[idx].y / uni.upx2px(this.imgSize)
					let selectColum= this.imgList[idx].x / uni.upx2px(this.imgSize)
					let hoverRow = this.imgList[hoverIdx].y / uni.upx2px(this.imgSize)
					let hoverColum= this.imgList[hoverIdx].x / uni.upx2px(this.imgSize)
					let left =  -(this.imgSize * (hoverColum - selectColum))
					let top= -(this.imgSize * (hoverRow - selectRow))
					this.curHoverBoxMove = {
						x: left,
						y: top,
					}
				}
			},
			// imgList(e){
			// 	console.log('变化了item')
			// 	this.$nextTick(()=>{
			// 		this.setImgXy()
			// 	})
			// }
			imgList: {
				deep: true,//深度监听可见听对象中的元素变化例:obj.id
				immediate:false,//在进入页面时，第一次绑定值，不会立刻执行监听，只有数据发生改变才会执行handler中的操作
				handler(val) {//watch事件
					// console.log('变化了item')
					this.$nextTick(()=>{
						this.setImgXy()
					})
				}
			}
		},
		methods: {
			itemclick(e,i){
				this.$emit('itemclick',e,i)
			},
			moveHandle() {
				return;
			},
			deleteImage: function(e) {
				var index = e
				var deletedImage = this.imgList[index]
				this.imgList.splice(index, 1)
				this.$emit('deleteImage', deletedImage)
			},
			onChange(e) {
				var boxHeight=this.imgSize * this.rowNum
				var deleteHeight=(boxHeight-80)/2
				if(e.detail.y>deleteHeight){
					this.deleteType=true
				}else{
					this.deleteType=false
				}
				this.showDelete=true
				this.$emit('change',e)
			},
			tstr(e, s) {
				this.touchobj=this.imgList[e]
				this.addJump=true
				this.getDomInfo('areaBox', info => {
					this.areaBoxInfo = info;
					//获取拖拽区域的上边距和下边距
					let areaBoxTop = this.areaBoxInfo.top;
					let areaBoxLeft = this.areaBoxInfo.left;
					
					// 设置可移动方块的初始位置为当前所选中图片的位置坐标
					this.x = this.imgList[e].x;
					this.y = this.imgList[e].y;
					//显示可移动方块
					this.moveSrc = this.imgList[e];
					//保存当前所选择的图片索引
					this.selectIdx = e;
					var x = s.changedTouches[0].clientX - areaBoxLeft;
					var y = s.changedTouches[0].clientY - areaBoxTop;
					// 保存鼠标在图片内的坐标
					this.inBoxXY = {
						x: x - this.imgList[e].x,
						y: y - this.imgList[e].y,
					}
				});
				
			},
			tsmo(e) {
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				let imgSize = this.imgSize;
				//重置为以拖拽盒子左上角为坐标原点
				var x = e.changedTouches[0].clientX - areaBoxLeft;
				var y = e.changedTouches[0].clientY - areaBoxTop;
				this.x = x - this.inBoxXY.x;
				this.y = y - this.inBoxXY.y;
				this.imgList.forEach((item, idx) => {
					if (x > item.x && x < item.x + imgSize && y > item.y && y < item.y + imgSize) {
						this.hoverImgIdx = 'img' + idx
					}
				});
			},
			toend(e) {
				this.addJump=false
				if(this.deleteType){
					this.deleteImage(this.selectIdx)
				}else{
					// 移动结束隐藏可移动方块
					let beforeIdx = this.selectIdx;
					let afterIdx = parseInt(this.hoverImgIdx.split('img')[1]);
					if (this.hoverImgIdx !== '' && beforeIdx !== afterIdx) {
						this.imgList[beforeIdx] = this.imgList[afterIdx];
						this.imgList[afterIdx] = this.moveSrc;
						this.$emit('moveEndList', this.imgList);
					}
				}
				this.moveSrc = '';
				this.hoverImgIdx = ''
				this.selectIdx = null
				this.deleteType=false
				this.showDelete=false
				this.$nextTick(()=>{
					this.setImgXy()
				})
			},
			getDomInfo(id, callBack) {
				const query = uni.createSelectorQuery().in(this);
				query.select('#' + id)
					.boundingClientRect()
					.exec(function(res) {
						callBack(res[0]);
					});
			},
			setImgXy(){//设置每个图片的基础xy轴
				this.getDomInfo('areaBox', info => {
					this.areaBoxInfo = info;
					// 设置区域内所有图片的左上角坐标
					this.imgList.forEach((item, idx) => {
						this.getDomInfo('img' + idx, res => {
							item.x = res.left - info.left;
						});
						this.getDomInfo('img' + idx, res => {
							item.y = res.top - info.top;
						});
					});
				});
			}
		},
		mounted() {
			this.setImgXy()
		}
	};
</script>

<style lang="scss" scoped>
	.imgItem-play{
		z-index: 1;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 80rpx !important;
		height: 80rpx !important;
		transform: translate(-50%,-50%);
	}
	.movarea {
		width: 100%;
		height: 320rpx;
		display: flex;
		flex-direction: row;
	}
	.imgBox {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 320rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.imgItem {
			position: relative;
			box-sizing: border-box;
			left: 0;
			top: 0;
			box-sizing: border-box;
			image {
				width: 100%;
				height: 100%;
				// transition: all 0.2s;
				vertical-align: top;
			}
		}
	}

	.moveV {
		opacity: 0.6;
		z-index: 0;
		box-sizing: border-box;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.select {
		opacity: 0;
	}
	.zmm-upload-image-deleteIcon {
		right: 0rpx;
		top: 0rpx;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.3);
		width: 36rpx;
		height: 36rpx;
		text-align: center;
		border-radius: 50%;
		color: white;
		font-size: 30rpx;
		z-index: 2;
		display: flex;flex-direction: row;align-items: center;justify-content: center;
	}
	.delete{
	  position: absolute;
	  bottom: 0rpx;
	  left: 0;
	  width: 100%;
	  height: 80rpx;
	  line-height: 80rpx;
	  background: #C04A42;
	  text-align: center;
	  transition: all 0.3s;
	 }
	 .delete text{
		 color: #fff;
	 }
	 .deleteType{
		 transform: scale(1.1);
	 }
	 .moveWrap{
		 position: relative;
	 }
	 .imgItem-img{
		 width: 100%;
		 height: 100%;
	 }
</style>
