<template>
	<!-- 订单查询 -->
	<view class="wrap">
		<view class="searchBox">
			<u-search v-model="name" :show-action="true" action-text="搜索" bg-color="#fff" height="68" @search="searchFun"
			 @custom="searchFun"></u-search>
		</view>
		<view style="overflow-x: hidden;background: #F7F8F9;">
			<view :data-index="index" class="itemListBox" v-for="(item,index) in lists" :key="index">
				<view class="userText">
					<view class="userTextItem userName">支付账号：{{item.buyer_logon_id || '-'}}</view>
					<view class="userTextItem">订单编号：{{item.trade_no || '-'}}</view>
					<view class="userTextItem">支付金额：<text class="money">￥{{item.total_amount || '-'}}</text></view>
					<view class="userTextItem">交易状态：<text class="money">{{item.trade_status || '-'}}</text></view>
					<view class="userTextItem">支付时间：{{item.gmt_payment || '-'}}</view>
				</view>
			</view>
			<view style="height: 300rpx;" v-if="noDataStatus">
				<u-empty text="暂无数据" height="300rpx" mode="list"></u-empty>
			</view>
			<u-loadmore v-if="noDataStatus2" :status="status" />
			<u-top-tips ref="uTips"></u-top-tips>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				noDataStatus2: false,
				noMoreDataStatus: false, //是否有更多数据
				noDataStatus: false, //是否有数据状态
				name: '', //搜索条件
				pageNum: 1, //当前页码
				totalCount: 0, //总条数
				lists: [],
				status: 'loading', //加载状态  默认loadmore  加载中loading / 没有更多nomore
			}
		},
		methods: {
			/**
			 * 获取员工列表数据
			 */
			getList() {
				let that = this;
				that.noDataStatus2 = true;
				that.status = 'loading';
				let params = {
					// params: {
					// 	name: that.name
					// },
					trade_status:'TRADE_SUCCESS',
					page: that.pageNum,
					pageSize: 10
				}
				that.$request({
					url: '/api/order/getAll',
					method: 'POST',
					data: params,
					success: function(res) {
						let data = res.data || {};
						let datas = data.data || {};
						let totalCount = datas.totalCount;
						that.lists = that.lists.concat(datas);
						if (datas.length < 10) {
							if (datas.length == 0) {
								if (that.pageNum == 1) {
									//暂无数据
									that.status = '';
									that.noDataStatus = true;
									that.noDataStatus2 = false;
								} else {
									//没有更多了
									that.status = 'nomore';
									that.noMoreDataStatus = true;
								}

							} else {
								that.noDataStatus2 = true;
								that.noDataStatus = false;
								//没有更多了
								that.status = 'nomore';
								that.noMoreDataStatus = true;
							}
						} else {
							that.pageNum++;
							that.status = 'loadmore';
							that.noDataStatus2 = false;
							that.noDataStatus = false;
							that.noMoreDataStatus = false;
						}
					},
					fail: function(err) {
						//暂无数据
						that.status = '';
						that.noDataStatus = true;
						that.noDataStatus2 = false;
					}
				})
			},
			/**
			 * 搜索按钮事件
			 */
			searchFun() {
				let that = this;
				that.pageNum = 1;
				that.lists = [];
				that.getList();
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.pageNum = 1;
				this.lists = [];
				this.getList();
				uni.stopPullDownRefresh();
			},
			/**
			 * 上拉触底函数
			 */
			onReachBottom() {
				let that = this;
				if (that.noMoreDataStatus) {
					return;
				}
				that.getList();
			},
			/**
			 * 打电话
			 */
			call(tel) {
				if (tel) {
					uni.makePhoneCall({
						// 手机号
						phoneNumber: tel,
						// 成功回调
						success: (res) => {
							console.log('调用成功!')
						},
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}
					});
				}
			},
		},
		onShow() {
			let that = this;
			that.pageNum = 1;
			that.lists = [];
			that.getList()
		}
	}
</script>
<style>
	page {
		background: #F7F8F9;
	}
</style>
<style scoped lang="scss" scoped>
	.wrap {
		padding: 0 24rpx;
		height: auto;
		background: #F7F8F9;

		// overflow-x: hidden;
		.searchBox {
			padding: 40rpx 0;
		}

		.itemListBox {
			min-height: 200rpx;
			height: auto;
			background: #fff;
			padding: 0 24rpx;
			margin-bottom: 40rpx;
			border-radius: 16rpx;
			position: relative;
			right: 0;

			.userPic {
				width: 152rpx;
				height: 152rpx;
				margin-top: 24rpx;
				border-radius: 152rpx;
				display: inline-block;
				background: #ccc;
				vertical-align: top;
			}

			.userText {
				// width: calc(100% - 152rpx);
				// display: inline-block;
				// vertical-align: top;
				// margin-left: 24rpx;
				padding: 24rpx 0 10rpx;

				.userTextItem {
					height: 30rpx;
					line-height: 30rpx;
					margin-bottom: 15rpx;
					font-size: 24rpx;
					// padding: 0 24rpx;
					color: #666;
				}

				.userName {
					font-weight: bold;
				}
				.money{
					font-weight: bold;
					color: #18b566;
				}
			}
		}

		.addUserBtn {
			width: 80rpx;
			height: 80rpx;
			line-height: 60rpx;
			text-align: center;
			position: fixed;
			bottom: 100rpx;
			right: 20rpx;
			font-size: 80rpx;
			color: #01AD67;
			border-radius: 80rpx;
			border: 1px solid #01AD67;
		}

		.remove {
			width: 100rpx;
			height: 100%;
			background-color: red;
			color: white;
			position: absolute;
			top: 0;
			right: -100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			border-radius: 16rpx;
		}
	}
</style>