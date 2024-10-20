import EditPost from "@/Components/posts/EditPost";
import {usePage} from "@inertiajs/react";
import {Post} from "@/lib/api/types";

const EditPostPage = ({}) => {
    const { post } = usePage().props;
    return (
        <div>
            <EditPost post={post as Post}></EditPost>
        </div>
    );
}
export default EditPostPage;
