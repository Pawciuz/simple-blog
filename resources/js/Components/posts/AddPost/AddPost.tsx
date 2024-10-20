
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const AddPost = () => {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { mutate, isPending: isCreating } = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/posts', {
                title,
                content
            }, { withCredentials: true });

            if (response.status !== 201) {
                throw new Error('Failed to create the post');
            }

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] }).then(() => window.location.href = "/");
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
            <h2 className="text-xl font-bold">Create New Post</h2>

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
                        disabled={isCreating}
                        className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isCreating ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPost;
