module.exports = async(req,res,next)=>{
    if(req.userData){
        if(req.userData.role == 'teacher'){
            req.userData.allowAccess=true;
        }
    }
    next();
}