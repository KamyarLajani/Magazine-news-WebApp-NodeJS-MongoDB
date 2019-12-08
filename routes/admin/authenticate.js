function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect('/admin/login');
    
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/admin');
    }
    
    next();
    
}



module.exports = {checkAuthenticated, checkNotAuthenticated}