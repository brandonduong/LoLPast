import { createWebHistory, createRouter } from "vue-router";

const routes =  [
    {
        path: "/",
        alias: "/selectPlayers",
        name: "selectPlayers",
        component: () => import("./components/SelectPlayers")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
