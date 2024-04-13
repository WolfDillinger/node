const jwt = require("jsonwebtoken");

const myAuth = async  (req , res, next) => {
    try{

        let token = req.header('jcp-auth');
        
        if (!token) {
            return res.status(401).json({ msg: 'No Token Provided' });
        }

        const verifiedToken = jwt.verify(token, "myKeyPass");
        
   
        req.user = verifiedToken.id;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).json({ error: err.msg })
    }
}
module.exports = myAuth;