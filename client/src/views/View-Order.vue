<template>

<div class="container" :style = "interactive_store.container_css">

    <OVERLAY/>

    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
    
    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

    <SIDEBAR/> <!--side bar--> 

    <div class="sub_container" :style = "interactive_store.sub_container_css">

    <HEADER/> <!--header--> 

    <h1>Order ID - {{order.order_id}}</h1>
 
    <CONFIRMREJECTSTATUS :order = order v-if = "order.status == 'Pending'" />

    <!-- Status Filter --> 
    
    <STATUSFILTER :order = order v-else/>

    <!-- Status Filter -->

    <div class = "flex_container">

    <div class = "order_details">
        <div>
        <h2>ORDER DATE</h2>
        <p>{{MIDDLEWARES.formatted_date(order.date_created)}}</p>
        </div>

        <div>
        <h2>PAYMENT METHOD</h2>
        <p>{{order.payment_method}}</p>
        </div>

        <div>
        <h2>CONFIRMATION PIN</h2>
        <p>{{order.confirmation_pin}}</p>
        </div>

        <div>
        <h2>DELIVERY ADDRESSS</h2>
        <p>{{order.delivery_address}}</p>
        </div>

    </div> <!-- ORDER DETAILS -->

    <div class = "order_items">
    <h2>FOOD ITEMS</h2>
    <div class="menu-items">
      <template v-for = "item in JSON.parse(order.items)" :key = "item.name">
      <div class="menu-item">
        <div class="item-image">
          <img :src= "'https://mosesfoodorderingappadmin.kelvinspice.com.ng/images/'+item.image" :alt="item.name">
        </div>
        <div class="item-details">
          <h3 class="item-name">{{item.name}} x {{item.quantity}}</h3>
          <p class="item-price">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.total)}}</p>
        </div>
      </div>
      </template>
    </div> 
    <h1>SUB TOTAL PRICE: <b style = "float: right;">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.sub_total_order_cost)}}</b></h1>
    <h1>TOTAL PRICE: <b style = "float: right;">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total_order_cost)}}</b></h1>
    </div> <!-- ITEMS -->


    <div class = "user_details">
    <div class = "grid">    
    <div>
       <h2>USER NAME</h2>
       <p>{{ order.customer_name }}</p>
    </div>

    <div>
        <font-awesome-icon class="fa-solid fa-user icons" icon="fa-solid fa-user"/>
    </div>
    </div>

    <div class = "grid">    
    <div>
       <h2>EMAIL</h2>
       <p>{{ order.email }}</p>
    </div>

    <div>
        <font-awesome-icon class="fa-solid fa-message icons" icon="fa-solid fa-message"/>
    </div>
    </div>

    <div class = "grid">    
    <div>
       <h2>PHONE NUMBER</h2>
       <p>{{ order.phone }}</p>
    </div>

    <div>
        <font-awesome-icon class="fa-solid fa-phone icons" icon="fa-solid fa-phone"/>
    </div>
    </div>

    <div class = "grid">    
    <div>
       <h2>DELIVERY ADDRESS</h2>
       <p>{{order.delivery_address}}</p>
    </div>

    <div>
        <font-awesome-icon class="fa-solid fa-location icons" icon="fa-solid fa-location"/>
    </div>
    </div>
</div> <!-- USER DETAILS -->

<div> <!-- PRINT RECIEPT -->

<RECEIPT v-if="selectedOrder" :order="selectedOrder" />

</div> <!-- PRINT RECIEPT -->

</div> <!-- FLEX_CONTAINER -->

<button @click="generateReceipt(order)" class = "generate-receipt-btn">Generate Receipt</button>

<CANCELORDER :order = order v-if = "order.status != 'Delivered' && order.status != 'Cancelled'"/>

</div> <!-- SUB_CONTAINER -->
</div> <!-- CONTAINER -->
</template>

<script setup>
import { useRoute, useRouter} from 'vue-router'
import { ref, reactive, computed, watch } from 'vue';
import HEADER from '../components/Header.vue';
import CANCELORDER from '../components/status_components/CancelOrder.vue'
import CONFIRMREJECTSTATUS from '../components/status_components/ConfirmRejectStatus.vue'
import OVERLAY from '../components/modals/loading_overlay.vue';
import ITEMSLIST from '../components/ItemsList.vue';
import STATUSFILTER from '../components/status_components/StatusFilter.vue';
import ADDITEMS from '../components/AddItems.vue';
import RECEIPT from "@/components/Receipt.vue";
import SIDEBAR from '../components/SideBar.vue';
import { useInteractiveStore } from '@/stores/interactive'
import { useOrdersStore } from '@/stores/orders'
import { useAdminStore } from '@/stores/admin'
import MIDDLEWARES from '../middlewares/middlewares';

