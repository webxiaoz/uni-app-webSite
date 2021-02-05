import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app';

import uView from "uview-ui";
Vue.use(uView);

//配置全局接口地址
import serverConfig from "./static/js/serverConfig.js"
Vue.prototype.$baseUrl = serverConfig.api;

//全局请求封装
import request from "./static/js/request.js"
Vue.prototype.$request = request;

const app = new Vue({
    ...App
})
app.$mount()
