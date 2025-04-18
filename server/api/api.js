const hbs = require('nodemailer-express-handlebars');
const nodemailer = require("nodemailer");
const fs = require('fs');
const { render } = require("express/lib/response");
const path = require("path")
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require("../middlewares/database")
const MIDDLEWARES = require("../middlewares/middlewares")



module.exports = class API {



//POST REQUESTS

//register users
static async register(req, res) {

    const data = req.body;

    let message;

    try {

    const admin_query = `SELECT * FROM admin`

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

     
   if (admin.length == 1) { //do not allow more than one admin

       message = "an admin already exists";
        
    } else { //insert user for db

     data.password = await bcrypt.hash(data.password, 12); //encrypt the password

     const sql = 'INSERT INTO admin SET ?'

      await new Promise( (resolve, reject) => {

      db.query(sql, data, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve()

        }

      })

    })

    message = "success"

    }
        
    } catch (error) { //if there was an error at any point

    message = "error occured"

    }

    res.json({message: message})

}




 //login users
 static async login(req, res) {
   
  const data = req.body

  let this_user = null

  let date = new Date()

  let message;

  try {

  const admin_query = `SELECT * FROM admin WHERE email= ?`

  const admin = await new Promise( (resolve, reject) => {

    db.query(admin_query, [data.email], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  
  if (admin[0]) { //if the user dey

  const isMatch = await bcrypt.compare(data.password, admin[0].password); //decrypt he password, make u compare am with this one entered

  if (!isMatch) { //if password no match

    message = "Invalid email or password"
    
  } else { //if he match 

    date.setHours(date.getHours() + 2); // session expires in 2 hours

    req.session.cookie.expires = date;
  
    req.session.admin_id = admin[0].admin_id; //set admin id for session

    req.session.admin_isAuthenticated = true

    message = "success"

    this_user = admin[0]

  }
     
  } else { //if user no dey

    message = "Invalid email or password"

  }
      
  } catch (error) {
      
    message = "error occured"          

  }

   res.json({message: message, isAuthenticated: req.session.isAuthenticated, user: this_user})

}


//upload item
static async upload_items(req, res) {

  const data = req.body;

  data.name = data.name.toLowerCase()

  data.image = req.file ? req.file.filename : null;

  console.log(data)

  let message;

  try {
 
   const items_query = 'INSERT INTO items SET ?'

    await new Promise( (resolve, reject) => {

    db.query(items_query, data, (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve()

      }

    })

  })

  message = "success"

  } catch (error) { //if there was an error at any point

  message = "error occured"

  }

  res.json({message: message})

}




//send reset password email to user
static async send_reset_pass_email (req, res) {

  let data = req.body

  let message;

  try {

    const admin_query = `SELECT * FROM admin WHERE email= ?`

    const admin = await new Promise( (resolve, reject) => {
  
      db.query(admin_query, [data.email], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })
  
    
  if (admin[0]) { //if the user dey

   const token = uuidv4()

   const password_reset_token = `UPDATE admin 
      SET password_reset_token= ?
      WHERE email= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(password_reset_token, [token, data.email], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

  let result = await MIDDLEWARES.send_reset_pass_email(req, res, admin[0].email, token)

  message = result.message
   
   } else { //if email no dey, just still tell dem say i don send am, make dem for rest

  message = "We cannot find your email"

   }

  } catch (error) {

  message = "error occured"
    
  }

  res.json({message: message})

}



//reset password
static async reset_password (req, res) {

  const password = req.body.password

  const token = req.body.token

  let message

  try {

  const token_query = `SELECT * FROM admin WHERE password_reset_token= ?`

    const admin = await new Promise( (resolve, reject) => {
  
      db.query(token_query, [token], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })
  
    
  if (admin[0]) { //if token exist for a user

  let hashed_pass = await bcrypt.hash(password, 12); //change user password

  const password_reset_token = `UPDATE admin 
      SET password_reset_token= ?,
      password= ?
      WHERE email= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(password_reset_token, ['', hashed_pass, admin[0].email], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })


  message = "Password modified"
    
  } else { //if token no exist

  message = "Invalid token"

  }

  } catch (error) {

  message = "error occured"
    
  }

  res.json({message: message})

}




//cancel order
static async cancel_order (req, res) {

  let description = req.body.description

  let order_id = req.body.id

  let user_id = req.body.user_id

  let customer_name = req.body.customer_name

  let customer_email = req.body.customer_email

  let message;

  try {

   const status_query = `UPDATE orders 
      SET status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(status_query, ['Cancelled', description, order_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

    })

    await MIDDLEWARES.send_user_cancellation_email(req, res, customer_email, customer_name, order_id, description)

    message = "success"

  } catch (error) {

    message = "error occured"
    
  }

    res.json({message: message})

}



//cancel order
static async confirm_order (req, res) {

  let description = req.body.description

  let order_id = req.body.id

  let user_id = req.body.user_id

  let message;

  try {

   const status_query = `UPDATE orders 
      SET status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(status_query, ['Confirmed', description, order_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

    message = "success"

  } catch (error) {

    message = "error occured"
    
  }

    res.json({message: message})

}



  //CHANGE ITEM PHOTO
  static async update_photo (req, res) {

    let message

    let item_name = req.body.item_name

    let current_image_name = req.body.current_image_name

    let image = req.file ? req.file.filename : null;
  
    try {
 
      const item_photo_query = `UPDATE items 
      SET image= ?
      WHERE name= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(item_photo_query, [image, item_name], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

    const imagePath = path.resolve(__dirname, '../../kelvinspice_gallery/', current_image_name);

    if (fs.existsSync(imagePath)) {

      fs.unlinkSync(imagePath); // Delete image from folder

    } else {

      console.log('Image not found:', imagePath);

    }

    message = "success";

   } catch (error) {
     
    message = "Error Occured"
 
   }

   res.json({message: message, image: image})
 
 }




//GET REQUESTS

//fetch admin
static async fetch_admin (req, res) {

  let admin_id = req.session.admin_id

  let this_admin = null;

  let message;

  let settings;

  try {

    const admin_query = `SELECT * FROM admin WHERE admin_id= ?`

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, [admin_id], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

  if (admin[0].length < 1) { //if admin nor dey or he dey but account dey unverified
    
    message = "admin no exist"

  } else { //if admin dey

    message = "success"

    this_admin = admin[0]

  }

  const settings_query = `SELECT * FROM settings` //fetch settings join

    settings = await new Promise( (resolve, reject) => {

      db.query(settings_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })
    
  } catch (error) {
    
    message = "error occured" 

  }

  res.json({message: message, account_settings: settings[0], admin: this_admin, admin_isAuthenticated: req.session.admin_isAuthenticated})

}



//fetch orders
static async fetch_orders (req, res) {

  let message;

  let orders;

  try {

    const orders_query = `SELECT * FROM orders`

    orders = await new Promise( (resolve, reject) => {

      db.query(orders_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    message = "success"
    
  } catch (error) {
    
    message = "error occured" 

  }

  res.json({message: message, orders: orders})

}



//fetch customers
static async fetch_customers (req, res) {

  let message;

  let customers;

  try {

    const customers_query = `SELECT * FROM users`

    customers = await new Promise( (resolve, reject) => {

      db.query(customers_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    message = "success"
    
  } catch (error) {
    
    message = "error occured" 

  }

    res.json({message: message, customers: customers})

}




//fetch items
static async fetch_items (req, res) {

  let message;

  let all_items;

  try {

    const items_query = `SELECT * FROM items`

    all_items = await new Promise( (resolve, reject) => {

      db.query(items_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    message = "success"
    
  } catch (error) {
    
    message = "error occured" 

  }

  res.json({message: message, all_items: all_items})

}


//logout user
static async logout (req, res) {

  let message;
  
  try {

    req.session.admin_isAuthenticated = null

    req.session.admin_id = null

    message = "success"
    
  } catch (error) {

    message = "An error occcured"
    
  }

   res.json({message: message})
  
}



//PATCH REQUESTS


//update update item
static async update_item (req, res) {

  let item = req.body

  let current_item_name = item.current_item_name

  let message

  try {

  const items_query = `UPDATE items 
  SET name= ?,
  category= ?,
  sub_category= ?,
  price= ?,
  description= ?
  WHERE name= ?`

  await new Promise( (resolve, reject) => {

    db.query(items_query, [item.name, item.category, item.sub_category, item.price, item.description, current_item_name], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  message = "success"
    
} catch (error) {

  message = "error occured"
    
}

  res.json({message: message})

}



//update admin info
static async update_admin_info (req, res) {

  let message;

  try {

  const admin_query = `UPDATE admin 
  SET email= ?,
  phone= ?
  WHERE admin_id= ?`

  await new Promise( (resolve, reject) => {

    db.query(admin_query, [req.body.email, req.body.phone, req.body.admin_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })


  //account setting update
  const settings_query = `UPDATE settings 
  SET service_fee= ?
  WHERE id= ?`

  await new Promise( (resolve, reject) => {

    db.query(settings_query, [req.body.website_info.service_fee, req.body.website_info.id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  message = "success"
    
} catch (error) {

  message = "error occured"
    
}

  res.json({message: message})

}



//update admin passwowrd
static async update_admin_pass (req, res) {

  let information = req.body

  let admin_id = req.session.admin_id

  let message

  try {

    const admin_query = `SELECT * FROM admin WHERE admin_id= ?` //first find the user

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, [admin_id], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    if (admin.length > 0) { //if the admin dey

      const isMatch = await bcrypt.compare(information.old_password, admin[0].password); //compare the current pass, with the old one if he match 
      
      if (isMatch) { //if he match use am replace old one

      const hashed_pass = await bcrypt.hash(information.new_password, 12);
      
      const password_query = `UPDATE admin 
      SET password= ?
      WHERE admin_id= ?`

      await new Promise( (resolve, reject) => {

        db.query(password_query, [hashed_pass, admin_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

      message = "Updated"

      } else { //if pass no match

      message = "Old password incorrect"

      }

    } else { //if user nor dey

      message = "error occured"

    }
    
} catch (error) {

  message = "error occured"
    
}

  res.json({message: message})

}





//update user profile
static async update_order_status (req, res) {

  let order_status = req.body.status

  let order_id = req.body.order_id

  let description = req.body.description

  let message

  try {

  const order_query = `UPDATE orders 
  SET status= ?,
  description= ?
  WHERE order_id= ?`

  await new Promise( (resolve, reject) => {

    db.query(order_query, [order_status, description, order_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  message = "success"
    
} catch (error) {

  message = "error occured"
    
}

  res.json({message: message})

}


//CRON JOBS

//open market
static async open_market(req, res) {

  try {

  const settings_query = `UPDATE settings 
  SET market_status= ?
  WHERE id= ?`

  await new Promise( (resolve, reject) => {

    db.query(settings_query, ['open', 1], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })
    
  } catch (error) {

    console.log(error.message)
    
  }

}


//close market
static async close_market(req, res) {

  try {

  const settings_query = `UPDATE settings 
  SET market_status= ?
  WHERE id= ?`

  await new Promise( (resolve, reject) => {

    db.query(settings_query, ['close', 1], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })
    
  } catch (error) {

    console.log(error.message)
    
  }

}


//DELETE REQUESTS

//delete item
static async delete_item(req, res) {

  const item_name = req.body.item_name;

  let message;

  try {
   
    const item_query = `SELECT * FROM items WHERE name= ?`;
   
    const item = await new Promise((resolve, reject) => {
   
      db.query(item_query, [item_name], (err, result) => {
   
        if (err) {
   
          reject(err);
   
        } else {
   
          resolve(result);
   
        }
   
      });
   
    });

    if (!item.length) {
   
      return res.json({ message: "Item not found" });
   
    }

    const delete_query = `DELETE FROM items WHERE name= ?`;
   
    db.query(delete_query, item_name); // Delete item from database

    const imagePath = path.resolve(__dirname, '../../kelvinspice_gallery/', item[0].image);

    if (fs.existsSync(imagePath)) {

      fs.unlinkSync(imagePath); // Delete image from folder

    } else {

      console.log('Image not found:', imagePath);

    }

    message = "Delete successful";

  } catch (error) {
    
    message = "Error occurred";

  }

  res.json({ message: message });

}

}