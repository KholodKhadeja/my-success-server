module.exports = async(req,res,next)=>{
    if(req.userData){
        if(req.userData.role === "admin"){
            req.userData.allowAdminAccess=true;
        }
    }
    next();
}