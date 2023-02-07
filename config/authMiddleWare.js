const jwt = require('jsonwebtoken');

module.exports = async (req,res,next) => {
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            console.log("checking authorization for jwt");
            token = req.headers.authorization.split(" ")[1]; // Bearer <token> (refer to jwt.io)
            const user = jwt.verify(token,"SecretKey123");
            req.body.user = user;
            console.log(user);
            next()
        }
        catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }

    if(!token){
        res.status(401).json({msg:"Not Authorized"});

    }
}