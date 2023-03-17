module.exports = async(req,res,next)=>{
    if(req.userData){
        if(req.userData.isAdmin){
            req.userData.allowAccess=true;
        }
    }
    next();
}