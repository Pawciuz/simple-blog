import React, { useState } from 'react';
import { Post, Comment } from '@/lib/api/types';
import { Link } from '@inertiajs/react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface PostCardProps {
    post: Post;
    user: {
        id: number;
        name: string;
    } | null;
}

const PostCard = ({ post, user }: PostCardProps) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<Comment[]>(post.comments || []);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.delete(`/posts/${post.id}`, { withCredentials: true });
            if (response.status !== 204) {
                throw new Error('Failed to delete the post');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: Error) => {
            console.error('Delete error:', error.message);
        }
    });

    const addCommentMutation = useMutation({
        mutationFn: async (comment: string) => {
            const response = await axios.post(`/posts/${post.id}/comments`, { comment: comment,  }, { withCredentials: true });
            return response.data;
        },
        onSuccess: (newComment) => {
            setComments([...comments, newComment]);
            setNewComment('');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: Error) => {
            console.error('Add comment error:', error.message);
        }
    });
    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId: number) => {
            const response = await axios.delete(`/comments/${commentId}`, { withCredentials: true });
            if (response.status !== 204) {
                throw new Error('Failed to delete the comment');
            }
            return commentId;
        },
        onSuccess: (commentId: number) => {
            setComments(comments.filter(comment => comment.id !== commentId));
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: Error) => {
            console.error('Delete comment error:', error.message);
        }
    });

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addCommentMutation.mutate(newComment);
        }
    };
    const handleDeleteComment = (commentId: number) => {
        deleteCommentMutation.mutate(commentId);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">
                <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                    {post.title}
                </Link>
            </h2>
            <p className="text-gray-600">By: {post.user.name}</p>
            <p className="mt-2">{post.content.substring(0, 100)}...</p>
            <div className="mt-4 flex justify-between">
                <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                    View Post
                </Link>
                {user?.id === post.user.id && (
                    <>
                        <Link href={`/posts/${post.id}/edit`} className="text-blue-600 hover:underline">
                            Edit
                        </Link>
                        <button className="text-red-600 hover:underline" onClick={() => deleteMutation.mutate()}>Delete</button>
                    </>
                )}
            </div>

            {/* Comments section */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                {comments.map((comment) => (
                    <div key={comment.id} className="mt-2 p-2 bg-gray-100 rounded flex justify-between items-center">
                        <div>
                            <p>{comment.comment}</p>
                            <p className="text-sm text-gray-500">By: {comment.user.name}</p>
                        </div>
                        {user?.id === comment.user.id && (
                            <button
                                className="text-red-600 hover:underline ml-2"
                                onClick={() => handleDeleteComment(comment.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}

                {/* Add comment form */}
                {user && (
                    <form onSubmit={handleAddComment} className="mt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Add a comment..."
                        />
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={addCommentMutation.isPending}
                        >
                            {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostCard;
