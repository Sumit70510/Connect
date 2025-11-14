import cloudinary from "../utils/cloudinary.js";
import {Post} from '../Models/post.model.js';
import {User} from '../Models/user.model.js'
import {Comment} from '../Models/comment.model.js';
import sharp from "sharp";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: 'Image is required',
        success: false,
      });
    }

    const mimeType = image.mimetype;

    let optimizedImageBuffer;

    // For HEIC/HEIF, skip sharp and upload original to Cloudinary
    if (mimeType.includes("heic") || mimeType.includes("heif")) {
      optimizedImageBuffer = image.buffer; // send original
    } else {
      // For other images, keep your old resizing logic
      let format = "jpeg";
      let sharpOptions = { quality: 80 };

      if (mimeType.includes("png")) {
        format = "png";
        sharpOptions = { compressionLevel: 8 };
      } else if (mimeType.includes("webp")) {
        format = "webp";
        sharpOptions = { quality: 85 };
      }

      optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 1080, height: 1080, fit: "inside" })
        .toFormat(format, sharpOptions)
        .toBuffer();
    }

    const cloudResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "posts", resource_type: "auto" }, // auto detects format
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(optimizedImageBuffer);
    });

     const user = await User.findById(authorId);
      
     const post = await Post.create({
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
       const posts = await Post.find().sort({createdAt:-1}).populate({path:'author',select:'username profilePicture'})
       .populate({path:'comments',sort:{createdAt:-1},
        populate:{path:'author', select :'username profilePicture'}
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
       .populate({path:'author',select:'username profilePicture'})
       .populate({path:'comments',sort:{createdAt:-1},
        populate:{path:'author', select :'username profilePicture'}
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
      const post = await Post?.findById(postId);
      
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
      const user = await User?.findById(likeUserAction)?.select('username profilePicture');
      
      const postOwnerId = post?.author?.toString();
      
      if(postOwnerId!==likeUserAction)
       {
         // emit a notification
         const notification = 
           {
              type : 'like',
              userId : likeUserAction,
              userDetails : user,
              postId ,
              message : 'Your Post Was Liked'
           }
          const postOwnerSocketId = getRecieverSocketId(postOwnerId);
          io.to(postOwnerSocketId).emit('notification',notification);
       } 
      
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
      const user = await User?.findById(dislikeUserAction)?.select('username profilePicture');
      
      const postOwnerId = post?.author?.toString();
      
      if(postOwnerId!==dislikeUserAction)
       {
         // emit a notification
         const notification = 
           {
              type : 'dislike',
              userId : dislikeUserAction,
              userDetails : user,
              postId ,
              message : 'Your Post Was DisLiked'
           }
          const postOwnerSocketId = getRecieverSocketId(postOwnerId);
          io.to(postOwnerSocketId).emit('notification',notification);
       } 
      
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
      
      const comment = await Comment.create({
         text,
         author:commenter,
         post : post._id
      })
      
      await comment.populate({path:'author',select:'username profilePicture'});
      
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
 export const delComment = async(req,res)=>
  {
    try
     {
       const postId = req.params.id;
       const commenter = req.id;
       const commentId = req.params.cid;
       
       const post = await Post.findById(postId);
       const comment = await Comment.findById(commentId);
       
       if(!post||!comment)
        {
          return res.status(404).json({
            message : 'Post or Comment not found',
            success : false
          });
        }
       
       if(commenter.toString()!==comment.author.toString())
        {
          return res.status(401).json({
            message : 'Unauthorized',
            success : false
          });
        }
        
       await comment.deleteOne();       
       await post.comments.pull(commentId);
       await post.save();
       
       return res.status(200).json({
         message : 'Comment Deleted',
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
           .populate('author','username profilePicture');
       
     if(!comments)
      {
        return res.status(404).json({
          message : 'No Comments Yet',
          success : false
         })
      }  
      
     return res.status(200).json({
        message : 'All Comments',
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
       user.posts = user.posts.filter(id=>id.toString()!=postId);
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
       
       if(user.bookmarks.includes(post._id))
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
 
export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).
     populate('author', 'username profilePicture')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username profilePicture' }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      post
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
