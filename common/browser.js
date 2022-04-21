export default {
	init: function(options) {
		this.initWebview(options)
		this.handleEvent()
		return this
	},
	initWebview: function(options) {
		var hh=plus.screen.height-44
		var _self = this
		_self.webview = plus.webview.create('', 'browser', {
			scalable:true,
			height:hh+'px',
			bottom:'44px',
			background:'#ff5500',
			titleNView: {
				backgroundColor: '#FFFFFF',
				progress: { //进度条
					color: '#4678e7',
					height: '3px'
				},
				splitLine: { //底部分割线
					color: '#cccccc',
					height: '1px'
				},
				buttons: [{ //关闭按钮
					'float': 'left',
					fontSrc: '/static/uni.ttf',
					text: '\ue460',
					onclick: _self.close.bind(_self)
				}, { //更多按钮
					'float': 'right',
					fontSrc: '/static/uni.ttf',
					text: '\ue507',
					onclick: _self.more.bind(_self)
				}]
			},
			additionalHttpHeaders: options.headers || {}
		})
		// 配置下拉刷新
		_self.webview.setPullToRefresh({
			support: true
		}, function() {
			_self.reload()
			var titleUpdate = function() {
				setTimeout(function() {
					_self.webview.endPullToRefresh()
					_self.webview.removeEventListener('titleUpdate', titleUpdate)
				}, 300)
			};
			_self.webview.addEventListener('titleUpdate', titleUpdate)
		})

		//绘制返回前进按钮
		this.navBottom = new plus.nativeObj.View("navBottom", {
			bottom: '0px',
			left: '0px',
			height: '44px',
			width: '100%',
			backgroundColor: 'rgb(255,255,255)'
		})
		var screenWidth = plus.screen.resolutionWidth
		var left = screenWidth / 4
		this.navBottom.draw([{
				tag: 'font',
				id: 'back',
				text: '\ue471',
				textStyles: {
					fontSrc: '/static/uni.ttf',
					size: '24px',
					color: '#000000'
				},
				position: {
					right: left+48,
					height: '100%',
				}
			},
			{
				tag: 'font',
				id: 'forward',
				text: '\ue470',
				textStyles: {
					fontSrc: '/static/uni.ttf',
					size: '24px',
					color: '#000000'
				},
				position: {
					left: left,
					height: '100%',
				}
			}
		])

		//点击前进或后退
		this.navBottom.addEventListener("click", (e) => {
			if (e.clientX > left && e.clientX < (left + 24)) {
				_self.back()
			}
			if (e.clientX > (screenWidth - left - 12) && e.clientX < (screenWidth - left + 12)) {
				_self.forward()
			}
		})

		//监听页面变化
		_self.webview.addEventListener('loaded', function() {
			_self.webview.canBack(function(event) {
				var canBack = false
				if (event.canBack) {
					canBack = true
					_self.navBottom.show()
				} else {
					canBack = false
				}
				_self.webview.canForward(function(event) {
					if (event.canForward) {
						_self.navBottom.drawText('\ue470', {
							left: left,
							height: '100%'
						}, {
							color: '#000000',
							fontSrc: '/static/uni.ttf',
							size: '24px'
						}, 'forward')
					} else {
						_self.navBottom.drawText('\ue470', {
							left: left,
							height: '100%'
						}, {
							color: '#EEEEEE',
							fontSrc: '/static/uni.ttf',
							size: '24px'
						}, 'forward')
					}
					if (!canBack && !event.canForward) {
						// _self.navBottom.hide()
					}
				})
			})
			_self.navBottom.show()
		}, false)
	},
	handleEvent: function(url) {
		var _self = this
		plus.key.addEventListener('backbutton', function() {
			_self.close()
			return
			var topWebview = plus.webview.getTopWebview()
			// 不等于浏览器窗口
			if (topWebview.id !== 'browser') {
				// 这里除了浏览器窗口就是首页了，直接退出了；
				plus.runtime.quit()
			} else {
				_self.back()
			}
		})
	},
	show: function(url) {
		url = url || 'https://www.baidu.com'
		this.webview.loadURL(url)
		this.webview.show('slide-in-right')
	},
	more: function() {
		var _self = this
		uni.showActionSheet({
			itemList: ['刷新', '浏览器打开'],
			success: function(res) {
				if (res.tapIndex == 0) {
					_self.reload()
				} else if (res.tapIndex == 1) {
					plus.runtime.openURL(_self.webview.getURL())
				}
			}
		})
	},
	reload: function() {
		// 刷新
		this.webview.reload(true)
	},
	back: function() {
		//后退
		var _self = this
		_self.webview.canBack(function(event) {
			if (event.canBack) {
				_self.webview.back()
			} else {
				_self.close()
			}
		})
	},
	forward: function() {
		//前进
		var _self = this
		_self.webview.canForward(function(event) {
			if (event.canForward) {
				_self.webview.forward();
			} else {
				plus.nativeUI.toast('没有可前进的地址')
			}
		})
	},
	close: function() {
		//关闭
		// this.navBottom.hide()
		this.navBottom.close()
		this.navBottom=null;
		this.webview.close('browser', 'slide-out-right')
		this.webview.clear()
		plus.key.removeEventListener("backbutton", function() {
		});
	}
}
