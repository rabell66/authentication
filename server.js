const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
const port = process.env.PORT || 8000;
const app = express();
var users = [{userName: "a", password:"a"}];

//Set View Engine
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

//Middleware
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));
//routes
  
app.get("/",function(req, res) {
    console.log(req.session.user);
    // if(req.session.user){
  res.render("index",{user:req.session.user});
    // } else {
        //   res.render("index");
    // }
});

app.get("/signup", function(req, res) {
  res.render("signup");
});
app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
   
  if (!req.body || !req.body.userName || !req.body.password){
    console.log("No data sent");
    return res.redirect("/login");
  }

  var requestingUser = req.body;
  var userRecord;

  ///forEach does a for loop within the array
  users.forEach(function(item) {
    console.log(item);
    if (item.userName === requestingUser.userName) {
      userRecord = item;
    }
  });

  if (!userRecord) {
    console.log("No record found");
    return res.redirect("/login"); //  if user not found
  }

  if (requestingUser.password === userRecord.password) {
    req.session.user = userRecord;
    return res.redirect("/");
  } else {
      console.log("Wrong password");
    return res.redirect("/login");
  }
});

app.post("/users",function(req, res) {
    console.log('userName in Body = ');
    console.log(req.body.password);
  if (!req.body || !req.body.userName || !req.body.password) {
    return res.redirect("/");
  }
  //creating new user
  var newUser = {
    userName: req.body.userName,
    password: req.body.password
  };
  //add user to user array
  users.push(newUser);
 
  return res.redirect("/");
});

//LOGOUT
app.post('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});





app.listen(port, function() {
  console.log("Server is running on port", port);
});
