import React, { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigation';
import { Plus, Heart, Edit2, Trash2, Loader2, MessageSquare, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, getDocs, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Post } from '../../types/post';
import './Social.css';

const Social: React.FC = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Comments state
    const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
    const [submittingComment, setSubmittingComment] = useState(false);

    // Load posts
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, 'caregiverPosts'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const postsData: Post[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            } as Post));
            setPosts(postsData);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !title.trim() || !content.trim()) return;

        try {
            setSubmitting(true);
            await addDoc(collection(db, 'caregiverPosts'), {
                authorId: currentUser.id,
                authorName: currentUser.name,
                authorRole: 'caregiver',
                title: title.trim(),
                content: content.trim(),
                createdAt: new Date(),
                updatedAt: new Date(),
                likes: 0,
                likedBy: []
            });

            // Reset form
            setTitle('');
            setContent('');
            setShowCreateForm(false);

            // Reload posts
            await loadPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost || !title.trim() || !content.trim()) return;

        try {
            setSubmitting(true);
            const postRef = doc(db, 'caregiverPosts', editingPost.id);
            await updateDoc(postRef, {
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date()
            });

            // Reset form
            setTitle('');
            setContent('');
            setEditingPost(null);

            // Reload posts
            await loadPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await deleteDoc(doc(db, 'caregiverPosts', postId));
            await loadPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleLikePost = async (post: Post) => {
        if (!currentUser) return;

        try {
            const postRef = doc(db, 'caregiverPosts', post.id);
            const hasLiked = post.likedBy.includes(currentUser.id);

            if (hasLiked) {
                // Unlike
                await updateDoc(postRef, {
                    likes: post.likes - 1,
                    likedBy: arrayRemove(currentUser.id)
                });
            } else {
                // Like
                await updateDoc(postRef, {
                    likes: post.likes + 1,
                    likedBy: arrayUnion(currentUser.id)
                });
            }

            await loadPosts();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const startEdit = (post: Post) => {
        setEditingPost(post);
        setTitle(post.title);
        setContent(post.content);
        setShowCreateForm(false);
    };

    const cancelEdit = () => {
        setEditingPost(null);
        setTitle('');
        setContent('');
    };

    const handleAddComment = async (postId: string) => {
        if (!currentUser || !commentText[postId]?.trim()) return;

        try {
            setSubmittingComment(true);
            const postRef = doc(db, 'caregiverPosts', postId);
            const post = posts.find(p => p.id === postId);

            const newComment = {
                id: Date.now().toString(),
                authorId: currentUser.id,
                authorName: currentUser.name,
                authorRole: 'caregiver' as const,
                content: commentText[postId].trim(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const updatedComments = [...(post?.comments || []), newComment];
            await updateDoc(postRef, {
                comments: updatedComments
            });

            setCommentText(prev => ({ ...prev, [postId]: '' }));
            await loadPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const postRef = doc(db, 'caregiverPosts', postId);
            const post = posts.find(p => p.id === postId);

            const updatedComments = (post?.comments || []).filter(c => c.id !== commentId);
            await updateDoc(postRef, {
                comments: updatedComments
            });

            await loadPosts();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="page-wrapper">
            <Navigation userRole="caregiver" />

            <div className="page-container">
                <div className="social-header">
                    <div>
                        <h1 className="page-title">Caregiver Community</h1>
                        <p className="page-subtitle">Connect with fellow caregivers and share experiences</p>
                    </div>
                    <button
                        className="btn btn-primary create-post-btn"
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            setEditingPost(null);
                            setTitle('');
                            setContent('');
                        }}
                    >
                        <Plus size={20} />
                        Create Post
                    </button>
                </div>

                {/* Create/Edit Post Form */}
                {(showCreateForm || editingPost) && (
                    <div className="post-form-card card">
                        <h3>{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
                        <form onSubmit={editingPost ? handleEditPost : handleCreatePost} className="post-form">
                            <div className="form-group">
                                <label htmlFor="postTitle">Title</label>
                                <input
                                    type="text"
                                    id="postTitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter post title..."
                                    required
                                    disabled={submitting}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="postContent">Content</label>
                                <textarea
                                    id="postContent"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts, tips, or experiences..."
                                    required
                                    disabled={submitting}
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        cancelEdit();
                                    }}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting || !title.trim() || !content.trim()}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            {editingPost ? 'Updating...' : 'Posting...'}
                                        </>
                                    ) : (
                                        editingPost ? 'Update Post' : 'Publish Post'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts Feed */}
                {loading ? (
                    <div className="loading-container">
                        <Loader2 className="animate-spin" size={48} />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="posts-container">
                        {posts.map((post) => (
                            <div key={post.id} className="post-card card">
                                <div className="post-header">
                                    <div className="post-author-info">
                                        <div className="author-avatar">
                                            {post.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="author-details">
                                            <h4>{post.authorName}</h4>
                                            <span className="post-timestamp">
                                                {formatTimestamp(post.createdAt)}
                                                {post.updatedAt.getTime() !== post.createdAt.getTime() && ' (edited)'}
                                            </span>
                                        </div>
                                    </div>
                                    {currentUser && post.authorId === currentUser.id && (
                                        <div className="post-actions">
                                            <button
                                                className="post-action-btn edit"
                                                onClick={() => startEdit(post)}
                                                title="Edit post"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="post-action-btn delete"
                                                onClick={() => handleDeletePost(post.id)}
                                                title="Delete post"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="post-content">
                                    <h2 className="post-title">{post.title}</h2>
                                    <p className="post-body">{post.content}</p>
                                </div>

                                <div className="post-footer">
                                    <button
                                        className={`like-btn ${currentUser && post.likedBy.includes(currentUser.id) ? 'liked' : ''}`}
                                        onClick={() => handleLikePost(post)}
                                    >
                                        <Heart size={18} />
                                        {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                                    </button>
                                    <button
                                        className="like-btn"
                                        onClick={() => setShowCommentsFor(showCommentsFor === post.id ? null : post.id)}
                                    >
                                        <MessageCircle size={18} />
                                        {post.comments?.length || 0} {(post.comments?.length || 0) === 1 ? 'Comment' : 'Comments'}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showCommentsFor === post.id && (
                                    <div className="comments-section">
                                        <div className="comments-header">
                                            <MessageSquare size={16} />
                                            Comments
                                        </div>

                                        {/* Comments List */}
                                        {post.comments && post.comments.length > 0 && (
                                            <div className="comments-list">
                                                {post.comments.map((comment) => (
                                                    <div key={comment.id} className="comment-card">
                                                        <div className="comment-header">
                                                            <div className="comment-author">
                                                                <div className="comment-avatar">
                                                                    {comment.authorName.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="comment-author-name">{comment.authorName}</div>
                                                                    <div className="comment-timestamp">
                                                                        {formatTimestamp(comment.createdAt)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {currentUser && comment.authorId === currentUser.id && (
                                                                <div className="comment-actions">
                                                                    <button
                                                                        className="comment-action-btn delete"
                                                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                        title="Delete comment"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="comment-content">{comment.content}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Comment Input */}
                                        <div className="comment-input-area">
                                            <textarea
                                                className="comment-input"
                                                placeholder="Write a comment..."
                                                value={commentText[post.id] || ''}
                                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                disabled={submittingComment}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleAddComment(post.id);
                                                    }
                                                }}
                                            />
                                            <button
                                                className="comment-submit-btn"
                                                onClick={() => handleAddComment(post.id)}
                                                disabled={submittingComment || !commentText[post.id]?.trim()}
                                            >
                                                {submittingComment ? (
                                                    <Loader2 className="animate-spin" size={16} />
                                                ) : (
                                                    <Send size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <MessageSquare size={64} />
                        <h3>No posts yet</h3>
                        <p>Be the first to share something with the community!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Social;
