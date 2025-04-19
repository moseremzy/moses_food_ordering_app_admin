<template>
  
  <div class="container" :style="interactive_store.container_css">

    <OVERLAY/>

    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
    
    <SIDEBAR /> <!-- Sidebar -->

    <div class="sub_container" :style="interactive_store.sub_container_css">
    
      <HEADER page_name = "orders" searchbox_placeholder = "Enter Order ID To Search" /> <!-- Header -->
    
      <h1>{{route.params.user_name}} Order History</h1>

      <!-- Filters Section -->
      <div class="filters-container">
        <!-- Status Filter -->
        <div class="status-filter-container">
          <label for="status-filter" class="status-filter-label">Filter by Status</label>
          <select id="status-filter" v-model="selectedStatus" @change="filterOrders" class="status-filter-select">
            <option value="">All</option>
            <option value="Payment Pending">Payment Pending</option>
            <option value="Payment Failed">Payment Failed</option>
            <option value="Payment Abandoned">Payment Abandoned</option>
            <option value="Payment Reversed">Payment Reversed</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="date-range-filter-container">
          <label for="start-date-filter" class="date-filter-label">From</label>
          <input type="date" id="start-date-filter" v-model="startDate" @change="filterOrders" class="date-filter-input" />

          <label for="end-date-filter" class="date-filter-label">To</label>
          <input type="date" id="end-date-filter" v-model="endDate" @change="filterOrders" class="date-filter-input" />
        </div>
      </div>

      <div class="customer-table-container">
        <!-- Customer Table Wrapper for Mobile Scrolling -->
        <div class="table-wrapper">
          <b style = "word-wrap: break-word; display: block; margin-bottom: 10px;" v-if = "interactive_store.query">Result for - #{{interactive_store.query}}</b>
          <table class="customer-table" v-if = "paginatedOrders.length > 0">
            <thead>
              <tr>
                <th>Order ID <font-awesome-icon class="fa-solid fa-sort" style="color: gray; margin-left: 3px;" icon="fa-solid fa-sort" /></th>
                <th>Date <font-awesome-icon class="fa-solid fa-sort" style="color: gray; margin-left: 3px;" icon="fa-solid fa-sort" /></th>
                <th>Customer Name <font-awesome-icon class="fa-solid fa-sort" style="color: gray; margin-left: 3px;" icon="fa-solid fa-sort" /></th>
                <th>Location <font-awesome-icon class="fa-solid fa-sort" style="color: gray; margin-left: 3px;" icon="fa-solid fa-sort" /></th>
                <th>Amount <font-awesome-icon class="fa-solid fa-sort" style="color: gray; margin-left: 3px;" icon="fa-solid fa-sort" /></th>
                <th>Status <font-awesome-icon class="fa-solid fa-sort" style="color: gray; margin-left: 3px;" icon="fa-solid fa-sort" /></th>
                <!-- No header for the last column -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in paginatedOrders" :key="order.order_id">
                <td>#{{ order.order_id }}</td>
                <td>{{MIDDLEWARES.formatted_date(order.date_created)}}</td>
                <td>{{ order.customer_name }}</td>
                <td>{{ order.delivery_address }}</td>
                <td>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total_order_cost)}}</td>
                <td>
                  <span :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <router-link :to="'/account/view-order/' + order.order_id" class="order-link">View</router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <RECORDNOTFOUND v-else>Record Not Found</RECORDNOTFOUND>
        </div>
        <p style="margin-top: 10px; font-size: 15px;">Showing {{ paginatedOrders.length }} of {{ filteredOrders.length }}</p>

        <PAGINATION 
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          @update:currentPage="currentPage = $event" 
          v-if = "paginatedOrders.length > 0"
        />
      </div>
    </div> <!-- sub_container -->
  </div> <!-- container -->
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import HEADER from '../components/Header.vue';
import RECORDNOTFOUND from '../components/ItemsNotFound.vue'
import SIDEBAR from '../components/SideBar.vue';
import PAGINATION from '../components/Pagination.vue';
import { useInteractiveStore } from '@/stores/interactive';
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders';
import MIDDLEWARES from '../middlewares/middlewares';
import { useAdminStore } from '@/stores/admin'

const route = useRoute()

const router = useRouter()

const interactive_store = useInteractiveStore();

const admin_store = useAdminStore()

const orders_store = useOrdersStore();

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

