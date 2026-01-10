import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Folder, Plus, Trash2, ArrowLeft, Upload } from 'lucide-react';
import { apiFetch, getImageUrl } from '../utils/api';
import './Gallery.css';

// MOCK DATA FOR DEMONSTRATION (Used when Firebase is not configured)
const INITIAL_FOLDERS = [
    { id: '1', name: 'Community Events 2024', description: 'Recent gatherings and celebrations' },
    { id: '2', name: 'Education Drive', description: 'School supplies distribution' },
];

const INITIAL_IMAGES = [
    { id: 'img1', folderId: '1', url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000", description: 'Village gathering' },
    { id: 'img2', folderId: '1', url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000", description: 'Dance performance' },
    { id: 'img3', folderId: '2', url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000", description: 'Classroom session' },
    { id: 'img4', folderId: '1', url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000", description: 'Evening prayers' },
    { id: 'img5', folderId: '1', url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000", description: 'Community feast' },
];

/**
 * Optimizes Cloudinary URLs for thumbnail/preview display
 * @param {string} url - Original Image URL
 * @param {number} width - Target width
 * @returns {string} Optimized URL
 */
const getOptimizedUrl = (url, width = 400) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        // Insert transformation params for massive size reduction
        return url.replace('/upload/', `/upload/w_${width},c_limit,q_auto,f_auto/`);
    }
    return url;
};

const Gallery = ({ user }) => {
    const [folders, setFolders] = useState([]);
    const [images, setImages] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Upload Modal State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploadDesc, setUploadDesc] = useState('');

    // Fetch Folders on Mount
    useEffect(() => {
        setIsLoading(true);
        apiFetch('/api/folders')
            .then(data => setFolders(data))
            .catch(err => console.error("API Error:", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Fetch Images when Folder Selected
    useEffect(() => {
        if (currentFolder) {
            setIsLoading(true);
            apiFetch(`/api/images?folderId=${currentFolder.id}`)
                .then(data => setImages(data))
                .catch(err => console.error("API Error:", err))
                .finally(() => setIsLoading(false));
        } else {
            setImages([]); // Clear images when no folder is selected
        }
    }, [currentFolder]);

    // -- MYSQL API HANDLERS --

    const handleCreateFolder = async () => {
        const name = prompt("Enter folder name:");
        if (!name) return;
        const description = prompt("Enter folder description:");

        // API Call
        setIsLoading(true);
        try {
            const newFolder = await apiFetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            setFolders([newFolder, ...folders]);
            setCurrentFolder(newFolder); // Auto-open to encourage upload
        } catch (err) {
            console.error(err);
            alert(`Failed to create folder: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadImage = () => {
        setUploadFiles([]);
        setUploadDesc('');
        setIsUploadOpen(true);
    };

    const performUpload = async () => {
        if (uploadFiles.length === 0) return;

        setIsLoading(true);
        try {
            // Upload all files in parallel
            const uploadPromises = uploadFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('folderId', currentFolder.id);
                formData.append('description', uploadDesc || file.name);

                return await apiFetch('/api/images', {
                    method: 'POST',
                    body: formData
                });
            });

            const newImages = await Promise.all(uploadPromises);
            setImages((prev) => [...newImages, ...prev]);
            setIsUploadOpen(false); // Close modal
        } catch (err) {
            console.error(err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteFolder = async (folderId, e) => {
        e.stopPropagation();
        if (confirm("Delete this folder?")) {
            setIsLoading(true);
            try {
                await apiFetch(`/api/folders/${folderId}`, { method: 'DELETE' });
                setFolders(folders.filter(f => f.id !== folderId));
                // Also clear images if the deleted folder was the current one
                if (currentFolder && currentFolder.id === folderId) {
                    setCurrentFolder(null);
                }
            } catch (err) {
                alert(`Failed to delete folder: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeleteImage = async (imgId, e) => {
        e.stopPropagation();
        if (confirm("Delete this image?")) {
            setIsLoading(true);
            try {
                await apiFetch(`/api/images/${imgId}`, { method: 'DELETE' });
                setImages(images.filter(i => i.id !== imgId));
            } catch (err) {
                alert(`Failed to delete image: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --------------------------------------------------------------------------

    return (
        <section id="gallery" className="gallery-section" style={{ position: 'relative', zIndex: 20 }}>
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.7)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-gold)',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <div className="spinner" style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid rgba(201, 168, 117, 0.3)',
                            borderTop: '4px solid var(--color-gold)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <span>Processing...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="title-row">
                        {currentFolder && (
                            <button className="back-btn" onClick={() => setCurrentFolder(null)}>
                                <ArrowLeft size={24} /> Back
                            </button>
                        )}
                        <h2 className="section-title">
                            {currentFolder ? currentFolder.name : "Visual Archive"}
                        </h2>
                    </div>
                    {currentFolder && (
                        <p className="folder-detail-desc">{currentFolder.description}</p>
                    )}
                    <div className="divider-gold"></div>
                </motion.div>

                {/* FOLDER VIEW */}
                {!currentFolder && (
                    <div className="folders-grid">
                        {user && (
                            <motion.div
                                className="folder-card create-card"
                                onClick={handleCreateFolder}
                                whileHover={{ scale: 1.05 }}
                                style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Plus size={40} className="add-icon" />
                                <span>Create Album</span>
                            </motion.div>
                        )}

                        {folders.map((folder) => (
                            <motion.div
                                key={folder.id}
                                className="folder-card glass-panel"
                                onClick={() => setCurrentFolder(folder)}
                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                style={{
                                    overflow: 'hidden',
                                    padding: 0,
                                    aspectRatio: '1', /* FORCE SQUARE */
                                    position: 'relative'
                                }}
                            >
                                <div
                                    className="folder-cover"
                                    style={{
                                        height: '100%', /* FILL CARD */
                                        width: '100%',
                                        backgroundImage: folder.cover_image ? `url(${getOptimizedUrl(folder.cover_image, 500)})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.5)' /* Darken for text readability */
                                    }}
                                >
                                    {!folder.cover_image && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Folder size={48} color="var(--color-gold)" opacity={0.5} />
                                        </div>
                                    )}

                                    {user && (
                                        <button
                                            className="delete-item-btn"
                                            onClick={(e) => handleDeleteFolder(folder.id, e)}
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                zIndex: 20,
                                                background: '#ff4d4d',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            <Trash2 size={16} color="white" />
                                        </button>
                                    )}
                                </div>

                                {/* Overlay Text at Bottom */}
                                <div className="folder-details" style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                    zIndex: 10
                                }}>
                                    <h3 style={{
                                        color: 'var(--color-gold)',
                                        marginBottom: '0.2rem',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.2rem',
                                        marginTop: 0
                                    }}>
                                        {folder.name}
                                    </h3>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '0.8rem',
                                        lineHeight: '1.4',
                                        margin: 0,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {folder.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* IMAGE GRID VIEW */}
                {currentFolder && (
                    <div className="images-container">
                        {user && (
                            <div className="admin-actions">
                                <button className="gold-btn" onClick={handleUploadImage}>
                                    <Upload size={18} /> Upload Image
                                </button>
                            </div>
                        )}

                        <div className="gallery-grid">
                            {images.length === 0 && <p className="empty-msg">No images in this album yet.</p>}

                            {images.map((img, index) => {
                                const fullUrl = img.image_url || img.url;
                                // If it's a Cloudinary/External URL, use it directly. Otherwise use local thumbnail.
                                const isExternal = fullUrl && (fullUrl.startsWith('http') || fullUrl.startsWith('https'));
                                const filename = fullUrl ? fullUrl.split('/').pop() : '';

                                // Optimize external (Cloudinary) images or use local thumbnail endpoint
                                const thumbUrl = isExternal
                                    ? getOptimizedUrl(fullUrl, 400)
                                    : (filename ? getImageUrl(`api/thumbnail/${filename}`) : '');

                                return (
                                    <motion.div
                                        key={img.id}
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div
                                            className="gallery-item"
                                            onClick={() => setSelectedImage(fullUrl)}
                                        >
                                            <img
                                                src={thumbUrl || fullUrl}
                                                alt={img.description}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400"; // Fallback
                                                }}
                                            />
                                        </div>

                                        {/* Caption Below Image */}
                                        <div className="gallery-caption-container">
                                            <div className="img-title">MEMORIES 2025</div>
                                            <div className="img-desc">{img.description}</div>

                                            {user && (
                                                <button
                                                    onClick={(e) => handleDeleteImage(img.id, e)}
                                                    style={{ marginTop: '5px', padding: '4px 8px', fontSize: '0.8rem', background: '#ff6b6b', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* UPLOAD MODAL */}
            <AnimatePresence>
                {isUploadOpen && (
                    <div className="admin-dashboard-overlay">
                        <motion.div className="admin-dashboard glass-panel" style={{ maxWidth: '500px', margin: '100px auto' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="admin-header">
                                <h3>Upload to {currentFolder?.name}</h3>
                                <button onClick={() => setIsUploadOpen(false)} className="close-btn"><X size={24} /></button>
                            </div>

                            <div className="admin-content" style={{ padding: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Common Caption (Optional)"
                                    value={uploadDesc}
                                    onChange={e => setUploadDesc(e.target.value)}
                                    style={{ width: '100%', marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '5px' }}
                                />

                                <div className="file-upload-wrapper" style={{ border: '2px dashed rgba(255,255,255,0.3)', padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
                                    <label htmlFor="gallery-upload" className="file-label" style={{ cursor: 'pointer', display: 'block' }}>
                                        <Upload size={32} style={{ display: 'block', margin: '0 auto 10px' }} />
                                        Click to Select Images
                                    </label>
                                    <input
                                        type="file"
                                        id="gallery-upload"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setUploadFiles(Array.from(e.target.files))}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {uploadFiles.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <h4 style={{ color: 'var(--color-gold)', marginBottom: '10px' }}>Selected Files ({uploadFiles.length})</h4>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {uploadFiles.map((file, idx) => {
                                                const sizeMB = file.size / (1024 * 1024);
                                                const isTooLarge = file.size > 10 * 1024 * 1024;
                                                return (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{file.name}</span>
                                                        <span style={{ fontSize: '0.9rem', color: isTooLarge ? '#ff4d4d' : '#4caf50', fontWeight: 'bold' }}>
                                                            {sizeMB.toFixed(2)} MB {isTooLarge ? '(!)' : ''}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button onClick={() => setIsUploadOpen(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                    <button
                                        onClick={performUpload}
                                        disabled={uploadFiles.length === 0}
                                        className="gold-btn"
                                        style={{ opacity: uploadFiles.length === 0 ? 0.5 : 1 }}
                                    >
                                        Upload {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ''}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            src={selectedImage}
                            alt="Full size"
                            className="lightbox-image"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                        />
                        <button className="lightbox-close">
                            <X size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
