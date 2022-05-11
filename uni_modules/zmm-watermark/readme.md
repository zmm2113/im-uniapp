#uniapp水印组件

原理   
循环标签

作者   
`zmm2113@qq.com`

版本  
`1.1.2`
> 兼容性支持：安卓、苹果、H5、微信小程序（其他平台未测试理论上支持）。不支持nvue！

优势  
> 支持富文本、自动计算所需水印数量不卡顿、自定义旋转角度等

一、使用示例
```
<template>
	<view class="container">
		<text>uniapp水印通用组件 zmm-watermark</text>
		<zmm-watermark :watermark="watermark"></zmm-watermark>
	</view>
</template>

<script>
	import img from '@/static/logo.png';
	export default {
		data() {
			return {
				watermark: '<h5>我是h5标签我是h5标签我是h5标签我是h5标签</h5><p style="color:#f00">我是p标签</p><br><img style="width:30px" src="' + img + '" />'
				
			}
		}
	}
</script>
```  
二、配置(注意配置数据类型)

配置|数据类型|默认参数|说明
-|-|-|-
watermark|String|"水印文字"|水印文字(支持html富文本)
color|String|"#000000"|水印文字默认颜色
show|Boolean|true|是否显示水印
opacity|Number|0.15|水印透明度
margin|Number|50|水印之间上下间距
rotate|Number|-21|水印旋转角度
maxWidth|Number|180|单条水印最大宽度