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

const Gallery = ({ user }) => {
    const [folders, setFolders] = useState([]);
    const [images, setImages] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Upload Modal State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploadDesc, setUploadDesc] = useState('');

    // Fetch Folders on Mount
    useEffect(() => {
        apiFetch('/api/folders')
            .then(data => setFolders(data))
            .catch(err => console.error("API Error:", err));
    }, []);

    // Fetch Images when Folder Selected
    useEffect(() => {
        if (currentFolder) {
            apiFetch(`/api/images?folderId=${currentFolder.id}`)
                .then(data => setImages(data))
                .catch(err => console.error("API Error:", err));
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
            alert("Failed to create folder");
        }
    };

    const handleUploadImage = () => {
        setUploadFiles([]);
        setUploadDesc('');
        setIsUploadOpen(true);
    };

    const performUpload = async () => {
        if (uploadFiles.length === 0) return;

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
        }
    };
    const handleDeleteFolder = async (folderId, e) => {
        e.stopPropagation();
        if (confirm("Delete this folder?")) {
            try {
                await apiFetch(`/api/folders/${folderId}`, { method: 'DELETE' });
                setFolders(folders.filter(f => f.id !== folderId));
                // Also clear images if the deleted folder was the current one
                if (currentFolder && currentFolder.id === folderId) {
                    setCurrentFolder(null);
                }
            } catch (err) {
                alert("Failed to delete folder");
            }
        }
    };

    const handleDeleteImage = async (imgId, e) => {
        e.stopPropagation();
        if (confirm("Delete this image?")) {
            try {
                await apiFetch(`/api/images/${imgId}`, { method: 'DELETE' });
                setImages(images.filter(i => i.id !== imgId));
            } catch (err) {
                alert("Failed to delete image");
            }
        }
    };

    // --------------------------------------------------------------------------

    // filteredImages is no longer needed as images are fetched per folder
    // const filteredImages = currentFolder
    //     ? images.filter(img => img.folderId === currentFolder.id)
    //     : [];

    return (
        <section id="gallery" className="gallery-section">
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
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                style={{ overflow: 'hidden', padding: 0 }}
                            >
                                <div
                                    className="folder-cover"
                                    style={{
                                        height: '200px',
                                        backgroundImage: folder.cover_image ? `url(${folder.cover_image})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {!folder.cover_image && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Folder size={48} color="var(--color-gold)" opacity={0.5} />
                                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Empty Album</span>
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
                                                zIndex: 10,
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

                                <div className="folder-details" style={{ padding: '1.5rem' }}>
                                    <h3 style={{
                                        color: 'var(--color-gold)',
                                        marginBottom: '0.5rem',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.25rem'
                                    }}>
                                        {folder.name}
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
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
                                const thumbUrl = isExternal ? fullUrl : (filename ? getImageUrl(`api/thumbnail/${filename}`) : '');

                                return (
                                    <motion.div
                                        key={img.id}
                                        className="gallery-item"
                                        onClick={() => setSelectedImage(fullUrl)}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <img src={thumbUrl || fullUrl} alt={img.description} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <p className="img-caption">{img.description}</p>
                                            {user && (
                                                <button
                                                    className="delete-img-btn"
                                                    onClick={(e) => handleDeleteImage(img.id, e)}
                                                    style={{ padding: '8px', borderRadius: '50%', background: '#ff6b6b', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={20} color="white" />
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
