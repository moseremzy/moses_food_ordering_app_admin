<template>
  <div class="card">
    <div class="card-header">
      <!-- <h3 class="card-title">{{ title }}</h3> -->
    </div>
    <div class="card-body">
      <canvas ref="myChart"></canvas>
    </div>
  </div>
</template>

<script setup>

import { ref, toRefs, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { useOrdersStore } from '@/stores/orders';
import MIDDLEWARES from '../../middlewares/middlewares';

// Define props
const props = defineProps({
  title: String,
});

const { title } = toRefs(props);

const myChart = ref(null);

const orders_store = useOrdersStore();

let chartInstance = null;

// Create chart function
function createChart() {
  chartInstance = new Chart(myChart.value, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: `${title.value} ${new Date().getFullYear()}`,
          data: title.value === "Revenue" ? [
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jan'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Feb'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Mar'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Apr'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'May'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jun'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jul'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Aug'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Sep'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Oct'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Nov'),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Dec'),
          ] : [
            MIDDLEWARES.order_by_month(orders_store.orders, 'Jan'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Feb'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Mar'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Apr'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'May'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Jun'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Jul'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Aug'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Sep'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Oct'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Nov'),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Dec'),
          ],
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Function to update the chart's data
function updateChart() {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = title.value === "Revenue" ? [
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jan'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Feb'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Mar'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Apr'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'May'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jun'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jul'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Aug'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Sep'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Oct'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Nov'),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Dec'),
    ] : [
      MIDDLEWARES.order_by_month(orders_store.orders, 'Jan'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Feb'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Mar'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Apr'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'May'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Jun'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Jul'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Aug'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Sep'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Oct'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Nov'),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Dec'),
    ];

    chartInstance.update();  // Update the chart to reflect new data

  }
}

 
onMounted(() => {

  createChart();  // Create the chart instance when the component is mounted

});

 
watch(
  () => orders_store.orders,
  () => {
    nextTick(() => {
      updateChart();  // Update the chart after the orders data changes
    });
  },
  { deep: true }
);

</script>

<style scoped>
.card {
  display: block;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
