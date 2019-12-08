const mongoose = require('mongoose');
try {
    (async ()=>{
        await mongoose.connect('DBurl', { useNewUrlParser: true, useUnifiedTopology: true });
        
    })();
}catch(err){
    console.log(err);
}


module.exports = mongoose;