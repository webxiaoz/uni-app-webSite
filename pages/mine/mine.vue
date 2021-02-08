<template>
	<view class="wrap">
		<view class="nav" @click.native="goSetting()">
			<u-avatar :src="userInfo.icon?userInfo.icon:'https://jinfu-my-oss.oss-cn-hangzhou.aliyuncs.com/test/20210207/f6a528a6c9d8458fbad476aa6f13a1b5.jpeg'"
			 mode="square" style=""></u-avatar>
			<view class="user_info">
				<view class="userName">{{userInfo.realName}}</view>
				<view class="account">{{userInfo.account}}</view>
			</view>
			<u-icon name="arrow-right" color="#fff"></u-icon>
		</view>
		<view class="cell">
			<u-cell-group>
				<u-cell-item v-for="(menu,menuIndex) in menuList" :key="menuIndex" @click="changeCell(menu)" :icon="menu.icon"
				 :title="menu.menu_name"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [],
				userInfo: {
					realName: '',
					account: '',
					icon: '',
					address: '',
					roleName: '',
					authState: '',
					enterpriseAuthState: ''
				},
			};
		},
		methods: {
			/**
			 * 根据用户信息查询所属菜单
			 */
			getMenuList() {
				let params = {};
				this.$request({
					method: "GET",
					url: "/api/auth/findMenu",
					// data: params,
					success: (res) => {
						console.log(res.data, '根据用户查询菜单信息');
						this.menuList = res.data.data;
					},
					fail: (err) => {
						this.$refs.uToast.show({
							title: '请求失败!',
							type: 'error',
						})
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
			/**
			 * 设置页面
			 */
			goSetting() {
				uni.navigateTo({
					url: "./userSetting"
				})
			},
			/**
			 * 菜单跳转
			 */
			changeCell(menu) {
				console.log(menu, 'm');
				uni.navigateTo({
					url: menu.menu_url
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
					},
					fail: function(err) {

					}
				})

			},
		},
		onShow: function() {
			this.getMenuList();
			this.getUserData();
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100%;
		height: 100%;
		background-color: #f4f4f5;

		.nav {
			background-color: #2979ff;
			padding: 0 24rpx;
			width: 100%;
			height: 160rpx;
			display: flex;
			align-items: center;

			u-avatar {
				display: inline-block;
				margin-right: 24rpx !important;
				color: #FFFFFF;
			}

			.user_info {
				width: 100%;

				.userName {
					color: #FFFFFF;
					font-size: 36rpx;
					// padding: 10rpx 0;
				}

				.account {
					color: #FFFFFF;
					padding-bottom: 10rpx;
					font-size: 24rpx;
				}
			}
		}

		.cell {
			padding: 24rpx;
			border-radius: 16rpx;
		}
	}
</style>
