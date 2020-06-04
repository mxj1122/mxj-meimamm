import Vue from 'vue'
import VueRouter from 'vue-router'

// 子组件导入
import login from '@/views/login'
import layout from '@/views/layout'

Vue.use(VueRouter)


const router =new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',component:login},
        {path:'/layout',component:layout}
    ]
})

export default router