import { defineStore } from "pinia";

import API from "@/api";


export const useAdminStore = defineStore("admin", {

    state: () => ({

        admin_isAuthenticated: false,

        admin: null, 

        website_info: null,

    }),


    actions: {
    
      logged_In (admin, admin_isAuthenticated) {

        this.admin = admin
        
        this.admin_isAuthenticated = admin_isAuthenticated

      },


      logged_Out () {

        this.admin = null
        
        this.admin_isAuthenticated = !this.admin_isAuthenticated

      },


      async fetch_admin() {

        try {

          const response = await API.fetch_admin(); // Your API endpoint

          this.logged_In(response.admin, response.admin_isAuthenticated)

          this.website_info = response.account_settings

        } catch (error) {

          console.log('Failed to fetch foods:', error);

          throw error; // Re-throw error to handle it in `main.js`

        }
      }
   }
})