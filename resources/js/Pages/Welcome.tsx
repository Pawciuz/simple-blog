import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { useQuery } from '@tanstack/react-query';
import { Post } from '@/lib/api/types';
import PostCard from "@/Components/posts/PostCard";
import { Link } from '@inertiajs/react';

type Props = {
    auth: {
        user: {
            id: number;
            name: string;
        } | null;
    }
};

const Welcome=({ auth }: Props)=> {
    const { data: posts, isLoading, error } = useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await fetch('/posts');
            return await res.json();
        },
    });

    if (isLoading) return <div>Loading posts...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <>
            <Layout>
                <div className="container mx-auto mt-6">
                    <h1 className="text-2xl font-semibold">Posts</h1>

                    {auth.user && (
                        <Link href={"post/create"} className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Add New Post
                        </Link>
                    )}

                    {posts && posts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} user={auth.user} />
                            ))}
                        </div>
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            </Layout>
        </>
    );
}
export default Welcome
