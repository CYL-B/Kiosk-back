import { REACT_APP_DB } from "@env";
var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}
mongoose.connect(`mongodb+srv://${REACT_APP_DB}?retryWrites=true&w=majority`, 
    options,         
    function(err) {
       console.log(err);
    }
);