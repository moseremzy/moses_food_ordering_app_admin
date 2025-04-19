<template>
  <!-- Status Filter -->
    <div class="status-filter-container">
      <select id="status-filter" :style = "status_color"  @change = "Update_Status" class="status-filter-select" v-model = "order.status">
        <option style = "color: black;" value="Payment Pending" disabled>Payment Pending</option>
        <option style = "color: black;" value="Payment Failed" disabled>Payment Failed</option>
        <option style = "color: black;" value="Payment Abandoned" disabled>Payment Abandoned</option>
        <option style = "color: black;" value="Payment Reversed" disabled>Payment Reversed</option>
        <option style = "color:  gray;" value="Pending">Pending</option>
        <option style = "color: #007BFF;" value="Confirmed">Confirmed</option>
        <option style = "color: #FD7E14;" value="Preparing">Preparing</option>
        <option style = "color: #6F42C1;" value="Out for Delivery">Out for Delivery</option>
        <option style = "color: #28A745;" value="Delivered">Delivered</option>
        <option style = "color: red;" v-if = "order.status == 'Cancelled'" value="Cancelled">Cancelled</option>
      </select>
    </div>
</template>

<script setup>

import { computed, reactive, toRefs, ref} from 'vue'

import API from '../../api'

import { useInteractiveStore } from '@/stores/interactive'

const interactive_store = useInteractiveStore()

let description = ref("")

const props = defineProps({

  order: Object

})

const { order } = toRefs(props)
 

async function Update_Status() {

    interactive_store.toggle_loading_overlay(true) //show overlay

    switch (order.value.status) {
        
        case "Pending":

            description.value = "Your Order Has Been Recieved And is Awaiting Confirmation."
            
            break;

        case "Confirmed":

            description.value = "Your Order Has Been Confirmed For Processing."

            break;
        
        case "Preparing":

            description.value = "Your Order is in Preparation. Our Team is Carefully Preparing it For You."
            
            break;

        case "Out for Delivery":

            description.value = "Your Order is on its Way! it Will be With You Shortly."

            break;

        case "Delivered": 

            description.value = "Your Order Has Arrived! Thank You For Choosing us. We Look Forward to Serving You Again."

            break;

    }

    const response = await API.update_order_status({
        
        status: order.value.status, 
        
        order_id: order.value.order_id,
        
        description: description.value
        
    }) 

    if (response.message === "success") { 

        interactive_store.backend_message = "Status Updated Succesfully"
        
        interactive_store.display_success_alert_box()

    } else {

        interactive_store.backend_message = "Error Occured, Try Again"

        interactive_store.display_error_alert_box()

    }

    interactive_store.toggle_loading_overlay(false) //remove overlay
    
}


const status_color = computed(() =>  {

    switch (order.value.status) {

         case "Pending":

            return {'color': 'gray', 'border': '1px solid gray'}
             
            break;
         
         case "Confirmed":

            return {'color': '#007BFF', 'border': '1px solid #007BFF'}

            break;

        case "Preparing":

            return {'color': '#FD7E14', 'border': '1px solid #FD7E14'}

            break;

        case "Out for Delivery":

            return {'color': '#6F42C1', 'border': '1px solid #6F42C1'}

            break; 

        case "Delivered":

            return {'color': '#28A745', 'border': '1px solid #28A745'}

        break;
        
        case "Cancelled":

            return {'color': 'red', 'border': '1px solid red'}

        break;
     
         default:

        break;

     }


})

</script>

<style scoped>
/*DESKTOP VIEW*/
@media only screen and (min-width: 992px) {
.status-filter-container {
    float: right; /* Align to the left */
}
.status-filter-select {
  padding: 13px 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  width: 200px;
  border-radius: 4px;
  margin-bottom: 10px; /* Add space below inputs */
}
.status-filter-select:hover {
  border: 1px solid rgb(0, 102, 255);
  border-radius: 4px;
}
.status-filter-select:focus {
  outline: 0;
  border: 1px solid rgb(0, 102, 255);
  border-radius: 4px;
}
}

/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
.status-filter-container {
    float: right; /* Align to the left */
}
.status-filter-select {
  padding: 8px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 3px;
  margin-bottom: 10px; /* Add space below inputs */
}
.status-filter-select:hover {
  border: 1px solid rgb(0, 102, 255);
  border-radius: 4px;
}
.status-filter-select:focus {
  outline: 0;
  border: 1px solid rgb(0, 102, 255);
  border-radius: 4px;
}
}
</style>