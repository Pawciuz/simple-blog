import PostDetails from "@/Components/posts/PostDetails";
import {Post} from "@/lib/api/types";

const PostDetailsPage = ({post}:{post:Post}) => {
    const {title, content,id} = post;
    return (
        <PostDetails title={title} content={content} id={id}/>
    );
}
export default PostDetailsPage;
