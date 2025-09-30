const User = require('../models/User');

// create a user
exports.createUser = async (req,res,next) =>{
    try{
        const user = new User(req.body);
        const saved = await user.save();
        res.status(201).json(saved);
    }catch(err){
        next(err);
    }
};

// get user by id

exports.GetUserById = async(req,res,next)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message: failed});
        }
        res.json(user);

    }catch(err){
        next(err);
    }
};

// update user by ID
exports.UpdateUser = async (req,res,next) =>{
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body ,{ new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({message:"user not found"});
        res.status(201).json(updatedUser);
    }catch(err){
        next(err);
    }
};

exports.DeleteUser= async (req,res,next)=>{
    try{
        const delUser = await FindByIdAndDelete(req.params.id);
        if (!delUser) return res.status(404).json({message:"failed to delete user"});

        res.json({message: "user has been deleted"});
    }catch(err){
        next(err);
    }

};