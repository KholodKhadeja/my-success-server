/*this middleware check if the user is already loggedin-has a token or not*/


const { verifyToken } = require("../config/jwt");
const auth = async(req,res,next) =>{
    try{
        const payload = await verifyToken(req.headers["x-auth-token"]);
        req.userData=payload;
        next(); /*continue to the next function in the router**/
    }catch(err){
         res.status(401).json({err})
    }
}

module.exports = auth;