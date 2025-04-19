import { defineStore } from "pinia";

import API from "@/api";

import { useInteractiveStore } from './interactive'; // Import the cart store

export const useItemStore = defineStore("items", {

    state: () => ({
    
        all_items: []

    }),

    getters: {

        total_items: (state) => state.all_items.length,

        items: (state) => state.all_items //items

     },
    
    actions: {
    
      async fetch_items() {

        try {

          const response = await API.fetch_items(); // Your API endpoint

          this.all_items = response.all_items

        } catch (error) {

          console.log('Failed to fetch items:', error);

          throw error; // Re-throw error to handle it in `main.js`

        }
      }
   }
})