export interface Post {
    _id: string;
    body: string;
    image: string;
    privacy: string;
    user: User;
    sharedPost: Post | null;
    likes: any[];
    createdAt: Date;
    commentsCount: number;
    topComment: any;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
    bookmarked: boolean;
    isLiked: boolean;
}

export interface User {
    _id: string;
    name: string;
    username: string;
    photo: string;
}