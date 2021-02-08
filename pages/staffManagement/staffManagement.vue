<template>
	<view class="wrap">
		<view class="searchBox">
			<u-search v-model="name" :show-action="true" action-text="搜索" bg-color="#fff" height="68" @search="searchFun" @custom="searchFun"></u-search>
		</view>
		<view style="overflow-x: hidden;background: #F7F8F9;">
			<view :data-index="index" class="itemListBox" v-for="(item,index) in csListArrl" :key="index" @click="goEditUser(item)" @touchstart="drawStart" @touchmove="drawMove" @touchend="drawEnd" :style="{ right: item.right + 'rpx' }">
					<view class="userPic">
						<u-image width="150rpx" height="150rpx" :src="item.icon" shape="circle"></u-image>
					</view>
					<view class="userText">
						<view class="userTextItem">姓名：{{item.name}}</view>
						<view class="userTextItem">联系方式：{{item.email}}</view>
						<view class="userTextItem">职位：{{item.role_name}}</view>
					</view>
					<view @click.stop="removeUserFun(item.id)" class="remove">删 除</view>
				</view>
			
			
			<view style="height: 300rpx;" v-if="noDataStatus">
				<u-empty text="暂无数据" height="300rpx" mode="list"></u-empty>
			</view>
			
			<u-loadmore v-if="noDataStatus2" :status="status"  />
			<u-top-tips ref="uTips"></u-top-tips>
			<view @click="goAddUserFun" class="addUserBtn">+</view>
			<u-modal show-cancel-button confirm-color="#01AD67" @confirm="sureDelUserFun" v-model="show" :content="content"></u-modal>
		</view>
			
	</view>
</template>
<script>
	export default {
		data () {
			return {
				noDataStatus2: false,
				noMoreDataStatus: false,//是否有更多数据
				noDataStatus: false,//是否有数据状态
				delID: '',//当前删除选用用户ID
				name: '',//搜索条件
				pageNum: 1,//当前页码
				totalCount: 0,//总条数
				show: false,//弹窗状态
				content: '您确定要删除该员工信息么？',//弹窗提示信息内容
				startX: '',
				delBtnWidth: 100,
				csListArrl: [],
				status: 'loading',//加载状态  默认loadmore  加载中loading / 没有更多nomore
			}
		},
		methods: {
			/**
			 * 编辑员工信息跳转事件
			 */
			goEditUser (obj) {
				let that = this;
				uni.navigateTo({
					url: '/pages/staffManagement/addEmployee?params=' + JSON.stringify(obj)
				})
			},
			/**
			 * 获取员工列表数据
			 */
			getList () {
				let that = this;
				that.noDataStatus2 = true;
				that.status = 'loading';
				let params = {
					params: {
						nikName: that.name,
						pId:'',
					},
					pageNum: that.pageNum,
					pageSize: 10
				}
				that.$request({
					url:'/api/users/queryPage',
					method: 'POST',
					data: params,
					success: function(res){
						let data = res.data || {};
						let datas = data || {};
						let rows = datas.rows || [];
						let totalCount = datas.totalCount;
						that.csListArrl = that.csListArrl.concat(rows);
						if (rows.length < 10) {
							if (rows.length == 0) {
								if (that.pageNum == 1){
									//暂无数据
									that.status = '';
									that.noDataStatus = true;
									that.noDataStatus2 = false;
								}else {
									//没有更多了
									that.status = 'nomore';
									that.noMoreDataStatus = true;
								}
								
							}else {
								that.noDataStatus2 = true;
								that.noDataStatus = false;
								//没有更多了
								that.status = 'nomore';
								that.noMoreDataStatus = true;
							}
						}else {
							that.pageNum++;
							that.status = 'loadmore';
							that.noDataStatus2 = false;
							that.noDataStatus = false;
							that.noMoreDataStatus = false;
						}
					},
					fail: function(err){
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
			searchFun () {
				let that = this;
				that.pageNum = 1;
				that.csListArrl = [];
				that.getList();
			},
			/**
			 * 跳转添加员工页面
			 */
			goAddUserFun () {
				uni.navigateTo({
					url: '/pages/staffManagement/addEmployee'
				})
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh () {
				this.pageNum = 1;
				this.csListArrl = [];
				this.getList();
				uni.stopPullDownRefresh();
			},
			/**
			 * 上拉触底函数
			 */
			onReachBottom () {
				let that = this;
				if (that.noMoreDataStatus){
					return;
				}
				that.getList();
			},
			/**
			 * @开始触摸滑动
			 */
			drawStart(e) {
				var touch = e.touches[0];
				this.startX = touch.clientX;
			},
			/**
			 * 触摸滑动
			 */
			drawMove(e) {
				for (var index in this.csListArrl) {
					this.$set(this.csListArrl[index],'right',0);
				}
				var touch = e.touches[0];
				var item = this.csListArrl[e.currentTarget.dataset.index];
				var disX = this.startX - touch.clientX;
				if (disX >= 20) {
					if (disX > this.delBtnWidth) {
						disX = this.delBtnWidth;
					}
				this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',disX);
				} else {
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',0);
				}
			},
			/**
			 * 触摸滑动结束
			 */
			drawEnd(e) {
				var item = this.csListArrl[e.currentTarget.dataset.index];
				if (item.right >= this.delBtnWidth / 2) {
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',this.delBtnWidth);
				} else {
					this.$set(this.csListArrl[e.currentTarget.dataset.index],'right',0);
				}
			},
			/**
			 * 删除员工事件
			 */
			removeUserFun (id) {
				let that = this;
				that.delID = id;
				that.show = true;
			},
			/**
			 * 删除确认事件
			 */
			sureDelUserFun () {
				let that = this;
				that.$request({
					url:'/system/user/delete/'+ that.delID,
					method: "DELETE",
					success: function(res){
						let data = res.data || {};
						let code = data.code || '';
						if (code == 200) {
							//删除成功
							that.$refs.uTips.show({
								title: "删除成功！",
								type: 'success',
								duration: '1500'
							})
							that.csListArrl = [];
							that.getList();
						}else {
							//删除失败失败
							that.$refs.uTips.show({
								title: data.msg,
								type: 'error',
								duration: '1500'
							})
						}
					},
					fail: function(err){
						
					}
				})
			}
				
				
		},
	// 	onLoad () {
	// 		let that = this;
	// 		that.getList();
	
	// 	},
		onShow() {
			let that = this;
			that.pageNum = 1;
			that.csListArrl = [];
			that.getList()
		}
	}
</script>
<style>
	page {
		background: #F7F8F9;
	}
</style>
<style scoped lang="scss">
	
	.wrap {
		padding: 0 24rpx;
		height: auto;
		background: #F7F8F9;
		// overflow-x: hidden;
		.searchBox {
			padding: 40rpx 0;
		}
		.itemListBox {
			height: 200rpx;
			background: #fff;
			padding: 0 24rpx;
			margin-bottom: 40rpx;
			border-radius: 16rpx;
			position: relative;
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
				width: calc(100% - 152rpx);
				height: 152rpx;
				margin-top: 24rpx;
				display: inline-block;
				vertical-align: top;
				// margin-left: 24rpx;
				.userTextItem {
					height: 50rpx;
					line-height: 50rpx;
					font-size: 24rpx;
					padding: 0 24rpx;
					color: #666;
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