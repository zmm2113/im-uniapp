// 表单验证
// zmm2113@qq.com
/**
 * @property {Object} formData 表单
 * @property {Object} rules 验证规则
  **/
export default {
	error: '',
	check: function(formData, rules) {
		var formDataKeys = Object.keys(formData)
		for (var i = 0; i < formDataKeys.length; i++) {
			var key = formDataKeys[i]
			if (rules[key]) {
				var itemRules = rules[key].rules
				var itemValue = formData[key]
				for (var j = 0; j < itemRules.length; j++) {
					var rule = itemRules[j]
					switch (rule.checkType){
						case 'required'://必填项
							if(!itemValue) {this.error = rule.errorMsg; return false;}
						break;
						
						case 'phone'://手机号码验证
							var reg = /^1[0-9]{10,10}$/;
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
						case 'email'://邮箱验证
							var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
						case 'idcard'://15-18位身份证验证
							var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
						case 'url'://网址验证
							var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
						case 'reg'://正则验证 checkRule必填
							if(!rule.checkRule){
								this.error=key+' 校验失败'
								console.warn(key+' checkRule规则未填写')
								return false;
							}
							var reg = rule.checkRule;
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
						case 'number'://数字
							var reg = /^\d+$/;
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
						case 'same'://是否相同  checkRule必填
							if(!rule.checkRule){
								this.error=key+' 校验失败'
								console.warn(key+' checkRule规则未填写')
								return false;
							}
							if (itemValue!==formData[rule.checkRule]) { this.error = rule.errorMsg; return false; }
						break;
						case 'string'://字符串 checkRule必填
							if(!rule.checkRule){
								this.error=key+' 校验失败'
								console.warn(key+' checkRule规则未填写')
								return false;
							}
							var reg = new RegExp('^.{' + rule.checkRule + '}$');
							if (!reg.test(itemValue)) { this.error = rule.errorMsg; return false; }
						break;
					}
				}
			}
		}
		return true;
	}
}
