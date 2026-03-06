require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
const upload = require('./models/multer');
const fs = require('fs');
const path = require('path');

const User = require('./models/user');
const TravelStory = require('./models/travelstory.model');

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.post('/create-account', async(req,res)=>{
    const{fullname,email,password} = req.body || {};
    if(!fullname || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const isUser = await User.findOne({email});
    if(isUser){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({fullname,email,password:hashedPassword});
    await user.save();
    const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"2d"});
    res.status(201).json({user:{fullname:user.fullname,email:user.email},message:"User created successfully",accessToken});
});
app.post('/login',async(req,res)=>{
    const{email,password} = req.body ||{};
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    const ispasswordvalid=await bcrypt.compare(password,user.password);
    if(!ispasswordvalid){
        return res.status(400).json({message:"Invalid password"});
    }
    const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"2d"});
    return res.status(200).json({user:{fullname:user.fullname,email:user.email},message:"Login successful",accessToken});
});
app.get('/get-user',authenticateToken,async(req,res)=>{
    const {userId} = req.user.id;
    const isUser = await User.findOne({userId});
    if(!isUser){
       return res.status(401).json({message:"User not found"});
    }
    return res.json({
        user:isUser,
        message:"User fetched successfully",
    });
});
app.post('/post-image', upload.single('image'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({ message: "Image uploaded successfully", imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.delete('/delettoriese-image', async (req, res) => {
    const { imageUrl } = req.query ;
    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
    }
    try {
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, 'uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.status(200).json({ message: "Image deleted successfully" });
        } else {
            return res.status(404).json({ message: "Image not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
app.post('/add-travel-story', authenticateToken, async (req, res) => {

    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body || {};

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user.id;

    try {
        const newStory = new TravelStory({
            title,
            story,
            visitedLocation,
            imageUrl,
            visitedDate,
            userId
        });

        await newStory.save();

        return res.status(201).json({
            message: "Travel story added successfully",
            story: newStory
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});
app.get('/get-travel-stories', authenticateToken, async (req, res) => {

    try {
        const userId = req.user.id;

        const stories = await TravelStory.find({ userId })
            .sort({ createdOn: -1 });

        return res.status(200).json({
            message: "Stories fetched successfully",
            stories
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
app.put('/edit-travel-story/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const userId = req.user.id;
     if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const parsedvisistedDate = new Date(visitedDate);
    try {
        const travelstory = await TravelStory.findOne({ _id: id, userId });
        if (!travelstory) {
            return res.status(404).json({ message: "Travel story not found" });
        }
        const placeholderImageUrl = "http://localhost:8000/assets/ts.jpeg";
        travelstory.title = title;
        travelstory.story = story;
        travelstory.visitedLocation = visitedLocation;
        travelstory.imageUrl = imageUrl || placeholderImageUrl;
        travelstory.visitedDate = parsedvisistedDate;  
        await travelstory.save();
        return res.status(200).json({
            message: "Travel story updated successfully",
            story: travelstory
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
app.delete('/delete-travel-story/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;
    const userId = req.user.id;
    try{
        const travelstory = await TravelStory.findOne({ _id: id, userId });
        if(!travelstory){
            return res.status(404).json({message:"Travel story not found"});
        }
        await TravelStory.deleteOne({_id:id,userId});
        const imageUrl = travelstory.imageUrl;
        if (imageUrl && imageUrl !== 'http://localhost:8000/assets/ts.jpeg') {
            const urlParts = imageUrl.split('/');
            const filenameWithQuery = urlParts[urlParts.length - 1];
            const filename = filenameWithQuery.split('?')[0];
            const filePath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return res.status(200).json({message:"Travel story deleted successfully"});
    }catch(error){
        return res.status(500).json({message:"Server error",error:error.message});
    }
});
app.put('/isfavourite/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;
    const userId = req.user.id;
    const { isFavourite } = req.body;
    try{
        const travelstory = await TravelStory.findOne({ _id: id, userId });
        if(!travelstory){
            return res.status(404).json({message:"Travel story not found"});
        }
        travelstory.isFavourite = isFavourite;
        await travelstory.save();
        return res.status(200).json({
            message:"Favourite status updated successfully",
            story:travelstory
        });
    }catch(error){
        return res.status(500).json({message:"Server error",error:error.message});
    }   
});
app.get('/search-travel-stories', authenticateToken, async (req, res) => {

    const { query } = req.query;
    const userId = req.user.id;
    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }
    try {
        const searchresults = await TravelStory.find({
            userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } }
            ]
        }).sort({ createdOn: -1 });
        res.status(200).json({stories: searchresults});
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});
app.get('/travel-story-filter', authenticateToken, async (req, res) => {

    const {startDate,endDate} = req.query;
    const userId = req.user.id;
    try{
        const start= new Date(startDate);
        const end = new Date(endDate);
        const filteredStories = await TravelStory.find({
            userId:userId,
            visitedDate: {
                $gte: start,$lte: end },
        }).sort({ visitedDate: -1 });
        res.status(200).json({stories:filteredStories});
    }catch(error){
        return res.status(500).json({message:"Server error",error:error.message});
    }
});
app.listen(8000,()=>{       
    console.log("Server is running on port 8000");
});