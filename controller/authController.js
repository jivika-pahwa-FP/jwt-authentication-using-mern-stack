const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
            const hashedPassword = await bcrypt.hash(password, salt);
            const newDataEntry = await new User({
                user: user,
                email: email,
                password: hashedPassword
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

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("password :: " + req.body.password);
    try {
        const userPresentInDB = await User.findOne({ email });
        console.log(userPresentInDB.password);
        if (userPresentInDB) {
            await bcrypt.compare(password, userPresentInDB.password, (err, data) => {
                if (err) {
                    throw err;
                }
                if (data) {
                    console.log("login successful with decryption !")
                    // generate token
                    const tokenData = {
                        _id: userPresentInDB._id,
                        user: userPresentInDB.user,
                        email: userPresentInDB.email
                    }
                    const token = jwt.sign(tokenData, "SecretKey123", { expiresIn: '30d' });
                    return res.status(200).send({ success: true, msg: "login successful!", token: token });
                }
                else {
                    return res.send({ success: false, msg: "invalid credentials!" });
                }
            })
        }
        else {
            console.log("invalid credentials!")
            return res.send({ success: false, msg: "invalid credentials!" });
        }
    }
    catch (error) {
        return res.send(error);
    }
}

const userData = async (req, res) => {
    try {
        console.log("userData called...");
        console.log(req.body);
        res.status(200).send({ success: true, data: req.body.user });
    }
    catch (error) {
        res.status(400).send(error);
    }
}

const updateUser = async (req, res) => {
    const update_user = req.body;
    console.log(req.body);
    const email = update_user.email;
    const userObj = await User.findOne({ email });
    console.log("updateUser - obj found !!");
    console.log(userObj);

    if (userObj) {
        await bcrypt.compare(update_user.current_password, userObj.password, async (err, data) => {
            if (err) throw err;
            else {
                const salt = await bcrypt.genSalt(15)
                const hashedNewPassword = await bcrypt.hash(update_user.password, salt)
                console.log(`hashedNewPassword : ${hashedNewPassword}`);
                User.findByIdAndUpdate(userObj._id, {
                    name: update_user.name,
                    email: update_user.email,
                    password: hashedNewPassword
                }, (err => {
                    if (err) {
                        return res.status(400).send({ msg: "Something went wrong" });
                    }
                    else {
                        console.log("Password updated successfully");
                        return res.status(200).send({ success: true, msg: "Password updated successfully" });
                    }
                }))
            }
        })
    }
    else {
        return res.send({ msg: "No User Found or Something went wrong" });
    }
}


module.exports = {
    registerUser,
    loginUser,
    userData,
    updateUser
}