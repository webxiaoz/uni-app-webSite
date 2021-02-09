<template>
	<view class="wrap">
		<u-form :model="form" ref="uForm">
			<view class="itemListBox">
				<!-- <view class="itemListText">
					姓名
				</view> -->
				<view class="itemListValue">
					<u-form-item :label-style="labelStyle" label="姓名" label-position="top" prop="name">
						<u-input v-model="form.name" type="text" :border="false" height="60" />
					</u-form-item>

				</view>
			</view>
			<view class="itemListBox">
				<view class="itemListValue">
					<u-form-item :label-style="labelStyle" label="账号" label-position="top" prop="account">
						<u-input :disabled="isAddEditStatus == 2?true:false" v-model="form.account" type="text" :border="false" height="60" />
					</u-form-item>
				</view>
			</view>
			<view class="itemListBox">
				<view class="itemListValue">
					<u-form-item :label-style="labelStyle" label="邮箱" label-position="top" prop="email">
						<u-input v-model="form.email" type="text" :border="false" height="60" />
					</u-form-item>

				</view>
			</view>
			<view class="itemListBox">
				<view class="itemListValue">
					<u-form-item :label-style="labelStyle" label="用户头像" label-position="top" prop="icon">
						<u-image width="150rpx" height="150rpx" :src="form.icon" shape="circle" @click="chooseAvatar">
							<view slot="error" style="font-size: 24rpx;">
								<u-icon name="plus"></u-icon>
							</view>
						</u-image>
					</u-form-item>
				</view>
			</view>
			<!-- <view class="itemListBox" @click="choicePosition">
				<view class="itemListValue">
					<u-form-item :label-style="labelStyle" label="职位" label-position="top" prop="position">
						<view :style="roleName == '请选择职位'?'color:#ccc':'color:#333'" v-model="form.position">{{roleName}}</view>
						
					</u-form-item>
				</view>
			</view> -->
			<u-select v-model="show" confirm-color="#2979ff" @confirm="getChoicePositionData" :list="positionData"></u-select>
			<view @click.stop.native="saveUserFun" class="saveBtn" :custom-style="customStyle">
				保存
			</view>
		</u-form>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				customStyle:{
					color:'#2979ff'
				},
				isSubmit: false,
				id: '', //当前人员ID
				isAddEditStatus: '', // 1 添加保存按钮提交  2 编辑保存按钮提交
				btnStatus: false, //保存按钮是否可以操作状态
				roleId: '', //选中的职位ID
				roleName: '请选择职位', //选中的职位名称
				show: false, //职位下拉数据状态
				positionData: [],
				labelStyle: {
					"font-size": "30rpx"
				},
				form: {
					name: '',
					account: '',
					position: '',
					icon: '',
					email: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					account: [{
						required: true,
						message: '请输入账号',
						trigger: ['change', 'blur']
					}, ],
					email: [{
						required: true,
						message: '请输入邮箱地址',
						trigger: ['change', 'blur']
					}, {
						pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
						// 正则检验前先将值转为字符串
						transform(value) {
							return String(value);
						},
						message: '请输入正确的邮箱地址'
					}, ],
					position: [{
						required: true,
						message: '请输入职位',
						trigger: ['change', 'blur']
					}]
				}
			}
		},
		methods: {
			/**
			 * @获取职位数据
			 */
			getPositionAPIdata() {
				let that = this;
				that.$request({
					url: '/system/role/queryAllPosition',
					success: function(res) {
						let data = res.data || {};
						let datas = data.data || [];
						let newRows = [];
						datas.map((curval, index, arr) => {
							newRows.push({
								label: curval.roleName,
								value: curval.id
							})
						})
						that.positionData = newRows;
					},
					fail: function(err) {

					}
				})
			},
			/**
			 * 获取选中的职位数据
			 */
			getChoicePositionData(data) {
				let that = this;
				that.roleId = data[0].value;
				that.roleName = data[0].label;
				that.form.position = data[0].label;
			},
			/**
			 * 选择职位事件
			 */
			choicePosition() {
				let that = this;
				that.show = true;
			},
			//上传头像剪裁
			chooseAvatar() {
				let that = this;
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				uni.setStorageSync('imgCoopperStatus', 1);
				that.$u.route({
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
			 * 添加员工数据
			 */
			add() {
				let that = this;
				if (that.btnStatus) {
					return;
				}
				that.btnStatus = true;
				let params = {
					name: that.form.name,
					account: that.form.account,
					icon: that.form.icon,
					email: that.form.email,
					// roleId: that.roleId
				}
				console.log(params, '添加员工参数数据>>>>>>>>>>>')
				that.$request({
					url: '/api/users/addMember',
					method: "POST",
					data: params,
					success: function(res) {
						let data = res.data || {};
						let code = data.code || '';
						if (code == 200) {
							//添加成功
							that.$refs.uTips.show({
								title: "添加成功",
								type: 'success',
								duration: '1500'
							})
							uni.hideLoading();
							uni.navigateBack();
						} else {
							//添加失败
							that.$refs.uTips.show({
								title: data.msg,
								type: 'error',
								duration: '1500'
							})
							uni.hideLoading();
						}
						that.btnStatus = false;
					},
					fail: function(err) {
						that.btnStatus = false;
						uni.hideLoading();
					}
				})
			},
			/**
			 * 修改员工数据
			 */
			edit() {
				let that = this;
				if (that.btnStatus) {
					return;
				}
				that.btnStatus = true;
				let params = {
					name: that.form.name,
					account: that.form.account,
					email: that.form.email,
					// roleId: that.roleId,
					id: that.id,
					icon: that.form.icon,
				}
				console.log(params, '修改员工参数数据>>>>>>>>>>>')
				that.$request({
					url: '/api/auth/updateStaff',
					method: "POST",
					data: params,
					success: function(res) {
						let data = res.data || {};
						let code = data.code || '';
						if (code == 200) {
							//修改成功
							that.$refs.uTips.show({
								title: '修改成功',
								type: 'success',
								duration: '1500'
							})
							uni.hideLoading();
							uni.navigateBack();
						} else {
							//修改失败
							that.$refs.uTips.show({
								title: data.msg,
								type: 'error',
								duration: '1500'
							})
							uni.hideLoading();
						}
						that.btnStatus = false;
					},
					fail: function(err) {
						that.btnStatus = false;
						uni.hideLoading();
					}
				})
			},
			/**
			 * 保存员工信息事件
			 */
			saveUserFun() {
				let that = this;
				uni.showLoading({
					title: '加载中...'
				})
				that.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						if (that.isAddEditStatus == 1) {
							//添加保存
							that.add();
						} else if (that.isAddEditStatus == 2) {
							//编辑保存
							that.edit();
						}

					} else {
						// console.log('验证失败');
					}
				});
			}
		},
		created() {
			let that = this;
			const token = uni.getStorageSync('TOKEN');
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				uni.showLoading({
					title: '上传中...'
				})
				// 可以在此上传到服务端
				uni.uploadFile({
					url: that.$baseUrl + '/api/oss/upload',
					header: {
						"Content-Type": "multipart/form-data",
						'token': token,
					},
					filePath: path,
					name: 'file',
					complete: (res) => {
						let datas = res.data || '';
						let datao = JSON.parse(datas);
						let imgUrl = datao.data.url || '';
						that.form.icon = imgUrl;
						uni.hideLoading();
						that.btnStatus = false;
					}
				});
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			// this.getPositionAPIdata();
		},
		onLoad(params) {
			let that = this;
			let upParams = params;
			// console.log(params,'params>>>>>>>>>')
			if (JSON.stringify(upParams) != '{}') {
				//编辑跳转
				let newParams = JSON.parse(params.params);
				that.isAddEditStatus = 2;
				that.form.name = newParams.name || '';
				that.form.account = newParams.account || '';
				that.form.email = newParams.email || '';
				that.form.icon = newParams.icon || '';
				that.form.position = newParams.role_name || '';
				that.roleName = newParams.rolename || '';
				that.roleId = newParams.roleid || '';
				that.id = newParams.id;
				console.log(newParams)
			} else {
				//添加跳转
				that.isAddEditStatus = 1;
			}

		}
	}
</script>
<style scoped lang="scss">
	.wrap {
		background: #fff;
		padding: 0 24rpx;
		position: relative;

		.itemListBox {
			.itemListText {
				height: 60rpx;
				line-height: 100rpx;
				color: #333;
				font-size: 30rpx;
			}

			.itemListValue {
				border-bottom: 1px solid #ccc;
			}

		}

		.saveBtn {
			width: calc(100% - 48rpx);
			height: 80rpx;
			border-radius: 10rpx;
			background: #00AE67;
			position: absolute;
			left: 24rpx;
			bottom: 50rpx;
			text-align: center;
			line-height: 80rpx;
			color: #fff;
			font-size: 30rpx;
		}
	}
</style>
