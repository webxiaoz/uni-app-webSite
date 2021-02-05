<template>
	<view class="wrap">
		<view class="logo"></view>
		<view class="webText">管理后台</view>
		<view class="tab">
			<view class="tab-item" :class="{active:activeIndex === 1}" @click="activeIndex = 1">登录</view>
			<view class="tab-item" :class="{active:activeIndex === 2}" @click="activeIndex = 2">注册</view>
		</view>
		<view class="loginBox">
			<u-form :model="postForm" ref="postForm" :error-type="errorType" :label-style="labelStyle">
				<u-form-item label="账号" prop="account">
					<u-input v-model="postForm.account" placeholder-style="color:#fff" />
				</u-form-item>
				<u-form-item label="密码" prop="password">
					<u-input v-model="postForm.password" type="password" placeholder-style="color:#fff"/>
				</u-form-item>
				<u-form-item label="邮箱" prop="email" v-if="activeIndex === 2">
					<u-input v-model="postForm.email" placeholder-style="color:#fff"/>
				</u-form-item>
			</u-form>
		</view>
		<view class="loginBtn">
			<u-button @click="login('postForm')" type="primary" style="margin-top: 40rpx;" v-if="activeIndex === 1">登录</u-button>
			<u-button @click="register('postForm')" type="primary" style="margin-top: 40rpx;" v-if="activeIndex === 2">注册</u-button>
			<!-- <view style="margin-top: 24rpx;"><text @click="isRegister = !isRegister;">没有账号? 去注册</text></view> -->
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex:1,
				isRegister:false,
				errorType: ['border-bottom', 'toast'],
				labelStyle: {
					color:'#fff'
				},
				postForm: {
					account: '',
					password: '',
					email: ''
				},
				rules: {
					account: [{
						required: true,
						message: '请输入账号',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱地址',
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			login(formName) {
				let that = this;
				that.$refs[formName].validate(valid => {
					if (valid) {
						// console.log('验证通过');
						uni.showLoading({
							title:'登录中...'
						})
						let params = that.postForm;
						that.$request({
							method: "POST",
							url: '/api/auth/login',
							data: params,
							success: (res) => {
								if (res.data.code == 200) {
									uni.hideLoading();
									uni.setStorage({
										key: 'TOKEN',
										data: res.data.token,
										success: function() {
											that.$refs.uToast.show({
												title: '登录成功',
												type: 'success',
												isTab:true,
												url: '/pages/dashboard/dashboard'
											})
										}
									});
								} else {
									uni.hideLoading();
									that.$refs.uToast.show({
										title: res.data.msg,
										type: 'error',
										// url: '/pages/user/index'
									})
								}
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			register(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						uni.showLoading({
							title:'注册中...'
						})
						// console.log('验证通过');
						let params = this.postForm;
						this.$request({
							method: "POST",
							url: '/api/auth/register',
							data: params,
							success: (res) => {
								if (res.data.code == 200) {
									uni.hideLoading();
									this.$refs.uToast.show({
										title: '注册成功',
										type: 'success',
									})
									this.isRegister = false;
								} else {
									uni.hideLoading();
									this.$refs.uToast.show({
										title: res.data.msg,
										type: 'error',
										// url: '/pages/user/index'
									})
								}
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.postForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		min-height: 100%;
		width: 100%;
		background: url('https://jinfu-my-oss.oss-cn-hangzhou.aliyuncs.com/test/20210205/48a492bc3f43454db1f33b68b14aabd7.png') no-repeat;
		background-size: 100% 100%;
		position: absolute;
		color: #FFFFFF;
		.logo{
			width: 100rpx;
			height: 100rpx;
			background-color: #fff;
			text-align: center;
			margin: 300rpx auto 100rpx auto;
		}
		.webText{
			height: 80rpx;
			color: #FFFFFF;
			font-size: 18px;
			font-weight: bold;
			margin: 0 auto;
			text-align: center;
		}
		.tab{
			height: 120rpx;
			width: 100%;
			.tab-item{
				display: inline-block;
				padding: 24rpx;
				margin-left: 24rpx;
			}
			.active{
				border-bottom: 2rpx solid #FFFFFF;
			}
		}
		.loginBox {
			width: 100%;
			padding: 0 24rpx;	
		}
		.loginBtn{
			margin-top: 60rpx;
			padding: 0 24rpx;
		}
	}
</style>
