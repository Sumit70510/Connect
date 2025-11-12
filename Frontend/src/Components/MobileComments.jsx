import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setSelectedPost, setPosts } from "@/Redux/postSlice";
import Comment from "./Comment";
import { Button } from "./ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function MobileComments() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, selectedPost } = useSelector((store) => store.post);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // 🟢 Load post from Redux or fetch if not found
  useEffect(() => {
    const foundPost = posts.find((p) => p._id === postId);
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments || []);
      dispatch(setSelectedPost(foundPost));
    } else {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`/api/v1/post/${postId}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            setPost(res.data.post);
            setComments(res.data.post.comments || []);
            dispatch(setSelectedPost(res.data.post));
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchPost();
    }
  }, [postId, posts, dispatch]);

  const sendMessageHandler = async () => {
    if (!text.trim() || !selectedPost) return;
    try {
      const res = await axios.post(
        `/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        const updatedSelectedPost = {
          ...selectedPost,
          comments: updatedCommentData,
        };

        dispatch(setSelectedPost(updatedSelectedPost));
        dispatch(setPosts(updatedPostData));

        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  if (!post) return null;

  return (
     <div className={`flex min-h-screen justify-center overflow-y-hidden `}>
    <div className="bg-black text-white flex flex-col gap-2 h-full w-full box-border">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
        <ArrowLeft onClick={() => navigate(-1)} className="w-6 h-6 cursor-pointer" />
        <h1 className="text-lg font-semibold">Comments</h1>
      </div>

      {/* Post Author */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-3 items-center">
          <Link>
            <Avatar>
              <AvatarImage src={post?.author?.profilePicture} />
              <AvatarFallback>
                {post?.author?.username?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link className="font-semibold text-xs">
              {post?.author?.username}
            </Link>
            <span className="text-gray-600 text-sm"> {post?.author?.bio} </span>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center bg-zinc-700 text-sm text-center">
            <div className="cursor-pointer w-full font-bold text-[#ED4956]">
              Unfollow
            </div>
            <div className="cursor-pointer w-full">Add To Favourite</div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      {post?.image && (
        <div className="w-full">
          <img
            src={post.image}
            alt="post"
            className="w-full object-contain bg-black max-h-[400px]"
          />
        </div>
      )}

      {/* Comments Section (scrollable separately) */}
      <div className="flex-1 overflow-y-scroll hide-scrollbar p-4 space-y-3">
        {comments.length > 0 ? (
          comments.map((c) => <Comment key={c._id} comment={c} />)
        ) : (
          <p className="text-gray-500 text-center mt-10">No comments yet.</p>
        )}
      </div>

      {/* Input Bar (fixed bottom) */}
      <div className="flex fixed items-center w-full gap-2 border-t border-gray-800 p-3 bottom-0 bg-black">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm  placeholder-red-500"
        />
        <Button
          onClick={sendMessageHandler}
          disabled={!text.trim()}
          variant="outline"
          className="text-sm shrink-0 cursor-pointer text-black"
        >
          Send
        </Button>
      </div>
     </div>
    </div>
  );
}
