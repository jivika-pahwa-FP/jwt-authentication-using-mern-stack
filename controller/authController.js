const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {

    const { user, email, password } = req.body;
    console.log(` ${user} \n ${email} \n ${password} `);
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        console.log("already Registered");
        return res.status(200).send({ success: false, msg: "already Registered" })
    }
    else {
        try {
            const salt = await bcrypt.genSalt(10); // generate_randomString
            const hashedPassword = await bcrypt.hash(password,salt);
            const newDataEntry = await new User({
                user : user,
                email : email,
                password : hashedPassword
            });
           // const newDataEntry = new User(req.body);
            newDataEntry.save();
            console.log(newDataEntry);
            return res.status(200).send({ success: true, msg: "User Registered" })

        } catch (error) {
            throw error;
        }
    }
}

const loginUser = async (req,res) =>{
        const {email,password} = req.body;
        console.log("password :: "+req.body.password);
        try{
            const userPresentInDB = await User.findOne({email});
            console.log(userPresentInDB.password);
            if(userPresentInDB){
                await bcrypt.compare(password,userPresentInDB.password , (err,data) => {
                    if(err){
                        throw err;
                    }
                    if(data){
                        console.log("login successful with decryption !")
                        return res.status(200).send({success:true,msg:"login successful!"});
                    }
                    else{
                        return res.send({success:false,msg:"invalid credentials!"});
                    }
                })
            }
            else{
                console.log("invalid credentials!")
                return res.send({success:false,msg:"invalid credentials!"});
            }
        }
        catch(error){
            return res.send(error);
        }
}


module.exports = {
    registerUser,
    loginUser
}