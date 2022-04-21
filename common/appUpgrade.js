var _maskView, _contentView, _downloadTask, _loadingProgress, _screenHeight, _screenWidth, _config = {
		forceUpgrade: false,
		titleText: "版本更新",
		content: "",
		contentAlign: "left",
		loadingColor: "#329EEE",
		cancelText: "暂不升级",
		cancelColor: "#666",
		confirmText: "立即升级",
		confirmColor: "#329EEE",
		windowHeight: 380,
		packageUrl: "",
		browser: false,
		maskColor: "rgba(0,0,0,0.3)"
	},
	_calculatePosition = function() {
		return {
			top: (_screenHeight - _config.windowHeight) / 2,
			left: _screenWidth * .05,
			width: _screenWidth * .9,
			right: _screenWidth * .05,
			height: _config.windowHeight
		}
	},
	_createMask = function() {
		_maskView = new plus.nativeObj.View("maskView", {
			top: "0px",
			left: "0px",
			width: "100%",
			height: "100%",
			backgroundColor: _config.maskColor
		})
	},
	_createContentView = function() {
		var calculatePosition = _calculatePosition();
		_contentView = new plus.nativeObj.View("contentView", {
			top: calculatePosition.top + "px",
			left: calculatePosition.left + "px",
			height: _config.windowHeight + "px",
			width: calculatePosition.width + "px",
			overflow: "auto"
		});
		_contentView.drawRect({
			color: "#ffffff",
			radius: "20px"
		}, {
			width: "100%",
			height: "100%"
		}, "roundedRect");
		_contentView.drawText(_config.titleText, {
			top: "20px",
			height: "20px",
		}, {
			size: "16px",
			color: "#333",
			align: "center",
		}, "titleText");
		_contentView.drawText(_config.content, {
			top: "60px",
			left: "20px",
			right: "20px",
			height: _config.windowHeight - 120 + "px",
		}, {
			size: "16px",
			color: "#666",
			align: _config.contentAlign,
			verticalAlign: "top",
			whiteSpace: "normal",
			overflow: "ellipsis"
		}, "UpdaterContent");
		_createLoading(-2);
		var top = _config.windowHeight - 60 + 15;
		var fontSize = '16px';
		if (!_config.forceUpgrade) {
			_contentView.drawRichText("<font style=\"font-size:" + fontSize + ";\" color=\"" + _config.cancelColor +
				"\">" + _config
				.cancelText + "</font>", {
					width: "50%",
					top: top + "px",
					left: "0px"
				}, {
					align: "center",
					onClick: function() {
						close()
					}
				}, "cancel");
			_contentView.drawRichText("<font color=\"" + _config.confirmColor +
				"\" style=\"font-size:" + fontSize + ";\">" +
				_config.confirmText + "</font>", {
					width: "50%",
					right: "0px",
					top: top + "px"
				}, {
					align: "center",
					onClick: function() {
						_config.packageUrl ? "android" === plus.os.name.toLowerCase() ? _config.browser ? (plus
							.runtime.openURL(_config.packageUrl)) : _createTask() : plus.runtime.openURL(
							_config.packageUrl) : uni.showToast({
							title: "安装包地址为空",
							icon: "none"
						})
					}
				}, "submit")
		} else {
			_contentView.drawRichText("<font color=\"" + _config.confirmColor + "\" style=\"font-size:" + fontSize +
				";\">" +
				_config.confirmText + "</font>", {
					width: "100%",
					right: "0px",
					top: top + "px"
				}, {
					align: "center",
					onClick: function() {
						_config.packageUrl ? "android" === plus.os.name.toLowerCase() ? _config.browser ? (plus
							.runtime.openURL(_config.packageUrl)) : _createTask() : plus.runtime.openURL(
							_config.packageUrl) : uni.showToast({
							title: "安装包地址为空",
							icon: "none"
						})
					}
				}, "submit")
		}
	},
	_createLoading = function(progress) {
		var calculatePosition = _calculatePosition();
		var top = _config.windowHeight - 65;
		var width = 0 <= progress ? (calculatePosition.width - 100) / 100 * progress : 0;
		width = parseInt(width);
		var text = 100 <= progress ? "下载完成" : "下载中...";
		var loadingText = "";
		loadingText = -1 == progress ? "资源加载中..." : 0 <= progress ? text + "(" + progress + "%)" : "";
		_contentView.drawRect({
			color: _config.loadingColor
		}, {
			width: width + "px",
			height: "3px",
			left: "20px",
			top: top + "px"
		}, "loading");
		_contentView.drawRichText("<font color=\"" + _config.loadingColor + "\">" + loadingText + "</font>", {
			width: "100px",
			top: top + "px",
			left: width + "px"
		}, {
			align: "center"
		}, "loadingText")
	},
	_createTask = function() {
		return _downloadTask ? void console.log("正在下载中") : void(_createLoading(-1),
			_downloadTask =
			uni.downloadFile({
				url: _config.packageUrl,
				success: function(res) {
					if (200 === res.statusCode) {
						var tempFilePath = res.tempFilePath;
						uni.saveFile({
							tempFilePath: tempFilePath,
							success: function(res) {
								plus.runtime.install(res.savedFilePath, {
									force: true
								}, function(res) {
									console.log('安装包信息' + JSON.stringify(res))
								}, function(res) {
									uni.showToast({
										title: '安装失败，请检查下载链接',
										icon: 'none',
										duration: 3000
									});
								});
								close();
							}
						})
					}
				}
			}), _downloadTask.onProgressUpdate(function(res) {
				_loadingProgress != res.progress && (_loadingProgress = res.progress, _createLoading(res
					.progress));
			}))
	},
	init = function(option) {
		_screenHeight = plus.screen.resolutionHeight;
		_screenWidth = plus.screen.resolutionWidth;
		_downloadTask = null;
		option.titleText && (_config.titleText = option.titleText);
		option.windowHeight && (_config.windowHeight = option.windowHeight);
		option.forceUpgrade && (_config.forceUpgrade = option.forceUpgrade);
		option.content && (_config.content = option.content);
		option.contentAlign && (_config.contentAlign = option.contentAlign);
		option.loadingColor && (_config.loadingColor = option.loadingColor);
		option.cancelText && (_config.cancelText = option.cancelText);
		option.cancelColor && (_config.cancelColor = option.cancelColor);
		option.confirmText && (_config.confirmText = option.confirmText);
		option.confirmColor && (_config.confirmColor = option.confirmColor);
		option.packageUrl && (_config.packageUrl = option.packageUrl);
		option.browser && (_config.browser = option.browser);
		option.maskColor && (_config.maskColor = option.maskColor);
		_createMask();
		_createContentView();
	},
	show = function() {
		_maskView && _maskView.show();
		_contentView && _contentView.show();
	},
	close = function() {
		_downloadTask && (_downloadTask.abort(), _downloadTask = null, _createLoading(-2));
		_maskView && _maskView.hide();
		_contentView && _contentView.hide();
	};
export default {
	init: init,
	show: show,
	close: close
}
