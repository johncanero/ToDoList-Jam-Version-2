// jshint esversion:6

// essentials
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");


const app = express();
const items = ["Show Your Work!"];
const workItems = [];

// SET - UP view: EJS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// public > css (styles)
app.use(express.static("public")); 


// GET function for home route
app.get ("/", function(req, res){
    const day = date.getDate(); //date module from date.js
    res.render("list", {listTitle:day, newListItems: items});
});


// POST function for home route
app.post("/", function(req, res){
    // console.log(req.body);
    const item = req.body.newItem;

    // pushing work items list (work route)
    if(req.body.list === "Work list") {
        workItems.push(item);
        res.redirect("/work");
        // pushing home route
    }else{
        items.push(item);
        res.redirect("/");
    }
});

// GET function for work route
app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work list", newListItems: workItems});
});

// POST function for work route
app.post("/work", function(req,res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

// GET function for about route
app.get("/about", function(req, res) {
    res.render("about");
})

// essentials: running server
app.listen(process.env.PORT || 3000, function(){
console.log("Server is running on port 3000");
});




  
