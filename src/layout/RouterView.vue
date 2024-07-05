<template>
    <transition name="router-fade" mode="out-in">
        <keep-alive v-if="keepAlive">
            <router-view :key="key" />
        </keep-alive>
        <router-view v-else :key="key" />
    </transition>
</template>

<script>

    export default {
        name: "RouteView",
        computed: {
            key() {
                return this.$route.path;
            },
            keepAlive() {
                return this.$route.meta.keepAlive;
            }
        },
    }
</script>
