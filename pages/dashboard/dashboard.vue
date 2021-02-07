<template>
	<view class="wrap">
		<u-navbar :is-back="false" title=" " :background="background">
			<view class="slot-wrap">
				<!-- <u-search shape="round" v-model="keyWords" bg-color="#fff" placeholder-color="#000" color="#000" :show-action="false"></u-search> -->
			</view>
		</u-navbar>
		<!-- 简要概括 -->
		<u-grid :col="2" :border="false" color="#666666">
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #409eff;">
						<view class="grid-top">
							<text>{{payInfo.orderNum}}</text>
							<u-loading mode="circle" v-show="showNumLoading"></u-loading>
							<text class="unit">笔</text>
						</view>
						<view class="grid-text">今日订单数</view>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #ff8563;">
						<view class="grid-top">
							<text>{{payInfo.count}}</text>
							<u-loading mode="circle" v-show="showNumLoading"></u-loading>
							<text class="unit">元</text>
						</view>
						<view class="grid-text">今日成交额</view>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #967eff;">
						<view class="grid-top">
							<text>{{payInfo.allOrderNum}}</text>
							<u-loading mode="circle" v-show="showNumLoading"></u-loading>
							<text class="unit">笔</text>
						</view>
						<view class="grid-text">历史订单数</view>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #59db44;">
						<view class="grid-top">
							<text>{{payInfo.allSum}}</text>
							<u-loading mode="circle" v-show="showNumLoading"></u-loading>
							<text class="unit">元</text>
						</view>
						<view class="grid-text">历史成交额</view>
					</view>
				</view>
			</u-grid-item>
		</u-grid>
		<view class="container">
			<view class="title">常用小功能</view>
			<u-grid :col="4" :border="false">
				<u-grid-item @click="goWaterfall">
					<u-icon name="photo" color="#2979ff" :size="46"></u-icon>
					<view class="grid-text">图片</view>
				</u-grid-item>
				<u-grid-item @click="goGitHub">
					<u-icon name="github-circle-fill" color="#2979ff" :size="46"></u-icon>
					<view class="grid-text">GitHub</view>
				</u-grid-item>
				<u-grid-item @click="getQRcode()">
					<u-icon name="scan" color="#2979ff" :size="46"></u-icon>
					<view class="grid-text">扫一扫</view>
				</u-grid-item>
				<u-grid-item @click="goOrder">
					<u-icon name="order" color="#2979ff" :size="46"></u-icon>
					<view class="grid-text">订单</view>
				</u-grid-item>
			</u-grid>
			<u-tabs ref="tabs" :list="tabList" name="cate_name" count="cate_count" active-color="#2979ff" inactive-color="#606266"
			 font-size="30" :current="current" @change="changeTab"></u-tabs>
		</view>
		<u-popup v-model="showCodeText" mode="bottom" height="300px" border-radius="14" :closeable="true">
			<view style="word-break: break-all;padding: 40px 12px;">
				<view style="font-weight: bold;padding-right: 10rpx;">条码内容:</view><text style="color: #59db44;">{{codeText}}</text>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyWords: '',
				payInfo: {},
				showNumLoading: true,
				background: {
					backgroundImage: 'linear-gradient(90deg, #00c6ff,#0072ff)',
				},
				codeText: '',
				showCodeText: false,
				tabList: [{
					cate_name: '关注'
				}, {
					cate_name: '抗疫'
				}, {
					cate_name: '推荐',
					cate_count: 5
				}, {
					cate_name: '美景',
					cate_count: 5
				}, {
					cate_name: '电影',
					cate_count: 5
				} ,{
					cate_name: '北京'
				}],
				current: 0
			};
		},
		methods: {
			/**
			 * 获取交易数据
			 */
			getPayData() {
				console.log(this.$moment().format('YYYY-MM-DD HH:mm:ss'));
				// let startTime = this.$moment().subtract(1, 'days').format('YYYY-MM-DD');//查询前一天
				let startTime = this.$moment().format('YYYY-MM-DD');
				let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');
				let params = {
					startTime: `${startTime} 00:00:00`,
					endTime: endTime
				};
				this.$request({
					method: "POST",
					url: "/api/alpay/getDetailByTime",
					data: params,
					success: (res) => {
						console.log(res.data, '交易订单数');
						this.payInfo = res.data.data;
						this.showNumLoading = false;
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
			 * 跳转到瀑布流
			 */
			goWaterfall() {
				uni.navigateTo({
					url: "../waterfall/waterfall"
				})
			},
			/**
			 * 跳转GitHub页面
			 */
			goGitHub() {
				uni.navigateTo({
					url: "../webView/webView"
				})
			},
			/**
			 * QRCode
			 */
			getQRcode() {
				let that = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.codeText = res.result;
						that.showCodeText = true;
					}
				});
			},
			/**
			 * 订单
			 */
			goOrder() {
				uni.navigateTo({
					url: "../orderPage/orderPage"
				})
			},
			/**
			 * tab
			 */
			changeTab(index){
				this.current = index;
			}
		},
		onShow: function() {
			this.getPayData();
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {

		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			/* flex: 1; */
			/* 如果您想让slot内容与导航栏左右有空隙 */
			padding: 0 30rpx;
		}

		.u-grid-item {

			// padding: 20rpx;
			.grid_box {
				width: 100%;

				.grid_item {
					// width: 100%;
					height: 120rpx;
					border-radius: 16rpx;
					text-align: center;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					margin: 0 24rpx;

					.grid-top {
						color: #fff;
						font-weight: 700;
						font-size: 50rpx;

						.unit {
							color: #fff;
							font-size: 14px;
							padding-left: 5rpx;
						}
					}

					.grid-text {
						color: #fff;
					}
				}
			}

		}

		.title {
			font-size: 36rpx;
			margin: 24rpx;
		}
	}
</style>
