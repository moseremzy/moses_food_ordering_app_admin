<template>
  <div class="add-item-form-container">
    <!-- <h2 class="form-title"><slot name="form-title"></slot></h2> -->
    <form enctype = "multipart/form-data" method = "post" action = "/update_photo">
    <div class = "profile">
        <!-- <small style="font-size: 11px; color: gray; margin-bottom: 20px; display: block;">Note: images larger than 3mb won't display</small> -->
        <img :src= "'https://admin.kelvinspice.com.ng/images/'+item_info.image" id = "profile_photo">
                <label for = "file"> <font-awesome-icon style = "font-size: 14px;"  class="fa-solid fa-camera" icon="fa-solid fa-camera"/> Change Photo
                <input type = "file" @change = "updatePhoto" id = "file" name = "image" ref = "itemImage" accept="image/*"></label>
        </div>
    </form>
    <form class="add-item-form">
      <!-- Item Name -->
      <div class="form-group">
        <label for="item-name" class="form-label">Item Name</label>
        <input type="text" id="item-name" v-model = "item_info.name" class="form-input" placeholder="Enter item name" required />
        <p class="err">{{item_info_error.name_err}}</p>
      </div>

      <!-- Item Price -->
      <div class="form-group">
        <label for="item-price" class="form-label">Item Price</label>
        <input type="number" v-model = "item_info.price" id="item-price" class="form-input" placeholder="Enter item price" required />
        <p class="err">{{item_info_error.price_err}}</p>
      </div>

      <!-- Item Description -->
      <div class="form-group">
        <label for="item-description" class="form-label">Item Description</label>
        <textarea id="item-description" v-model = "item_info.description" class="form-input" placeholder="Enter item description" rows="4" required></textarea>
        <p class="err" style="color: gray;" ref = "description_counter">{{item_info.description.length}}/200 characters</p>
      </div>

      <!-- Item Category -->
      <div class="form-group">
        <label for="item-category" class="form-label">Item Category</label>
        <select id="item-category" v-model = "item_info.category" class="form-input" required>
          <option value="">Select Category</option>
          <option value="meals/sides">Meals/sides</option>
           <option value="africana">Africana Dish</option>
          <option value="drinks">Drinks</option>
          <option value="bread">Bread</option>
          <option value="cakes">Cakes</option>
          <option value="snacks">Snacks</option>
        </select>
        <p class="err">{{item_info_error.category_err}}</p>
      </div>


       <!-- Item Sub Category -->
      <div class="form-group" v-if = "item_info.category === 'africana'">
        <label for="item-category" class="form-label">Sub Category</label>
        <select id="item-category" v-model = "item_info.sub_category" class="form-input" required>
          <option value="">Select Sub Category</option>
          <option value="swallow">Swallow</option>
          <option value="soup">Soup</option>
          <option value="none">None</option>
        </select>
        <p class="err">{{item_info_error.sub_category_err}}</p>
      </div>

      <!-- Item Image Upload
      <div class="form-group">
        <label for="item-image" class="form-label">Change Item Image</label>
        <input type="file" id="item-image" class="form-input" ref="itemImage" accept="image/*" required />
        <p class="err">{{item_info_error.image_err.category_err}}</p>
      </div> -->

      <!-- Submit Button -->
      <div class="form-group">
        <button type="submit" @click.prevent = "UpdateItem" class="submit-button"><slot name="button-title"></slot></button>
      </div>
    </form>
  </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router'

import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useItemStore } from '@/stores/items'

import API from "@/api";

const route = useRoute()

const router = useRouter()

const interactive_store = useInteractiveStore()

const items_store = useItemStore();

let description_counter = ref(null)

let itemImage = ref("")

const item_name = route.params.item_name

let item_info = reactive([])

let item_info_error = reactive({
    name_err: "",
    price_err: "",
    description_err: "",
    category_err: "",
    sub_category_err: "",
    image_err: ""
})



function getItems(item_name) { 

 item_info = items_store.items.find((product) => { //get individual item

    return product.name.toLowerCase() === item_name.toLowerCase();

  })

 
if (!item_info) { //if item nor dey. redirect to page not found

   router.push({name: "dashboard"})
    
}

}

getItems(item_name)



onUpdated(() => {
    namevalidated()
    pricevalidated()
    descriptionvalidated()
    categoryvalidated()
    subcategoryvalidated()
})



function namevalidated() {
    let pattern = /^[A-Za-z\s]+$/; // Updated pattern to include spaces
    if (item_info.name === "") {
        item_info_error.name_err = "Please fill the field";
    } else if (!pattern.test(item_info.name)) {
        item_info_error.name_err = "Item name can only contain letters and spaces";
    } else {
        item_info_error.name_err = "";
        return true;        
    }
}



