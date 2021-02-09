import serverConfig from "./serverConfig.js"; //引入全局配置接口地址
// 公共的请求(全局请求头添加token)

/**
 * whiteApi 白名单路径---防止出现首次登录时候强制跳转默认页面
 */
const whiteApi = ['pages/login/defaultPage','pages/login/login'];
const request = function(options) {
	options.url = serverConfig.api + options.url;;
	// uni.showLoading({
	// 	title: '加载中'
	// })
	try {
		const token = uni.getStorageSync('TOKEN');
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].route //获取当前页面路由
		// debugger
		if (token) {
			options.header = {
				'authorization': token
			};
		} else {
			//此处如果无token情况下可以进行跳转
			if (whiteApi.indexOf(curRoute) !== -1) {
				/**
				 * 此处不做操作（白名单地址不做强制跳转）
				 */
			} else { //不在白名单页面并且没有token情况直接跳转至登录页面
				uni.showToast({
					title: '登录已过期',
					duration: 2000,
					icon: 'none',
					success() {
						uni.removeStorageSync('TOKEN');
						// uni.navigateTo({
						// 	url: '/pages/login/login'
						// });
					}
				});
			}
		}
	} catch (err) {
		console.log(err)
	}
	// setTimeout(() => {
	// 	uni.hideLoading();
	// }, 200)
	return uni.request(options);
}
export default request;
