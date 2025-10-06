const db = require('../models/model');



exports.userCreate = async (req,res,next)=>{
    try{

        const user = new db(req.body); // username,email,data
        const saved = await user.save();
        return res.status(200).json(saved);
    }catch(err){
        next(err);

    }

};
exports.userDelete = async (req,res,next)=>{
        try{
            const {username} = req.query;
            if (!username){
                 return res.status(400).json({message: "username not found"});
            }
            const user = await db.findOneAndDelete({ username });
            if (!user){
                return res.status(404).json({message: "failed to delete a user"});
            }

            return res.status(200).json({message : "user has been successfuly deleted"});

        }catch(err){
            next(err);
        }
};


exports.userUpdate = async (req,res,next)=>{
    try{
        const { username} = req.query;
        if (!username){
            return res.status(400).json({message: "username not found"});
        }
        const updateUser = await db.findOneAndUpdate({ username}, req.body , {new : true, runValidators: true});
        if (!updateUser) {
            return res.status(404).json({message:"failed to update user"});
        }
        //console.log(`User has been updated ${updateUser}`);
        return res.status(200).json(updateUser);

    }catch(err){
        next(err);

    }


};


exports.userFindByUsername = async (req,res,next)=>{
    try{
        const { username } = req.query; 
        if (!username){
            return res.status(400).json({message: "missing username"});
        }
        const user = await db.findOne({username});
        if (!user){
            return res.status(404).json({message: "failed to find a user"});
        }
        return res.status(200).json(user);

    }catch(err){
        next(err);
    }
};

// 400 bad request 
// 404 Not found 
// 200 OK

exports.userFindByEmail = async (req,res,next)=>{
    try{
        const {email} = req.query;
        if (!email){
            return res.status(400).json({message:"failed to find email"});
        }
        const user = await db.findOne({email});
        if (!user){
            return res.status(404).json({message: "failed to find a user"});
        }

        return res.status(200).json(user);

    }catch(err){
        next(err);
    }

};

