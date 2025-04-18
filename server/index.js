require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 8000;
const router = require("./routes/router.js")
const cors = require("cors");
const app = express();
const path = require("path")

const allowedOrigins = ['http://localhost:8080'];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Request Origin:", origin); // Will log null for Postman or same-origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);
app.use('/images', express.static(path.join(__dirname, "../kelvinspice_gallery")));


// app.use(express.static(path.join(__dirname, "/dist")));



 
 
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(__dirname+"/dist/"))
//     app.get("*", (req, res) => {
//         res.sendFile(__dirname+"/dist/index.html")
//     })
// }



app.listen(port, () => {

  console.log("server started...")

})
