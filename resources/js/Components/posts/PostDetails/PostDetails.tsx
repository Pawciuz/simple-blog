import { Link } from '@inertiajs/react';

const PreviewPost = ({ title, content,id }: { title: string; content: string,id:number }) => {
    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">{title}</h2>

            <div className="mt-4">
                <p className="text-gray-700">{content}</p>
            </div>

            <div className="mt-4 flex justify-between">
                <Link href={'/'} className="text-blue-600 hover:underline">
                    Back to Posts
                </Link>
                <Link
                    href={`/posts/${id}/edit`}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Edit Post
                </Link>
            </div>
        </div>
    );
};

export default PreviewPost;