const orders = reactive(orders_store.orders.filter((order) => { //fetch only orders when belong to user with this id

     return order.user_id == route.params.user_id

}));


// Filters
const selectedStatus = ref('');
const startDate = ref('');
const endDate = ref('');

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 15;


watch( // Reset pagination
  [() => interactive_store.query, () => selectedStatus.value, () => startDate.value, () => endDate.value],
  () => {
    currentPage.value = 1; 
  }
);


// Filtered Orders
const filteredOrders = computed(() => {
  return orders.filter(order => {
    const matchesStatus = !selectedStatus.value || order.status === selectedStatus.value;
    const matchesStartDate = !startDate.value || new Date(order.date_created.split(" ")[0]) >= new Date(startDate.value);
    const matchesEndDate = !endDate.value || new Date(order.date_created.split(" ")[0]) <= new Date(endDate.value);
    const matchesID = order.order_id.toLowerCase().slice(0, (interactive_store.query.length)) === interactive_store.query.toLowerCase();
    return matchesStatus && matchesStartDate && matchesEndDate && matchesID;
  });
});



// Paginated Orders
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});



// Total Pages
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));

 
const getStatusClass = (status) => { //color status
  return status === 'Pending' ? 'status-pending' :
         status === 'Confirmed' ? 'status-confirmed' :
         status === 'Preparing' ? 'status-preparing' : 
         status === 'Out for Delivery' ? 'status-out-for-delivery' :
         status === 'Delivered' ? 'status-delivered' : 
         status === 'Cancelled' ? 'status-cancelled' : '';
};


onMounted(() => { // Clear Query on Mount

   interactive_store.clearQuery();

});

</script>

<style scoped>
/* DESKTOP VIEW */
@media only screen and (min-width: 992px) {
  body {
    margin: 0; 
    padding: 0;
    font-family: "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif;
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
    margin: 0 0 0 250px;
    height: 100vh;
    padding: 0 15px 50px 15px;
    width: 100%;
    overflow-y: auto;
    width: calc(100% - 250px);
  }

  div.sub_container h1 {
    margin: 0px auto 5px auto;
    color: #0E2E45;
    font-size: 35px;
    font-weight: 300;
    text-transform: capitalize;
  }
}

/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
  body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif;
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
    margin: 0;
    padding: 0 15px 50px 15px;
    width: 100%;
  }

  div.sub_container h1 {
    margin: 0px auto 5px auto;
    color: #0E2E45;
    font-size: 3rem;
    font-weight: 300;
  }
}

/* Customer Table Styling */
.customer-table-container {
  width: 100%;
  margin: 0 auto;
  padding: 30px 0;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.customer-table th, .customer-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.customer-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.customer-table tr:hover {
  background-color: #f9f9f9;
}

.status-pending {
  color: gray;
  font-weight: bold;
}

.status-confirmed {
  color: #007BFF;
  font-weight: bold;
}

.status-preparing {
  color: #FD7E14;
  font-weight: bold;
}

.status-out-for-delivery {
  color: #6F42C1;
  font-weight: bold;
}

.status-delivered {
  color: #28A745;
  font-weight: bold;
}

.status-cancelled {
  color: red;
  font-weight: bold;
}

.order-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.order-link:hover {
  text-decoration: underline;
}

/* Filters Styles */
.filters-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.status-filter-container,
.date-range-filter-container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: flex-start; /* Align to the left */
}

.status-filter-label,
.date-filter-label {
  font-size: 16px;
  margin-bottom: 5px; /* Add space below labels */
  color: #333;
}

.status-filter-select,
.date-filter-input {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px; /* Add space below inputs */
}

.status-filter-select:hover,
.date-filter-input:hover {
  border: 1px solid rgb(0, 102, 255);
  border-radius: 4px;
}

.status-filter-select:focus,
.date-filter-input:focus {
  outline: 0;
  border: 1px solid rgb(0, 102, 255);
  border-radius: 4px;
}
/* Mobile Table Overflow */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* For smooth scrolling on mobile */
}

.customer-table {
  min-width: 800px; /* Ensure the table has a min-width on mobile for horizontal scrolling */
}

/* Ensure horizontal scroll on mobile */
@media (max-width: 768px) {
  .customer-table-container {
    padding: 15px 0;
  }

  .table-wrapper {
    overflow-x: auto;
  }
}
</style>
