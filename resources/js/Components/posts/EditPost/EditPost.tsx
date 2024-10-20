import { useState } from 'react';
import { Link} from '@inertiajs/react';
import {  useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {Post} from "@/lib/api/types";


const EditPost = ({post}:{post:Post}) => {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const { mutate, isPending: isUpdating } = useMutation({
        mutationFn: async () => {
            const response = await axios.put(`/posts/${post.id}`, {
                title,
                content
            }, { withCredentials: true });

            if (response.status !== 200) {
                throw new Error('Failed to update the post');
            }

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts']}).then(r =>window.location.href = "/");

        },
        onError: (error: Error) => {
            setErrorMessage(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate();
    };


    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Edit Post</h2>

            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        rows={6}
                        required
                    />
                </div>

                {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}

                <div className="mt-4 flex justify-between">
                    <Link href={`/`} className="text-blue-600 hover:underline">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUpdating ? 'Updating...' : 'Update Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
