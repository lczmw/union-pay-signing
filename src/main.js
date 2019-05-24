import Vue from 'vue';
import App from './App';
import { router } from './router';
import '@/utils/rem';
import { Button, NavBar, Toast, Step, Steps, Field,Checkbox, CheckboxGroup, Uploader, Cell, CellGroup, Dialog,Popup, Picker, TreeSelect, Area,Row, Col,Icon,DatetimePicker  } from 'vant';
import '@/assect/style/vant.less'
import globalMixin from './mixins/global'
Vue.use(Button).use(NavBar).use(Toast).use(Step).use(Steps).use(Field).use(Checkbox).use(CheckboxGroup).use(Uploader).use(Cell).use(CellGroup).use(Dialog).use(Popup).use(Picker).use(TreeSelect).use(Area).use(Row).use(Col).use(Icon).use(DatetimePicker)

import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)

//Mixin
Vue.mixin(globalMixin);

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});