function pricevalidated() {
    
    if (item_info.price === "") {
    
        item_info_error.price_err = "Please fill field";
    
    }  else {
    
        item_info_error.price_err = ""
        
        return true;
        
    }
}


function categoryvalidated() {
    
    if (item_info.category === "" || item_info.category == "Select Category") {
    
        item_info_error.category_err = "Please fill field";
    
    } else if (item_info.category !== "africana") {

        item_info.sub_category = "none";

        item_info_error.category_err = ""

        return true

    } else {
    
        item_info_error.category_err = ""
        
        return true;        
   }

}



function subcategoryvalidated() {
    
    if (item_info.sub_category === "" || item_info.sub_category == "Select Sub Category") {
    
        item_info_error.sub_category_err = "Please fill field";
    
    } else {
    
        item_info_error.sub_category_err = ""
        
        return true;        
   }

}




function descriptionvalidated() {

    if (item_info.description.length >= 200) {

       item_info.description = item_info.description.slice(0, 200)
        
       description_counter.value.attributes[2].nodeValue = "color: red;"
    
    } else {
       
       description_counter.value.attributes[2].nodeValue = "color: gray;"
    
       return true
    
    }
}


function item_exists() {

 return items_store.items.find((item) => {

      return item.name === item_info.name.toLowerCase()

  })
  
}


async function updatePhoto() {

   // Get the selected file
        const fileInput = itemImage.value; //check if file was selected
        if (!fileInput.files[0]) {
            interactive_store.backend_message = "Please upload an image";
            interactive_store.display_error_alert_box();
            return;
        } 

        // Ensures only images are uploaded
        if (fileInput.files[0].type != "image/png" && fileInput.files[0].type != "image/jpeg" && fileInput.files[0].type != "image/jpg") {
            interactive_store.backend_message = "Invalid file";
            interactive_store.display_error_alert_box();
            return
        }

        
        //Ensures image is not larger than 5mb
        if (fileInput.files[0].size > 5 * 1024 * 1024) { // 5MB in bytes
            interactive_store.backend_message = "image cannot be larger than 5mb";
            interactive_store.display_error_alert_box();
            return;
        }

        const formData = new FormData();
        formData.append("current_image_name", item_info.image)
        formData.append("item_name", item_name)
        formData.append("image", fileInput.files[0])

        interactive_store.toggle_loading_overlay(true);

        try {
            
            const response = await API.update_photo(formData); // Ensure API.upload_items sends FormData properly
            
            if (response.message === "success") {

                await items_store.fetch_items() //refetch items to update items

               item_info.image = response.image

                interactive_store.backend_message = "Photo Changed Succesfully";

                interactive_store.display_success_alert_box();
            
            } else {
                
                interactive_store.backend_message = "Error occurred, please try again";
                
                interactive_store.display_error_alert_box();
            
            }
        } catch (error) {
            
            interactive_store.backend_message = "Error occurred, please try again";
          
            interactive_store.display_error_alert_box();
        
        } finally {
        
            interactive_store.toggle_loading_overlay(false);
        
        }
    }



async function UpdateItem(e) {
 
    if (namevalidated() && pricevalidated() && categoryvalidated() && subcategoryvalidated() && descriptionvalidated()) {

        interactive_store.toggle_loading_overlay(true);

        try {
            
            const response = await API.update_item({

                ...item_info,

                current_item_name: item_name

            }); 
            
            if (response.message === "success") {

                await items_store.fetch_items() //refetch items to update item

                interactive_store.backend_message = "Item uploaded successfully";

                interactive_store.display_success_alert_box();
            
            } else {
                
                interactive_store.backend_message = "Error occurred, please try again";
                
                interactive_store.display_error_alert_box();
            
            }
        } catch (error) {
            
            interactive_store.backend_message = "Error occurred, please try again";
          
            interactive_store.display_error_alert_box();
        
        } finally {
        
            interactive_store.toggle_loading_overlay(false);
        
        }
    }
}


</script>

<style scoped>
.add-item-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(145, 138, 138, 0.1);
}

div.profile{
  width: 100%;
  margin: 0 auto 0 auto;
  text-align: center;
}

div.profile label {
  display: inline-block; 
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #17a2b8;
  padding: 5px;
  border: 1px solid rgb(219, 216, 216);
  font-weight: bolder;
  cursor: pointer;
}

img#profile_photo {
  display: block;
  margin: 0 auto 0 auto;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  image-rendering: auto;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast; 
}

input#file {
  display: none;
}

.form-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 16px;
  font-weight: bold;
  color: #555;
}

.form-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

textarea.form-input {
  resize: none;
}

.submit-button {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

p.err {
  color: red;
  font-size: 14px;
  margin: 0;
  }
</style>
