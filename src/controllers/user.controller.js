import { asyncHandler } from "../utils/asyncHandler.js";

import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    /* step by step algorithm
    get users details from frontend
    validation - not empty
    check if already exists: username,email
    check for images,check for files
    upload them to cloudinary,avatar
    create user object - create entry in db
    remove password and refresh token field from response
    check for user creation
    return res
    */
    const { fullname, email, username, password } = req.body;
    console.log("email :", email);
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400,"All fields are required")
    }
    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if (existedUser) {
        throw new apiError(409,"User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;-> this method give us property undefined error because we kept this property optional this field might not have come but we expect it came

    //another classical if-else code to handle this situation
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new apiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
           throw new apiError(400,"Avatar file is required")
    }
    const user=await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
        
        

    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new apiError(500,"something went wrong while registering the user")
    }
    return res.status(201).json(
        new apiResponse(200,createdUser,"user registered successfully")
    )


})

export { registerUser }

//paused at 32:17 ~summary[take fields,check if empty,take file path form multer at line 27]