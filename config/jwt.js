const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const getToken=(payload, expDate ="30d")=>{
return new Promise((resolve, reject)=>{
    jwt.sign(payload,process.env.JWT,{expiresIn:expDate}, (err,token)=>{ if(err) reject(err); else resolve(token);})
});
};

const verifyToken = (token) =>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.JWT, (err, payload) =>{
            if(err) reject (err);
            else resolve(payload);
        });
    });
};

module.exports={
    getToken, verifyToken
}