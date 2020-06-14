import Vue from 'vue'
import VueRouter from 'vue-router'

// 子组件导入
import login from '@/views/login'
import layout from '@/views/layout'
import Chart from '@/views/layout/chart'
import Question from '@/views/layout/question'
import User from '@/views/layout/user'
import Subject from '@/views/layout/subject'
import Enterprise from '@/views/layout/enterprise'

Vue.use(VueRouter)


const router =new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',component:login},
        {path:'/layout',component:layout,children:[
            {path:'chart',component:Chart},
            {path:'question',component:Question},
            {path:'user',component:User},
            {path:'subject',component:Subject},
            {path:'enterprise',component:Enterprise}
        ]}
    ]
})

export default router