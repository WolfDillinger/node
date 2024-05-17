const express = require("express");
const User = require("../models/user");
const myAuth = require("../components/my_auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const authReouter = express.Router();

authReouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

authReouter.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.sendStatus(200);
}); 

const corsOptions = {
  origin: 'https://batayneh-store.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-methods'], // Include 'access-control-allow-methods'
};

authReouter.use(cors());
authReouter.use(cors(corsOptions));



authReouter.post("/api/signup", async (req, res) => {

    try {
        const { fName, lName, phone, address, password, date , token , countrycode ,country } = req.body;

        const findUser = await User.findOne({ phone });

        if (findUser) {
            return res.status(400).json({ meg: 'this phone number is already used', });
        }

        const hPassword = await bcrypt.hash(password, 8);

        let user = new User({ fName, lName, address, phone, password: hPassword, date ,token , countrycode ,country });

        const saveUser = await user.save();

        const token_auth = jwt.sign({ id: user._id }, "myKeyPass");

        res.json({ token_auth, ...saveUser._doc });
        
    } catch (err) {
        res.status(500).json({ error: err.meg });
    }

});

authReouter.post("/api/signin", async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ meg: 'this phone number not register', });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ meg: 'Wrong pasword', });
        }

        const token = jwt.sign({ id: user._id }, "myKeyPass");

        res.json({ token, ...user._doc });
    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.post("/api/pass", async (req, res) => {
    try {
        const { phone , password } = req.body;

        const token = req.header('jcp-auth');

        const { address } = req.body;

        if (!token) return res.json(false);

        const verfifid = jwt.verify(token, "myKeyPass");

        

        if (!verfifid) {
            return res.json(false);
        } else {
            const user = await User.findOne({_id: verfifid.id});

            if (user) {
              const hPassword = await bcrypt.hash(password, 8);
              await  User.updateOne({_id:verfifid.id} ,{ $set: {"password":hPassword}});
              return res.json(true);
            }
            else {
                return res.json(false);
            }

        }

    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.post("/api/isValidToken", async (req, res) => {

    try {
        const token = req.header('jcp-auth');

        if (!token) return res.json(false);

        const verfifid = jwt.verify(token, "myKeyPass");

        if (!verfifid) {
            return res.json(false);
        } else {
            const user = await User.findOne({_id: verfifid.id});

            if (!user) {
                return res.json(true);
            }
            else {
                return res.json(false);
            }

        }

    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.post("/api/updateFcm", async (req, res) => {

    try {
        const token1 = req.header('jcp-auth');

        const { token } = req.body;

        if (!token1) return res.json(false);

        const verfifid = jwt.verify(token1, "myKeyPass");

        if (!verfifid) {
            return res.json(false);
        } else {
            const user = await User.findOne({_id: verfifid.id});

            if (user) {
              await  User.updateOne({_id:verfifid.id} ,{ $set: {"token":token}});
              return res.json(true);
            }
            else {
                return res.json(false);
            }

        }

    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.post("/api/update", async (req, res) => {

    try {
        const token = req.header('jcp-auth');

        const { address } = req.body;

        if (!token) return res.json(false);

        const verfifid = jwt.verify(token, "myKeyPass");

        if (!verfifid) {
            return res.json(false);
        } else {
            const user = await User.findOne({_id: verfifid.id});

            if (user) {
              await  User.updateOne({_id:verfifid.id} ,{ $set: {"address":address}});
              return res.json(true);
            }
            else {
                return res.json(false);
            }

        }

    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.post("/api/check", async (req, res) => {

    try {
        const { phone } = req.body;

        const findUser = await User.findOne({ phone });

        if (findUser) {
            return res.json(true);
        }else {
            return res.json(false);
        }

    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.post("/api/delete", async (req, res) => {

    try {
        const { phone } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ meg: 'this phone number not register', });
        }

        await user.deleteOne({phone:phone});

        return res.status(200).json({ meg: 'Account deleted', });

    } catch (err) {
        res.status(500).json({ error: err.meg });
    }
});

authReouter.get( "/",myAuth ,async(req,res)=>{
   
   const user = await User.findOne({_id: req.user});  


   res.json({...user._doc,token:req.token});  
});

module.exports = authReouter;
