<template>

<div class="container" :style = "interactive_store.container_css">

    <OVERLAY/>

    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

   <SIDEBAR/> <!--side bar--> 

    <div class="sub_container" :style = "interactive_store.sub_container_css">

    <HEADER page_name = "edit-item"/> <!--header--> 

    <h1>Edit Item</h1>

    <EDITITEMS>
    <template v-slot:form-title>
       Edit Item
    </template>
    <template v-slot:button-title>
       Update Item
    </template>
    </EDITITEMS>

 </div> <!-- SUB_CONTAINER -->
</div> <!-- CONTAINER -->
</template>

<script setup>

import { ref, watch} from 'vue';
import { useAdminStore } from '@/stores/admin'
import HEADER from '../components/Header.vue';
import OVERLAY from '../components/modals/loading_overlay.vue';
import ITEMSLIST from '../components/ItemsList.vue';
import EDITITEMS from '../components/EditItems.vue';
import SIDEBAR from '../components/SideBar.vue';
import { useInteractiveStore } from '@/stores/interactive'
import { useRoute, useRouter } from 'vue-router'

const interactive_store = useInteractiveStore()

const admin_store = useAdminStore()

const route = useRoute()
const router = useRouter()


if (!admin_store.admin_isAuthenticated) { //if user no get session redirect to login

    router.push({ path: "/login" })

}


watch( () => admin_store.admin_isAuthenticated,

  (isAuthenticated) => { //i dey confirm if admin still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_success_alert_box(true)

        setTimeout(() => {

           router.push({ path: "/login" })
            
        }, 1000);

    }
  }, 
);



</script>

<style scoped>
/*DESKTOP VIEW*/
@media only screen and (min-width: 992px) {
    body {
        margin: 0;
        padding: 0;
        font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
        background-color: rgb(225, 230, 231);
    }
    div.container {
        display: flex;
        height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    div.sub_container {
        display: block;
        margin:0 0 0 250px;
        height: 100vh;
        padding: 0 15px 50px 15px;
        width: 100%;
        overflow-y: auto;
        width: calc(100% - 250px);
    }
    div.sub_container h1{
        margin: 0px auto 5px auto;
        color: #0E2E45;
        font-size: 35px;
        font-weight: 300;
    }
}
/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
body {
    margin: 0;
    padding: 0;
    font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
    background-color: rgb(225, 230, 231);
}
div.container {
    display: flex;
    height: auto; 
    width: 100%; 
    margin: 0;
    padding: 0;  
}
div.sub_container {
    display: block;
    margin:0;
    padding: 0 15px 50px 15px;
    width: 100%; /*calc(100% - 250px)*/;
}
div.sub_container h1{
    margin: 0px auto 5px auto;
    color: #0E2E45;
    font-size: 3rem;
    font-weight: 300;
}
}

</style>
