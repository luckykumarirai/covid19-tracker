var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/covid19', {useNewUrlParser: true, useUnifiedTopology: true});
var conn=mongoose.connection;
var signupSchema=new mongoose.Schema({
    email: { type:String, required: true, index: { unique: true }},
    name: { type:String, required: true, },
    phone: { type:String, required: true, },
    country: { type:String, required: true, },
    password: { type:String, required: true },
    date: { type:Date, default: Date.now }
  });
const signupModel= mongoose.model('signups', signupSchema);
module.exports=signupModel;