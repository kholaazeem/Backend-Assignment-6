import Users from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uploadImg } from "../config/cloudinary.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../config/mailer.js";

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.json({
        status: false,
        message: "all fields are required",
      });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.json({
        status: false,
        message: "email already exists",
      });
    }

    let profileData = {};
    if (req.file) {
      const uploaded = await uploadImg(req.file);
      profileData = {
        profilePic: uploaded.image,
        profilePicPublicId: uploaded.public_id,
      };
    }

    const hashPass = await bcrypt.hash(password, 10);
    const data1 = {
      name,
      email,
      password: hashPass,
      role: "user",
      ...profileData,
    };
    const user = new Users(data1);
    const data = await user.save();
    if(data){
      console.log('yeh line chali');
      
      const token = jwt.sign(
      { id: data._id, email: data.email,role:data.role},
      process.env.JWT_SECRET,
      function (err, token) {
        console.log('error',err);
        console.log('newtoken--->',token);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        console.log("isline tak aya");

      return  res.json({
      status: true,
      message: "user created successfully",
      user: data,
      token:token
    });
      },
    );
     
    }
   

   
  } catch (error) {
    console.log("error in creating user-->", error);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const allUsers = async (req, res) => {
  try {
    console.log('req.user--->',req.user);
    
    // all data
    const user = await Users.find();
    // const user = await Users.find({name:"sana"}) // specific data
    res.json({
      status: true,
      message: "user fetched successfully",
      data: user,
    });
    console.log(user);
  } catch (error) {
    console.log("error in fetching user-->", error.message);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    // all data
    const { id } = req.params;
    const user = await Users.findById(id);
    if (user == null) {
      console.log("chk raha");

      return res.json({
        status: false,
        message: "connot find user",
      });
    }

    res.json({
      status: true,
      message: "user fetched successfully",
      data: user,
    });
    console.log(user);
  } catch (error) {
    console.log("error in fetching user-->", error.message);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    // all data
    const { id } = req.params;
    console.log("req.body---", req.body);
    //  token from frontend
    const authHeader = req.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;
    //token validation
    if (!token) {
      return res.json({
        status: false,
        message: "token not provided",
        statuscode: 404,
      });
    }

    // token verifitvatiopbdfegjuts
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodedddd----> ", decoded);

    // if token match sucess then update user
    if (decoded.id == id) {
      const updateData = { ...req.body };

      if (req.file) {
        const uploaded = await uploadImg(req.file);
        updateData.profilePic = uploaded.image;
        updateData.profilePicPublicId = uploaded.public_id;
      }

      const updatedUser = await Users.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");
      console.log("data after updating-----> ", updatedUser);
      return res.json({
        status: true,
        message: "user updated succesfully",
        updatedData: updatedUser,
      });
    } else {
      // if token is not valid response return
      return res.json({
        status: false,
        message: "invalid token",
      });
    }

    console.log("nhi gya tok", decoded.id == id);
  } catch (error) {
    console.log("error in updating user-->", error.message);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // all data
    const { id } = req.params;

    const user = await Users.findByIdAndDelete(id);

    console.log("data after delete-----> ", user);

    res.json({
      status: true,
      message: "user deleted successfully",
    });
    console.log(user);
  } catch (error) {
    console.log("error in deleting user-->", error.message);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.json({
        status: false,
        message: "all fields are required",
      });
    }
    const user = await Users.findOne({ email: email });
    if (user == null) {
      return res.json({
        status: false,
        message: "cannot find user",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        status: false,
        message: `this account is not registered as ${role}`,
      });
    }
    
    const decoded =await bcrypt.compare(password,user.password)
     if(decoded){
   const token = jwt.sign(
      { id: user._id, email: user.email,role:user.role},
      process.env.JWT_SECRET,
      function (err, token) {
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        console.log("isline tak aya");

       return res.json({
          status: true,
          message: "user login successfully",
          user: user,
          token: token,
        });
      },
    );
     }else{
      res.status(404).json({
          status: false,
          message: 'invalid credentials',
       
        });
     }
     
     
  
    console.log("JWT SECRET-->", process.env.JWT_SECRET);
    console.log("isline takkk aya");
  

    // console.log("logindata---->", user);
  } catch (error) {
    console.log("error in login user-->", error.message);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    console.log("yeh line bhi chali hai");

    res.json({
      status: true,
      message: "user logout successfully",
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};


const UserProfile =async (req,res)=>{
  console.log(req.user);
  try {
    if(req.user){
   return res.status(200).json({
    status:true,
    user:req.user
   })
    }
  } catch (error) {
    res.status(200).json({
    status:true,
    message :error.message
   })
  }
    
}

const dashboardOverview = async (req, res) => {
  try {
    const users = await Users.find()
      .select("-password")
      .sort({ createdAt: -1 });
    const adminsCount = users.filter((user) => user.role === "admin").length;

    res.json({
      status: true,
      message: "dashboard data fetched successfully",
      data: {
        stats: {
          users: users.length,
          admins: adminsCount,
          database: mongoose.connection.readyState === 1 ? "Active" : "Inactive",
        },
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "email is required",
      });
    }

    const user = await Users.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "no account found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "https://backend-assignment-6-8w1j.vercel.app";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (emailError) {
      user.resetPasswordToken = "";
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        status: false,
        message: emailError.message,
      });
    }

    res.json({
      status: true,
      message: "password reset link sent to your email",
    });
  } catch (error) {
    console.log("error in forgot password-->", error.message);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: false,
        message: "password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await Users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "reset link is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      status: true,
      message: "password reset successfully",
    });
  } catch (error) {
    console.log("error in reset password-->", error.message);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        status: false,
        message: "role must be admin or user",
      });
    }

    const user = await Users.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "user not found",
      });
    }

    res.json({
      status: true,
      message: "user role updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?._id?.toString() === id) {
      return res.status(400).json({
        status: false,
        message: "you cannot delete your own admin account",
      });
    }

    const user = await Users.findByIdAndDelete(id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "user not found",
      });
    }

    res.json({
      status: true,
      message: "user deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export {
  addUser,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  UserProfile,
  dashboardOverview,
  updateUserRole,
  adminDeleteUser
};