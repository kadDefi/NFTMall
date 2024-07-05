import announcement from './announcement.vue'

const announcements = {
    install(Vue){
        Vue.component('announcement',announcement)
    }
}
export default announcements