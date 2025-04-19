import { defineStore } from "pinia";

import API from "@/api";

export const useOrdersStore = defineStore("orders", {

    state: () => ({
    
        orders: [],

        current_order_id: null,

    }),

    getters: {

      current_order: (state) => {

        return state.orders.filter((order) => {

          return order.order_id === state.current_order_id

        })
      
      },

      revenue: (state) => { //total revenue for dis year. only orders with status delivered.

        let revenue_total = 0

        state.orders.forEach(order => {

            if (order.status === 'Delivered' && order.date_created.split('-')[0] == new Date().getFullYear()) {
            
              revenue_total += order.total_order_cost
              
            }
            
        })

        return revenue_total;
      
      },

      total_orders: (state) => { //total revenue for dis year. only orders with status delivered.
 
        return state.orders.filter((order) => {

          return order.date_created.split('-')[0] == new Date().getFullYear()

        }).length
      
      }
        
    },
    
    actions: {
    
        async fetch_orders() {

            try {
    
              const response = await API.fetch_orders(); // Your API endpoint
    
              this.orders = response.orders || []
    
            } catch (error) {
    
              console.log('Failed to fetch orders:', error);
    
              throw error; // Re-throw error to handle it in `main.js`
    
            }
        }
    }
})