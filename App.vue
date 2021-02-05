<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			const token = uni.getStorageSync('TOKEN');
			if(token){
				uni.switchTab({
					url: '/pages/dashboard/dashboard',
					success() {
						uni.hideLoading();
					}
				});
			}else{
				uni.showToast({
					title:'登录过期！',
					icon:'none',
					success:function(){
						uni.navigateTo({
						    url: '/pages/login/login'
						});
					}
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import 'static/css/base.css';
	@import 'static/css/index.css';
</style>
