import dayjs from 'dayjs'

export default class MIDDLEWARES {
         
    //get home recommendations for users
    static allowScroll () {

        setTimeout(() => {

            document.getElementById("bdy").style.overflowY = "unset"
              
          },);
 
    }

    //create formatted dates
    static formatted_date (date) {

        return dayjs(date).format("MMM DD, YYYY, h:mm A")
   
    }


    //filter orders for chart for the various months for the current year
    static order_by_month (orders, month) {

      return orders.filter((order) => {
          
         return dayjs(order.date_created).format("MMM DD, YYYY").split(" ")[0] === month && dayjs(order.date_created).format("MMM DD, YYYY").split(" ")[2] == new Date().getFullYear()

        }).length
 
    }

    //filter revenue for chart for the various months for the current year for orders succesfully delivered
    static revenue_by_month (orders, month) {

        let revenue_total = 0

        orders.forEach(order => {

            if (order.status === 'Delivered' && dayjs(order.date_created).format("MMM DD, YYYY").split(" ")[2] == new Date().getFullYear() && dayjs(order.date_created).format("MMM DD, YYYY").split(" ")[0] === month) {
            
              revenue_total += order.total_order_cost
              
            }
            
        })

        return revenue_total;
   
      }

}