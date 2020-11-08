var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var signupModel=require('../models/signup');
const fetch = require('node-fetch');
let settings = { method: "Get" };
let url = "https://coronavirus-19-api.herokuapp.com/countries/world";

var title='Covid-19 Tracker';

router.get('/allworld', function(req, res, next) {
  fetch(url, settings).then(res => res.json()).then((data) => {
    res.render('index', { title: title,world_data:data,useremail:req.session.user,country:req.session.country });
  });
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var checkuser=signupModel.findOne({ email:email });
  checkuser.exec(function (err,data){
    if (err) throw err;
    var getpass=data.password;
    if (bcrypt.compareSync(password,getpass))
    {
      req.session.country = data.country;
      req.session.user = data.email;
      fetch(url, settings).then(res => res.json()).then((data) => {
        res.render('index', { title: title,success:'you login successfully',world_data:data,useremail:req.session.user,country:req.session.country });
      });
    }
    else
    {
      fetch(url, settings).then(res => res.json()).then((data) => {
        res.render('index', { title: title,world_data:data,useremail:req.session.user,country:req.session.country,error:"Sorry !! Email and password is not match" });
      });
    }
  });
});

function checkEmail(req, res, next){
  var email = req.body.email;
  var checkexistemail=signupModel.findOne({ email:email });
  checkexistemail.exec(function (err,data){
    if (err) throw err;
    if (data)
    {
      return res.redirect("/");
    }
    next();
  });
}

router.post('/signup',checkEmail,function(req, res, next) {
  var name=req.body.name;
  var email=req.body.email;
  var phone = req.body.phone;
  var country=req.body.country;
  var password = req.body.password;
  var cpassword=req.body.cpassword;
  if(password!=cpassword)
  {
    fetch(url, settings).then(res => res.json()).then((data) => {
      res.render('index', { title: title,world_data:data,useremail:req.session.user,country:req.session.country,error:"confirm password is not matched with your password" });
    });
  }
  else
  {
    password=bcrypt.hashSync(password,10);
    var signupdetails=new signupModel({
      email:email,
      name:name,
      phone:phone,
      country: country,
      password: password
    });
    signupdetails.save(function (err,data){
      if (err) throw err;
      fetch(url, settings).then(res => res.json()).then((data) => {
        res.render('index', { title: title,world_data:data,useremail:req.session.user,country:req.session.country,success:"you are registered successfully" });
      });
    });
  }
});

router.get('/countrywise', function(req, res, next) {
  let curl = "https://coronavirus-19-api.herokuapp.com/countries/";
  fetch(curl, settings).then(res => res.json()).then((data) => {
    res.render('countrywise', { title: title,world_data:data,useremail:req.session.user,country:req.session.country });
  });
});

router.get('/country/:country', function(req, res, next) {
  var country=req.params.country;
  let countrytotal="https://coronavirus-19-api.herokuapp.com/countries/"+country;
  if(country=="USA")
  {
    country="US";
  }
  fetch(countrytotal, settings).then(res => res.json()).then((totaldata) => {
    res.render('country', { title: title,countrytotal:totaldata,country:country,useremail:req.session.user });
  });
});

router.get('/', function(req, res, next) {
  let indiaurl="https://coronavirus-19-api.herokuapp.com/countries/india";
  fetch(indiaurl, settings).then(res => res.json()).then((data) => {
    res.render('allindia', { title: title,indiadata:data,useremail:req.session.user,country:req.session.country });
  });
});

router.get('/indiastatewise', function(req, res, next) {
  let stateurl="https://api.covidindiatracker.com/state_data.json";
  fetch(stateurl, settings).then(res => res.json()).then((data) => {
    res.render('indiastatewise', { title: title,indiastate:data,useremail:req.session.user,country:req.session.country });
  });
});

router.get('/indiadistrictwise/:id', function(req, res, next) {
  var id=req.params.id;
  let stateurl="https://api.covidindiatracker.com/state_data.json";
  fetch(stateurl, settings).then(res => res.json()).then((data) => {
    res.render('indiadistrictwise', { title: title,statedistrict:data,id:id,useremail:req.session.user,country:req.session.country });
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: title,useremail:req.session.user,country:req.session.country });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if (err)
    {
      res.redirect('/');
    }
  });
  res.redirect('/');
});

module.exports = router;
