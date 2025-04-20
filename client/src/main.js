
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useAdminStore } from './stores/admin';
import { useOrdersStore } from './stores/orders';
import { useInteractiveStore } from './stores/interactive';
import { useCustomersStore } from '@/stores/customers';
import { useItemStore } from '@/stores/items';

import { createPinia } from 'pinia'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faNavicon, faSpinner, faHome, faCartShopping, faSearch, faUtensils, faHotel, faBurger, faPeopleRoof, faGraduationCap, faShop, faHouse, faUser, faTrash, faExclamation, faArrowRightLong, faXmark, faArrowLeftLong, faCircleCheck, faChevronLeft, faChevronRight, faBoxOpen, faUserTie, faEnvelope, faSignOut, faGauge, faUsers, faCalculator, faSort, faPhone, faLocation, faCamera, faMessage, faChartLine, faUserCog} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add( faNavicon, faSpinner, faHome, faCartShopping, faSearch, faUtensils, faHotel, faBurger, faPeopleRoof, faGraduationCap, faShop, faHouse, faUser, faTrash, faExclamation, faArrowRightLong, faXmark, faArrowLeftLong, faCircleCheck, faChevronLeft, faChevronRight, faBoxOpen, faUserTie, faEnvelope, faSignOut, faGauge, faUsers, faCalculator, faSort, faPhone, faLocation, faCamera, faMessage, faChartLine, faUserCog)


// Import the component
import SUCCESSALERTBOX from './components/alert_box/success.vue';
import ERRORALERTBOX from './components/alert_box/error.vue';

const app = createApp(App)

const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)


// Register the component globally
app.component('SUCCESSALERTBOX', SUCCESSALERTBOX);
app.component('ERRORALERTBOX', ERRORALERTBOX);

app.use(router)
app.use(pinia)

// Fetch data before mounting the app
const initializeApp = async () => {
    
    const admin_store = useAdminStore(); // Access the user store

    const ordersStore = useOrdersStore(); //Access the orders store

    const interactive_store = useInteractiveStore();

    const customers_store = useCustomersStore()

    const items_store = useItemStore()
    
    try {
    
        await Promise.all([

            admin_store.fetch_admin(),

            ordersStore.fetch_orders(),

            // interactive_store.fetch_settings(),

            customers_store.fetch_customers(),

            items_store.fetch_items(),

        ]);
    
    } catch (error) {
    
        console.log("Error during initialization:", error);

    }
  
    app.mount('#app'); // Mount the app only after data is fetched
  
};
  
initializeApp();
