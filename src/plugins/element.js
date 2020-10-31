import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 注册成全局可用的组件
Vue.use(Button)

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// Message组件挂载到了Vue的原型对象上
Vue.prototype.$message = Message