const route = useRoute()

const router = useRouter()

const orders_store = useOrdersStore()

const interactive_store = useInteractiveStore()

const admin_store = useAdminStore()


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



const order = computed(() =>  {

  return orders_store.orders.find((order) => { //get individual item

    return order.order_id ===  route.params.order_id;

  })

})


if (!order) { //if item nor dey. redirect to page not found

   router.push({name: "dashboard"})
    
}

const selectedOrder = ref(null);

const generateReceipt = (order) => {

  selectedOrder.value = order;
  
};

 

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
div.confirm_reject {
    float: right;
    margin: 5px 0 0px 0;
}
div.confirm_reject button{
    padding: 5px 20px;
    font-size: 15px;
    font-weight: bold;
    margin-left: 10px;
    color: white;
}
#reject {
    background-color: rgb(145, 76, 76);
    border: 1px solid rgb(145, 76, 76);
}
#confirm {
    background-color: green;
    border: 1px solid green;
}
div.flex_container {
    clear: both;
    display: grid;
    grid-template-columns: 48% 48%;
    column-gap: 20px;
}
div.order_details {
    border: 1px solid rgb(207, 206, 206);
    padding: 10px;
    margin: 30px 0;
    border-radius: 5px;
}
div.order_details div{
    text-transform: uppercase;
    margin: 0 0 20px 0;
    word-break: break-all;
}
div.order_details div h2{
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    margin: 10px 0 5px 0;
}
div.order_items {
    border: 1px solid rgb(207, 206, 206);
    padding: 10px;
    margin: 30px 0;
    border-radius: 5px;
}

div.order_items h2{
    font-size: 16px;
    font-weight: bold;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.menu-item {
  display: flex;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.item-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.item-price {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
}

div.order_items h1{
    margin: 20px 0;
    font-size: 17px;
    font-weight: bold;
}

div.user_details {
    border: 1px solid rgb(207, 206, 206);
    padding: 10px;
    margin: 30px 0;
    border-radius: 5px;
}

div.grid {
    word-break: break-all;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
}

div.grid h2{
    font-size: 14px;
    font-weight: bold;
}

div.grid .icons {
    padding: 10px;
    font-size: 15px;
    border: 1px solid gray;
    border-radius: 100%;
}
}


/* Button Styling */
.generate-receipt-btn {
  display: block;
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin: 20px auto;
}

.generate-receipt-btn:hover {
  background-color: #45a049; /* Darker Green */
  transform: scale(1.05); /* Slight zoom on hover */
}

.generate-receipt-btn:active {
  background-color: #3d9143; /* Even darker green for active state */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
div.confirm_reject {
    float: right;
    margin: 5px 0 20px 0;
}
div.confirm_reject button{
    padding: 5px 20px;
    font-size: 15px;
    font-weight: bold;
    margin-left: 10px;
    color: white;
}
#reject {
    background-color: rgb(145, 76, 76);
    border: 1px solid rgb(145, 76, 76);
}
#confirm {
    background-color: green;
    border: 1px solid green;
}
div.order_details {
    clear: both;
    border: 1px solid rgb(207, 206, 206);
    padding: 10px;
    margin: 30px 0;
    border-radius: 5px;
}
div.order_details div{
    text-transform: uppercase;
    margin: 0 0 20px 0;
    word-break: break-all;
}
div.order_details div h2{
    font-size: 14px;
    font-weight: bold;
    border-radius: 5px;
    margin: 10px 0 5px 0;
}
div.order_items {
    border: 1px solid rgb(207, 206, 206);
    padding: 10px;
    margin: 30px 0;
    border-radius: 5px;
}

div.order_items h2{
    font-size: 16px;
    font-weight: bold;
}

.menu-item {
  display: flex;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.item-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.item-price {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
}

div.order_items h1{
    margin: 20px 0;
    font-size: 17px;
    font-weight: bold;
}

div.user_details {
    border: 1px solid rgb(207, 206, 206);
    padding: 10px;
    margin: 30px 0;
    border-radius: 5px;
}

div.grid {
    word-break: break-all;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
}

div.grid h2{
    font-size: 14px;
    font-weight: bold;
}

div.grid .icons {
    padding: 10px;
    font-size: 15px;
    border: 1px solid gray;
    border-radius: 100%;
}
}
</style>
