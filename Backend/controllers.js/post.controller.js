import cloudinary from "../utils/cloudinary.js";
import Post from '../Models/post.model.js';
import User from '../Models/user.model.js'
import Comment from '../Models/comment.model.js';

export const addNewPost = async(req,res)=>
 {
   try
    { 
     const caption=req.body;
     const image=req.file;
     const authorId=req.id;
     
     if(!image)
      {
        return res.status(400).json({
         message : 'Image Is Required',
         success : false
        })  
      }
     
     const optimizedImageBuffer = await sharp(image.buffer)
          .resize({width :800 ,height : 800 , fit :"inside"})
          .toFormat('jpeg',{qualtiy:80}).toBuffer(); 
     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;      
     const cloudResponse = await cloudinary.uploader.upload(fileUri);
      
     const user = await findById(authorId);
      
     const post = await Post.Create({
        caption,
        image:cloudResponse.secure_url,
        author:user._id      
      });
      
     if(user)
      {
       user.posts.push(post._id);
       await user.save();
      }
      
     await post.populate({path:'author',select:'-password'});
      
     return res.status(201).json({
       message : 'New Post Added',
       post,
       success :true
      });      
    }
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    }      
 }
 
export const getAllPost = async(req,res)=>
 {
   try
    {
       const posts = await Post.find().sort({createdAt:-1}).populate({path:'author',select:'username,profilePicture'})
       .populate({path:'comments',sort:{createdAt:-1},
        populate:{path:'author', select :'username,profilePicture'}
       });
       if(!posts)
         {
           return res.status(400).json({
            message : "No Post Yet",
            success : false
           })
         }
       return res.status(200).json({
         posts,
         success:true
       })
    }
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    }  
 }

export const getUserPost =  async(req,res)=>
 {
   try
    {
      const authorId = req.id;
      const posts = await Post.find({author:authorId}).sort({createdAt:-1})
       .populate({path:'author',select:'username,profilePicture'})
       .populate({path:'comments',sort:{createdAt:-1},
        populate:{path:'author', select :'username,profilePicture'}
       });
       if(!posts)
         {
           return res.status(400).json({
            message : "No Post Yet",
            success : false
           })
         }
       return res.status(200).json({
         posts,
         success:true
       })
    } 
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    }  
 } 
 
export const likePost = async(req,res)=>
 {
   try
    {
      const likeUserAction = req.id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if(!post)
       {
         return res.status(404).json({
          message : "Post Not Found",
          success : false
         })
       }  
      
      await post.updateOne({$addToSet:{likes:likeUserAction}});
      await post.save();
      
      // socketio for Real Time Implementation
      
      return res.status(200).json({
        message : 'Post Liked Successfully' ,
        success : true
      })
       
    }
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    }   
 } 
 
export const dislikePost = async(req,res)=>
 {
   try
    {
      const dislikeUserAction = req.id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if(!post)
       {
         return res.status(404).json({
          message : "Post Not Found",
          success : false
         })
       }  
      
      await post.updateOne({$pull:{likes:dislikeUserAction}});
      await post.save();
      
      // socketio for Real Time Implementation
      
      return res.status(200).json({
        message : 'Post Disliked Successfully' ,
        success : true
      })
       
    }
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    }   
 }

export const addComment = async(req,res)=>
 {
   try
    {
      const postId = req.params.id;
      const commenter = req.id;
      const {text} = req.body;
      const post = await Post.findById(postId);
      
      if(!text)
       {
         return res.status(400).json({
           message : 'Text Is Required',
           success : false
         });
       }
      
      const comment = await Comment.Create({
         text,
         author:commenter,
         post : post._id
      }).populate({path:'authore',select:'username,profilePicture'});
      
      post.comments.push(comment._id);
      await post.save();
      
      return res.status(201).json({
        message : 'Comment Added',
        comment,
        success :  true
      });
       
    }
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    } 
 } 
 
export const getCommentsOfPost = async(req,res)=>
 {
   try
    {
     const postId = req.params.id;
     const comments = await Comment.find({post:postId})
           .populate('author','username,profilePicture');
       
     if(!comments)
      {
        return res.status(404).json({
          message : 'No Comments Yet',
          success : false
         })
      }  
     return res.status(200).json({
        success : true ,
        comments
       });                  
    }
   catch(error)
    {
      console.log(error);
      return res.status(500).json({message:"Internal Server Error",success: false}); 
    }  
  } 
  
export const deletePost = async(req,res)=>
 {
    try
     {
       const postId = req.params.id;
       const authorId = req.id;
       const post = await Post.findById(postId);
       
       if(!post)
        {
          return res.status(404).json({
             message : 'Post Not Found',
             success : false
          })
        }
       
       if(post.author.toString()!==authorId)
        {
          return res.status(403).json({
             message : 'Unauthorized',
             success : false
          })
        }
       
       await Post.findByIdAndDelete(postId);
       
       const user = await User.findById(authorId);
       user.posts = user.posts.filter(id=id.toString()!=postId);
       await user.save();
       
       await Comment.deleteMany({post:postId});
       
       return res.status(200).json({
         success : true ,
         message : 'Post Deleted' 
       });
       
     }
    catch(error)
     {
       console.log(error);
       return res.status(500).json({message:"Internal Server Error",success: false}); 
     }  
 }
 
export const BookmarkPost = async(req,res)=>
 {
    try
     {
       const postId = req.params.id;
       const authorId = req.id;
       const post = await Post.findById(postId);
       
       if(!post)
        {
          return res.status(404).json({
            message : 'Post Not Found',
            success : false
          })
        }
       
       const user = await User.findById(authorId);
       let type,message;
       
       if(user.bookmarks.include(post._id))
        {
          await user.updateOne({$pull:{bookmarks:post._id}});
          await user.save();
          type='unsaved';
          message='Post Removed From Bookmark';
        }
       else
        {
          await user.updateOne({$addToSet:{bookmarks:post._id}});
          await user.save();
          type='saved';
          message='Post Bookmarked'; 
        }
       
       return res.status(200).json({
         type,message,
         success : true
       }) 
        
     }
    catch(error)
     {
       console.log(error);
       return res.status(500).json({message:"Internal Server Error",success: false}); 
     }  
 } 