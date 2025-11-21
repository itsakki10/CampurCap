import React, { useState, useEffect, useCallback } from 'react';
 
// --- DUMMY DATA ---  
const initialPosts = [
    {
        id: 1, user: { name: "Aisha Khan", avatar: "A", role: "Student at Green Valley High" }, time: "3 hours ago",
        content: "Just finished my AR exploration of a virtual rainforest! It's incredible how many species depend on healthy ecosystems. Feeling inspired to start my own mini-garden! 🌳 #ARLearns #EcoAction",
        image: "https://images.unsplash.com/photo-1542867041-f71660ef05b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        likes: 72, comments: 18, type: "Eco-Action"
    },
    {
        id: 2, user: { name: "Dr. Elena Petrova", avatar: "D", role: "Professor" }, time: "2 days ago",
        content: "Fascinating insights from the AI-powered energy grid optimization module. It clearly shows the potential for significant carbon footprint reduction in urban areas. Excited for my students to try this next week! #AIforGood #SustainableCities",
        image: null, likes: 55, comments: 9, type: "Exploration"
    }
];

// Helper to get Tailwind classes based on post type (replace 'smart-green' with your actual CSS variables if not using raw Tailwind)
const getTagClasses = (type) => {
    switch (type.toLowerCase()) {
        case 'eco-action':
        case 'action': return 'bg-smart-green/20 text-smart-dark-green';
        case 'learning': return 'bg-blue-100 text-blue-700';
        case 'exploration': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

// --- PostCard Component ---
const PostCard = ({ post }) => {
    const tagClasses = getTagClasses(post.type);
    
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full bg-smart-light-green text-smart-dark-green mr-3">
                        {post.user.avatar}
                    </div>
                    <div>
                        <p className="font-bold text-smart-text-dark">{post.user.name}</p>
                        <p className="text-xs text-smart-text-light">{post.user.role} • {post.time}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${tagClasses}`}>
                    {post.type}
                </span>
            </div>

            {/* Content */}
            <p className="text-smart-text-light mb-4 leading-relaxed">{post.content}</p>
            
            {/* Image */}
            {post.image && (
                <div className="my-4 -mx-6">
                    <img 
                        src={post.image} 
                        alt="Post Media" 
                        className="w-full h-64 object-cover rounded-b-none rounded-t-xl" 
                    />
                </div>
            )}

            {/* Interaction Bar */}
            <div className="flex justify-around items-center border-t border-gray-100 mt-4 pt-4 text-smart-text-light">
                <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150">
                    <span className="text-red-500">❤️</span><span className="font-medium">{post.likes} Likes</span>
                </button>
                <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150">
                    <span className="text-blue-500">💬</span><span className="font-medium">{post.comments} Comments</span>
                </button>
                <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition duration-150">
                    <span className="text-smart-green">↗️</span><span className="font-medium">Share</span>
                </button>
            </div>
        </div>
    );
};

// --- CreatePostModal Component ---
const CreatePostModal = ({ isOpen, onClose, onSubmitSuccess }) => {
    const [content, setContent] = useState('');
    const [type, setType] = useState('learning');
    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const isSubmitDisabled = !content.trim() && !previewURL;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewURL(url);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (previewURL) URL.revokeObjectURL(previewURL); // Clean up memory
        setPreviewURL(null);
        document.getElementById('imageUploadInput').value = null; // Reset file input
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitDisabled) return;

        const newPost = {
            id: Date.now(),
            user: { name: "You (Demo User)", avatar: "😊", role: "Smart Learner" },
            time: "Just now",
            content: content || "(Shared a photo/exploration)",
            image: previewURL,
            likes: 0,
            comments: 0,
            type: type
        };

        onSubmitSuccess(newPost);
        onClose();
    };
    
    // Cleanup effect when component unmounts or modal closes (important for useEffect)
    useEffect(() => {
        return () => {
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL]);
    
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    return (
        <div 
            className="modal fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 is-open"
            onClick={(e) => e.target.id === 'postModalBackdrop' && onClose()}
            id="postModalBackdrop"
        >
            <div className="modal-content bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-smart-text-dark">Create New Post</h2>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your latest Eco-Action, AR Exploration, or Learning..." 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-smart-green focus:border-smart-green transition duration-150 resize-none text-smart-text-dark"
                        rows="5"
                    />

                    {previewURL && (
                        <div className="mt-4 relative">
                            <img src={previewURL} alt="Image Preview" className="w-full h-40 object-cover rounded-lg" />
                            <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 text-smart-text-light">
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition duration-150">
                                <svg className="w-6 h-6 text-smart-green" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 15h4v4H5v-4zm0-6h4v4H5V9zm6 0h4v4h-4V9zm6 0h4v4h-4V9z"/></svg>
                                <span className="text-sm font-medium">Add Photo</span>
                                <input type="file" id="imageUploadInput" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-smart-green focus:border-smart-green transition duration-150"
                            >
                                <option value="learning">Learning</option>
                                <option value="action">Eco-Action</option>
                                <option value="exploration">Exploration</option>
                            </select>
                        </div>
                        
                        <button 
                            type="submit"
                            className={`bg-smart-green text-white font-semibold py-2 px-6 rounded-full hover:bg-smart-dark-green transition duration-300 shadow-md ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitDisabled}
                        >
                            Post to Feed
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main ImpactFeed Component ---
export default function ImpactFeed() {
    // Initial posts are converted to a state variable
    const [posts, setPosts] = useState(initialPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function passed to the modal to update the feed state
    const handleNewPost = useCallback((newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    }, []);

    // NOTE: Header elements should be placed in your main layout component
    // We only render the feature content here.

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto bg-smart-bg-light min-h-screen">
            <div className="flex justify-between items-center mb-6 pt-4">
                <h1 className="text-3xl font-bold text-smart-text-dark">Eco-Connect: Impact Feed</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-smart-green text-white font-semibold py-2 px-5 rounded-full hover:bg-smart-dark-green transition duration-300 shadow-md flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4C11.45 4 11 4.45 11 5V11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13H11V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19V13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11H13V5C13 4.45 12.55 4 12 4Z"/></svg>
                    <span>New Post</span>
                </button>
            </div>
            
            <div className="space-y-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
            
            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmitSuccess={handleNewPost} 
            />
        </div>
    );
}

// NOTE: To make the custom Tailwind colors work, ensure you include the definitions 
// (smart-green, smart-dark-green, etc.) in your main Tailwind configuration file (e.g., tailwind.config.js).
