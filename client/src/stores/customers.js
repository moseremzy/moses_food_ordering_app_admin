import { defineStore } from "pinia";

import API from "@/api";

export const useCustomersStore = defineStore("customers", {

    state: () => ({

        all_customers: []

    }),

    getters: {

        customers: (state) => { //all customers
 
           return state.all_customers.length
          
        }
        
     },
    
    actions: {

      async fetch_customers() {

        try {

          const response = await API.fetch_customers(); // Your API endpoint

          this.all_customers = response.customers

        } catch (error) {

          console.log('Failed to fetch customers:', error);

          throw error; // Re-throw error to handle it in `main.js`

        }
      }
   }
})