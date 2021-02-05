<template>
	<view class="wrap">
		<u-grid :col="2" :border="false" color="#666666">
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #409eff;">
						<view class="grid-top">{{payInfo.orderNum}} <text class="unit">笔</text></view>
						<view class="grid-text">今日订单数</view>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #ff8563;">
						<view class="grid-top">{{payInfo.orderNum}} <text class="unit">元</text></view>
						<view class="grid-text">今日成交额</view>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #967eff;">
						<view class="grid-top">{{payInfo.allOrderNum}} <text class="unit">笔</text></view>
						<view class="grid-text">历史订单数</view>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item style="">
				<view class="grid_box">
					<view class="grid_item" style="background-color: #59db44;">
						<view class="grid-top">{{payInfo.allSum}} <text class="unit">元</text></view>
						<view class="grid-text">历史成交额</view>
					</view>
				</view>
			</u-grid-item>
		</u-grid>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payInfo: {},
			};
		},
		methods: {
			/**
			 * 获取交易数据
			 */
			getPayData() {
				let params = {};
				this.$request({
					method: "POST",
					url: "/api/alpay/getDetailByTime",
					data: params,
					success: (res) => {
						console.log(res.data, '交易订单数');
						this.payInfo = res.data.data;
					},
					fail: (err) => {
						this.$refs.uToast.show({
							title: '请求失败!',
							type: 'error',
						})
					}
				})
			}
		},
		onShow: function() {
			this.getPayData();
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		.u-grid-item {

			// padding: 20rpx;
			.grid_box {
				width: 100%;

				.grid_item {
					// width: 100%;
					height: 160rpx;
					border-radius: 30rpx;
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
	}
</style>
