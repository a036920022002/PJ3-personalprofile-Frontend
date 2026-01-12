import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/service/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    redirect: '/homepage'
                },
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/layout/AppSidebar.vue')
                },
                {
                    path: '/homepage',
                    name: 'homepage',
                    component: () => import('@/views/pages/homepage.vue')
                },
                {
                    path: '/aboutme',
                    name: 'aboutme',
                    component: () => import('@/views/pages/aboutme.vue')
                },
                {
                    path: '/works',
                    name: 'works',
                    component: () => import('@/views/pages/works.vue')
                },
                {
                    path: '/experience',
                    name: 'experience',
                    component: () => import('@/views/pages/experience.vue')
                },
                {
                    path: '/editaboutme',
                    name: 'editaboutme',
                    component: () => import('@/views/pages/edit/editaboutme.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/editeducation',
                    name: 'editeducation',
                    component: () => import('@/views/pages/edit/editeducation.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/editexperience',
                    name: 'editexperience',
                    component: () => import('@/views/pages/edit/editexperience.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/editworks',
                    name: 'editworks',
                    component: () => import('@/views/pages/edit/editworks.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/editaccount',
                    name: 'editaccount',
                    component: () => import('@/views/pages/edit/editaccount.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/editcertificate',
                    name: 'editcertificate',
                    component: () => import('@/views/pages/edit/editcertificate.vue')
                },
                // {
                //     path: '/uikit/file',
                //     name: 'file',
                //     component: () => import('@/views/uikit/FileDoc.vue')
                // },
                // {
                //     path: '/uikit/menu',
                //     name: 'menu',
                //     component: () => import('@/views/uikit/MenuDoc.vue')
                // },
                // {
                //     path: '/uikit/charts',
                //     name: 'charts',
                //     component: () => import('@/views/uikit/ChartDoc.vue')
                // },
                // {
                //     path: '/uikit/misc',
                //     name: 'misc',
                //     component: () => import('@/views/uikit/MiscDoc.vue')
                // },
                // {
                //     path: '/uikit/timeline',
                //     name: 'timeline',
                //     component: () => import('@/views/uikit/TimelineDoc.vue')
                // },
                // {
                //     path: '/pages/empty',
                //     name: 'empty',
                //     component: () => import('@/views/pages/Empty.vue')
                // },
                // {
                //     path: '/pages/crud',
                //     name: 'crud',
                //     component: () => import('@/views/pages/Crud.vue')
                // },
                // {
                //     path: '/documentation',
                //     name: 'documentation',
                //     component: () => import('@/views/pages/Documentation.vue')
                // }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/workdetail/:id',
            name: 'workdetail',
            component: () => import('@/views/pages/workdetail.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        // {
        //     path: '/test',
        //     name: 'test',
        //     component: () => import('@/views/pages/edit/editcertificate.vue')
        // },
        // {
        //     path: '/crud',
        //     name: 'crud',
        //     component: () => import('@/views/pages/Crud.vue')
        // }
    ]
});

router.beforeEach((to, from, next) => {
    const { isLogin } = useAuth();

    if (to.path === '/login' && isLogin.value) {
        // 已登入跳首頁
        return next('/homepage');
    }
     if (to.meta.requiresAuth && (!isLogin.value)) {
        return next('/login');
    }

    next();
});


export default router;
