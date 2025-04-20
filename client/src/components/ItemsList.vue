<template>
  <div class="menu-container">

    <CONFIRMATIONMODAL :item_name = item_name />

    <!-- Category header with horizontal scroll -->
    <div class="categories-header">
      <ul class="category-list">
        <li class="category-item" @click.prevent = "overall_func('all')" id = 'all' style>
          all
        </li>
        <li class="category-item" @click.prevent = "overall_func('meals/sides')" id = "meals/sides" style>
          meals/sides
        </li>
        <li class="category-item" @click.prevent = "overall_func('africana')" id = "africana" style>
          africana
        </li>
        <li class="category-item" @click.prevent = "overall_func('drinks')" id = "drinks" style>
          drinks
        </li>
        <li class="category-item" @click.prevent = "overall_func('bread')" id = "bread" style>
          bread
        </li>
        <li class="category-item" @click.prevent = "overall_func('cakes')" id = "cakes" style>
          cakes
        </li>
        <li class="category-item" @click.prevent = "overall_func('snacks')" id = "snacks">
          snacks
        </li>
      </ul>
    </div>

    <!-- Menu items grid layout -->
    <div class="menu-items" v-if = "currentPageItems.length > 0">
      <div v-for="item in currentPageItems" :key="item.id" class="menu-item">
        <div class="item-image">
          <img :src= "'https://mosesfoodorderingappadmin.kelvinspice.com.ng/images/'+item.image" :alt="item.name" />
        </div>
        <div class="item-details">
          <h3 class="item-name">{{ item.name }}</h3>
          <p class="item-price">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price)}}</p>
          <p class="item-description">{{ item.description }}</p>
          <!-- Buttons container -->
          <div class="buttons-container">
            <!-- Delete button -->
            <button @click.prevent ="deleteItem(item.name)" class="delete-button">Delete</button>
            <!-- Edit button -->
            <router-link :to = "'/account/edit-item/'+item.name" class="edit-button">Edit</router-link>
          </div>
        </div>
      </div>
    </div>

    <RECORDNOTFOUND v-else>No Items Found</RECORDNOTFOUND>
    <p style = "margin-top: 10px; font-size: 15px;">Showing {{ currentPageItems.length }} of {{ filteredItems.length }}</p>
    <!-- Pagination Component -->
    <Pagination 
      :currentPage="currentPage" 
      :totalPages="totalPages" 
      @update:currentPage="currentPage = $event" 
      v-if = "currentPageItems.length > 0"
    />
  </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router'

import { ref, computed, reactive, onMounted, watch } from 'vue';

import RECORDNOTFOUND from '../components/ItemsNotFound.vue'

import CONFIRMATIONMODAL from '../components/modals/ConfirmationModal.vue'

import Pagination from './Pagination.vue';  // Import the Pagination component

import { useItemStore } from '@/stores/items'

import { useInteractiveStore } from '@/stores/interactive'

const route = useRoute()

const router = useRouter()

const interactive_store = useInteractiveStore()

const items_store = useItemStore()

let tab_clicked = ref("");

const currentPage = ref(1);

const itemsPerPage = 7; // Set how many items per page

let item_name = ref("")


watch( // Reset pagination
  [() => interactive_store.query, () => tab_clicked.value],
  () => {
    currentPage.value = 1; 
  }
);


let filteredItems = computed(() => { //search for item

    return items_store.items.filter((item) => {

    const matchesCategory = tab_clicked.value === 'all' ? item : item.category.toLowerCase() === tab_clicked.value.toLowerCase();

    const matchesItem = item.name.toLowerCase().slice(0, (interactive_store.query.length)) === interactive_store.query.toLowerCase();
  
    return matchesCategory && matchesItem;

  })

})


const totalPages = computed(() => { // Computed properties for pagination

   return Math.ceil(filteredItems.value.length / itemsPerPage);

});


// Get items for the current page
const currentPageItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredItems.value.slice(startIndex, endIndex);
});


// Method to update the current page
const updateCurrentPage = (page) => {

  currentPage.value = page;

};


function overall_func(category) {

    tab_clicked.value = category; //make default be all

    let all_tabs = document.querySelectorAll(".category-item");

    let counter = 0;

    while (counter < all_tabs.length) {

        if (all_tabs[counter].id !== tab_clicked.value) {
        
            all_tabs[counter].style = ""

        } else {

            all_tabs[counter].style = "border-bottom: 4px solid rgb(0, 102, 255)"

        }

        counter++;

    }

}


function deleteItem(item) {

  item_name.value = item

  interactive_store.toggle_confirmation_modal(true)
  
}



/* Hooks */

onMounted(() => {

  overall_func('all')
    
})
 
</script>

<style scoped>
.menu-container {
  display: block;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.categories-header {
  margin-bottom: 20px;
  overflow-x: auto;
}

.category-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  text-transform: uppercase;
  margin-right: 30px;
  font-size: 16px;
  text-align: center;
  color: black;
  white-space: nowrap;
  cursor: pointer;
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
  justify-content: space-between;
}

.item-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.item-price {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.item-description {
  font-size: 14px;
  color: #666;
}

.buttons-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.delete-button, .edit-button {
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: background-color 0.3s;
  width: 100%;
  display: inline-block;
}

.delete-button {
  background-color: #ff4d4f;
  color: white;
}

.delete-button:hover {
  background-color: #e03e3e;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #45a049;
}

/* Pagination styles */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
}

.pagination-button:hover {
  background-color: #0056b3;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
