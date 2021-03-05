import Vue from 'vue'
import App from './App.vue'
import Antd, { Form, message } from 'ant-design-vue';
import router from './router'
import store from './plugin/store'
import { install, filter } from "./plugin/library";
import 'ant-design-vue/dist/antd.less';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/public.scss';
import './version';
import './plugin/element';
import moment from "moment"
import Ellipsis from './components/ellipsis';

Vue.use(Antd);
Vue.component('Ellipsis', Ellipsis);
Vue.use(install, filter);
Vue.prototype.$form = Form;
Vue.config.productionTip = false;
Vue.prototype.$moment = moment;
message.config({
  top: `47vh`,
  duration: 2,
  maxCount: 3,
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
