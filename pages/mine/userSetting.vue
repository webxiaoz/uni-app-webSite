<template>
	<!-- 个人设置页面 -->
	<view class="wrap">
		<u-cell-group title=" ">
			<u-cell-item title="我的头像" :arrow="true" arrow-direction="right"  @click="chooseAvatar">
				<view class="slot_content">
					<u-image width="100rpx" height="100rpx" :src="userInfo.icon" shape="circle"></u-image>
				</view>
			</u-cell-item>
			<u-cell-item title="我的姓名" :arrow="false">
				<view class="slot_content">
					{{userInfo.realName}}
					<!-- <u-input disabled placeholder="我的姓名" v-model="userInfo.realName" :type="type" :border="border" /> -->
				</view>
			</u-cell-item>
			<u-cell-item title="账号" :arrow="false">
				<view class="slot_content">
					{{userInfo.account}}
				</view>
			</u-cell-item>
			<!-- <u-cell-item title="所在地区" :arrow="true" arrow-direction="right" @click="showAddress = true">
				<view class="slot_content" @click="showAddress = true">
					{{userInfo.address}}
				</view>
				<view>
					<u-picker @confirm="changeAddress" mode="region" confirm-color="#01AD67" v-model="showAddress" :default-region='["浙江省", "嘉兴市", "平湖市"]'
					 :params="params"></u-picker>
				</view>
			</u-cell-item> -->
			<!-- <u-cell-item title="绑定微信" :arrow="true" arrow-direction="right" @click="bindWchartFun">
				<view class="slot_content" @click="bindWchartFun">
					{{bindText}}
				</view>
			</u-cell-item> -->
			<u-cell-item title="您的身份" :arrow="false">
				<view class="slot_content">
					{{userInfo.roleName}}
				</view>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="15" bg-color="#ecf5ff"></u-gap>
		<view class="loginout" @click="bindWchartFun">
			退出登录
		</view>
		<view style="height: 100rpx;"></view>
		<u-top-tips ref="uTips"></u-top-tips>
		<!-- 退出登录 -->
		<u-modal show-cancel-button confirm-color="#01AD67" @confirm="sureBindUserFun" v-model="show" :content="content" :mask-close-able="true"></u-modal>
		<!-- <u-button @click="loginOut()"> 退出登录</u-button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				content: '',
				bindText: '已绑定', //用户绑定微信情况
				roleId: '', //选中的身份ID
				roleName: '', //选中的身份名称
				showAddress: false,
				showUserType: false,
				userInfo: {
					realName: '',
					account: '',
					icon: '',
					address: '',
					roleName: '',
					authState: '',
					enterpriseAuthState: ''
				},
				params: {
					province: true,
					city: true,
					area: true
				},
				selector: [],

			};
		},
		methods: {
			/**
			 * 更换手机号
			 */
			changeMobile() {
				console.log('修改手机号>>>>>>>>>>')
				uni.navigateTo({
					url: '/pages/changeMobile/changeMobile',
				})
			},
			/**
			 * 企业认证
			 */
			enterpriseCertification() {
				let that = this;
				// if (that.userInfo.enterpriseAuthState == 5) {
				// 	//已认证
				// 	return;
				// }
				uni.navigateTo({
					url: '/pages/personalCertification/personalCertification?type=1',
				})
			},
			/**
			 * 绑定微信弹窗确认事件
			 */
			sureBindUserFun() {
				let that = this;
				that.loginOut();
			},
			/**
			 * 绑定微信弹窗事件
			 */
			bindWchartFun() {
				let that = this;
				that.content = '是否退出登录？';
				that.show = true;
			},
			/**
			 * @查询用户绑定微信情况
			 */
			getUserBindSituation() {
				let that = this;
				that.$request({
					url: '/auth/verifyWxLogin/0813QYll2XXqg64Fv0ol28Tniw13QYlY',
					success: function(res) {
						let data = res.data || {};
						let datas = data.data || [];
						let code = data.code || '';
						if (code == 500) {
							//未绑定微信
							that.bindText = '绑定后可通过微信直接登录';
						} else {
							that.bindText = '已绑定';
						}
					},
					fail: function(err) {

					}
				})
			},
			/**
			 * 获取选中的身份数据
			 */
			getChoicePositionData(data) {
				let that = this;
				that.roleId = data[0].value;
				that.roleName = data[0].label;
				that.editUserData({
					roleName: that.roleName,
					roleId: that.roleId
				});
			},
			/**
			 * 个人实名认证
			 */
			realNameAuthentication() {
				let that = this;
				// if (that.userInfo.authState == 5) {
				// 	//已认证
				// 	return;
				// }
				uni.navigateTo({
					url: '/pages/personalCertification/personalCertification?type=0',
				})
			},
			/**
			 * @查询用户信息
			 */
			getUserData() {
				let that = this;
				that.$request({
					url: '/api/users/getInfo',
					success: function(res) {
						console.log(res.data, '接口数据');
						const data = res.data;
						if (data.icon) {
							that.userInfo.icon = data.icon;
						}
						that.userInfo.account = data.account;
						that.userInfo.realName = data.name;
						that.userInfo.roleName = data.role_name;
					},
					fail: function(err) {

					}
				})
			},
			/**
			 * @修改用户信息
			 */
			editUserData(obj) {
				let that = this;
				let params = obj;
				that.$request({
					url: '/api/auth/update',
					method: 'POST',
					data: params,
					success: function(res) {
						let data = res.data || {};
						let code = data.code || '';
						console.log(obj, 'obj>>>>>>>>>>>>>>')
						for (let key in obj) {
							if (key == 'roleId') {
								that.getUserData();
							}
						}
						if (code == 200) {
							//修改成功
							that.showModel = true;
						} else {
							//修改失败
							that.$refs.uTips.show({
								title: data.message,
								type: 'error',
								duration: '1500'
							})
						}

					},
					fail: function(err) {

					}
				})
			},
			//地区confirm事件
			changeAddress(val) {
				let that = this;
				that.userInfo.address = val.province.label + val.city.label + val.area.label;
				that.editUserData({
					province: val.province.label,
					city: val.city.label,
					county: val.area.label
				});
			},
			//上传头像剪裁
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				uni.setStorageSync('imgCoopperStatus', 2);
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/pages/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			/**
			 * 退出登录
			 */
			loginOut() {
				uni.removeStorage({
					key: 'TOKEN',
					success: function(res) {
						uni.showToast({
							title: "您已退出",
							success: function() {
								uni.navigateTo({
									url: '/pages/login/login'
								});
							}
						})
					}
				});
			},
		},
		created() {
			let that = this;
			const token = uni.getStorageSync('TOKEN');
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper2', path => {
				this.avatar = path;
				console.log(path)
				// 可以在此上传到服务端
				uni.uploadFile({
					url: that.$baseUrl + '/api/oss/upload',
					header: {
						"Content-Type": "multipart/form-data",
						'authorization': token,
					},
					filePath: path,
					name: 'file',
					complete: (res) => {
						console.log(res, '上传图片')
						let datas = res.data || '';
						let datao = JSON.parse(datas);
						let imgUrl = datao.data.url || '';
						that.userInfo.icon = imgUrl;
						that.editUserData({
							icon: imgUrl
						});
					}
				});
			})
		},
		onShow() {
			let that = this;
			that.getUserData();
		}
	}
</script>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		background-color: #f3f4f6;

		.slot_content {
			display: flex;
			justify-content: flex-end;
		}

		.loginout {
			height: 80rpx;
			background-color: #FFFFFF;
			line-height: 80rpx;
			text-align: center;
		}

		.personalCertification {
			height: 100rpx;
			line-height: 100rpx;
			background: #F7F8F9;
			font-size: 30rpx;
			color: #999;
			padding: 0 24rpx;
			position: relative;

			.deAuthentication {
				width: 160rpx;
				height: 60rpx;
				position: absolute;
				right: 24rpx;
				top: 20rpx;
				background: #00AE67;
				color: #fff;
				font-size: 30rpx;
				line-height: 60rpx;
				text-align: center;
				border-radius: 10rpx;
			}
		}

		.personalCertificationText {
			padding: 0 24rpx;

			.personalCertificationItem {
				height: 60rpx;
				line-height: 60rpx;
				color: #666;
				font-size: 30rpx;
			}
		}

	}
</style>
