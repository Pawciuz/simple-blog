export type User = {
    id: number;
    name: string;
};

export type Comment = {
    id: number;
    post_id: number;
    user_id: number;
    comment: string;
    created_at: string; // or Date, depending on how you handle dates
    user: User; // assuming you want to include the user who made the comment
};

export type Post = {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string; // or Date
    user: User; // the user who created the post
    comments: Comment[]; // array of comments associated with the post
};
