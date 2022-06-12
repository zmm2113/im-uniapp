<template>
	<view class="agreement">
		<view class="agreementc">
			<rich-text class="agreement_html" :nodes="richtxt" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'zmm2113@qq.com基础版',
				richtxt: '',
			}
		},
		computed: {},
		onLoad(e) {
			if(e.name){
				this.name=e.name
			}
			this.richtxt='<p> <strong>服务条款确认与接纳</strong> </p> <p style="text-indent: 2em;"> <span style="text-indent: 2em;">'+this.name+'拥有相关软件的所有权和运作权，'+this.name+'享有对其产品的上一切活动的监督、提示、检查、纠正及处罚等权利。用户通过注册程序阅读本服务条款并点击＂注册/登录＂按钮完成注册/登录，即表示用户与'+this.name+'已达成协议，自愿接受本服务条款的所有内容。如果用户不同意服务条款的条件，则不能获得使用'+this.name+'服务以及注册成为'+this.name+'用户的权利。</span> </p> <p> <br/> </p> <p> <strong>使用规则</strong> </p> <p style="text-indent: 2em;"> 1.用户注册成功后，'+this.name+'将给予每个用户一个用户账号及相应的密码，该用户账号和密码由用户负责保管；用户应当对以其用户账号进行的所有活动和事件负法律责任。 </p> <p style="text-indent: 2em;"> 2.用户须对在<span style="text-indent: 32px;">'+this.name+'</span>的注册信息的真实性、合法性、有效性承担全部责任，用户不得冒充他人；不得利用他人的名义发布任何信息；不得恶意使用注册帐户导致其他用户误认；否则<span style="text-indent: 32px;">'+this.name+'</span>有权立即停止提供服务，收回其账号并由用户独自承担由此而产生的一切法律责任。 </p> <p style="text-indent: 2em;"> 3.用户不得使用<span style="text-indent: 32px;">'+this.name+'</span>服务发送或传播敏感信息和违反国家法律制度的信息，包括但不限于下列信息：<br/> </p> <p style="white-space: normal; text-indent: 2em;"> 反对宪法所确定的基本原则的； </p> <p style="white-space: normal; text-indent: 2em;"> 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的； </p> <p style="white-space: normal; text-indent: 2em;"> 损害国家荣誉和利益的； </p> <p style="white-space: normal; text-indent: 2em;"> 煽动民族仇恨、民族岐视，破坏民族团结的； </p> <p style="white-space: normal; text-indent: 2em;"> 破坏国家宗教政策，宣扬邪教和封建迷信散布谣言，扰乱社会秩序，破坏社会稳定的； </p> <p style="white-space: normal; text-indent: 2em;"> 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教峻犯罪的； </p> <p style="white-space: normal; text-indent: 2em;"> 侮辱或者诽谤他人，侵害他人合法权益的； </p> <p style="white-space: normal; text-indent: 2em;"> 含有法律、行政法规禁止的其他内容的。<br/> </p> <p style="text-indent: 2em;"> 4.<span style="text-indent: 32px;">'+this.name+'</span>有权对用户使用<span style="text-indent: 32px;">'+this.name+'</span>的情况进行审查和监督，如用户在使用<span style="text-indent: 32px;">'+this.name+'</span>时违反任何上述规定<span style="text-indent: 32px;">'+this.name+'</span>或其授权的人有权要求用户改正或直接采取一切必要的措施以减轻用户不当行为造成的影响。 </p> <p style="text-indent: 2em;"> 5.盗取他人用户账号或利用网络通讯骚扰他人，均属于非法行为。用户不得采用测试、欺骗等任何非法手段，盗取其他用户的账号和对他人进行强扰。 </p> <p style="text-indent: 2em;"> <br/> </p> <p> <strong>免责声明</strong> </p> <p style="text-indent: 2em;"> 1.<span style="text-indent: 32px;">'+this.name+'</span>不能对用户在本社区回答问题的答案或评论的准确性及合理性进行保证。 </p> <p style="text-indent: 2em;"> 2.若<span style="text-indent: 32px;">'+this.name+'</span>产品已经明示其网络服务提供方式发生变更提醒用户应当注意事项，用户未按要求操作所产生的一切后果由用户自行承担。 </p> <p style="text-indent: 2em;"> 3.用户明确同意其使用<span style="text-indent: 32px;">'+this.name+'</span>产品网络服务所存在的风险将完全由其自己承担；因其使用<span style="text-indent: 32px;">'+this.name+'</span>服务而产生的一切后果也由其自己承担，<span style="text-indent: 32px;">'+this.name+'</span>对用户不承担任何责任。 </p> <p style="text-indent: 2em;"> 4.<span style="text-indent: 32px;">'+this.name+'</span>不保证网络服务一定能满足用户的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作保证。 </p> <p style="text-indent: 2em;"> 5.对于因不可抗力或<span style="text-indent: 32px;">'+this.name+'</span>不能控制的原因造成的网络服务中断或其它缺陷，<span style="text-indent: 32px;">'+this.name+'</span>不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。 </p> <p style="text-indent: 2em;"> 6.用户同意保障和维护<span style="text-indent: 32px;">'+this.name+'</span>及其他用户的利益，用户在<span style="text-indent: 32px;">'+this.name+'</span>发表的内容仅表明其个人的立场和观点，并不代表<span style="text-indent: 32px;">'+this.name+'</span>的立场或观点。由于用户发表内容违法、不真实、不正当、侵犯第三方合法权益，或用户违反本协议项下的任何条款而给<span style="text-indent: 32px;">'+this.name+'</span>或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任。 </p> <p style="text-indent: 2em;"> <br/> </p> <p> <strong>服务条款的修改</strong> </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">'+this.name+'</span>会在必要时修改服务条款，服务条款ー旦发生变动，<span style="text-indent: 32px;">'+this.name+'</span>将会在用户进入下一步使用前的页面提示修改内容。如果您同意改动，请再一次激活＂我同意＂按钮。如果您不接受，请及时取消您的帐户。用户要继续使用<span style="text-indent: 32px;">'+this.name+'</span>各项服务需要两方面的确认： </p> <p style="text-indent: 2em;"> 1.首先确认<span style="text-indent: 32px;">'+this.name+'</span>服务条款及其变动。 </p> <p style="text-indent: 2em;"> 2.同意接受所有的服务条款限制。 </p> <p style="text-indent: 2em;"> <br/> </p> <p> <strong>隐私政策</strong> </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">'+this.name+'</span>非常重视对用户隐私权的保护，承诺不会在未获得用户许可的情况下擅自将用户的个人资料信息出租或出售给任何第三方，但以下情况除外： </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;">您同意让第三方共享资料；</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;">您同意公开你的个人资料，享受为您提供的产品和服务；</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;">本站需要听从法庭传票、法律命令或遵循法律；</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;">本站发现您违反了本站服务条款或本站其它使用规定；</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;">在本应用平台上创建的某一交易中，如交易任何一方履行或部分履行了交易义务并提出信息披露请求的，本应用有权决定向该用户提供其交易对方的联络方式等必要信息，以促成交易的完成或纠纷的解决。</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;"><span style="color: rgb(64, 64, 64); font-family: -apple-system, BlinkMacSystemFont, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Segoe UI&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; background-color: rgb(255, 255, 255);"><br/></span></span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 0em;"><span style="text-indent: 32px;">'+this.name+'</span><span style="text-indent: 32px;">在哪些方面用到了您的信息：</span></span> </p> <p style="text-indent: 2em;"> 登陆注册功能，用户注册时输入的个人信息仅用于验证用户真实性； </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">您有权选择接受或拒绝接受</span><span style="text-indent: 32px;">本政策</span><span style="text-indent: 32px;">。但如果您选择拒绝接受<span style="text-indent: 32px;">本政策</span>，则您可能无法登录或使用依赖于<span style="text-indent: 32px;">本政策</span>的网络服务或功能。</span> </p> <p style="text-indent: 2em;"> <br/> </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">信息的存储和交换：</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">本应用收集的有关您的信息和资料将保存在本应用及（或）其关联的服务器上，这些信息和资料均存储在中国境内服务器。</span> </p> <p style="text-indent: 2em;"> <br/> </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">隐私政策的更改</span><span style="text-indent: 32px;">：</span> </p> <p style="text-indent: 2em;"> <span style="text-indent: 32px;">如果决定更改隐私政策，我们会在本政策中、官方网站中以及我们认为适当的位置发布这些更改，以便您了解我们如何收集、使用您的个人信息，哪</span><span style="text-indent: 32px;">些人可以访问这些信息，以及在什么情况下我们会透露这些信息。</span></p>'
		},
		methods: {}
	}
</script>

<style scoped>
	.agreement {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		margin-top: 24rpx;
	}

	.agreementc {
		background: #fff;
		padding: 24rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.agreementc image,
	.agreementc img {
		max-width: 100%;
	}
</style>
