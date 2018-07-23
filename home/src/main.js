import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.config.productionTip = false;

Vue.prototype.config2 = {
	apis:'http://127.0.0.1:8360/api/adminSet/',
	surl:'http://127.0.0.1:8360/',
	upload:'http://127.0.0.1:8360/static/upload/'
}

new Vue({
  el: '#app',
  render: h => h(App)
}).$mount('#app')

