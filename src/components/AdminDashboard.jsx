import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Upload } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onClose }) => {
    const [activeTab, setActiveTab] = useState('pillars');
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [fileSize, setFileSize] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setError('');
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'pillars': endpoint = '/api/pillars'; break;
                case 'activities': endpoint = '/api/activities'; break;
                case 'clientele': endpoint = '/api/clientele'; break;
                case 'csr': endpoint = '/api/csr-connects'; break;
                case 'volunteers': endpoint = '/api/volunteers'; break;
                case 'press-releases': endpoint = '/api/press-releases'; break;
                default: return;
            }
            const result = await apiFetch(endpoint);
            setData(result);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data. Is the backend running? " + err.message);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        const newFormData = { ...item };
        // Clear file input value as we can't set it programmatically
        if (newFormData.image_url) delete newFormData.image_url;
        if (newFormData.logo_url) delete newFormData.logo_url;
        setFormData(newFormData);
        setIsAdding(false);
        setFileSize(0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'pillars': endpoint = `/api/pillars/${id}`; break;
                case 'activities': endpoint = `/api/activities/${id}`; break;
                case 'clientele': endpoint = `/api/clientele/${id}`; break;
                case 'csr': endpoint = `/api/csr-connects/${id}`; break;
                case 'volunteers': endpoint = `/api/volunteers/${id}`; break;
                case 'press-releases': endpoint = `/api/press-releases/${id}`; break;
            }
            const res = await apiFetch(endpoint, { method: 'DELETE' });
            // apiFetch throws on error, so if we are here it is success
            fetchData();
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'image' && key !== 'logo') {
                formDataObj.append(key, formData[key]);
            }
        });

        // Handle File Upload
        const fileInput = document.getElementById('file-upload');
        if (fileInput && fileInput.files[0]) {
            if (activeTab === 'clientele' || activeTab === 'csr') {
                formDataObj.append('logo', fileInput.files[0]);
            } else if (activeTab === 'press-releases') {
                formDataObj.append('image', fileInput.files[0]);
            } else {
                formDataObj.append('image', fileInput.files[0]);
            }
        }

        try {
            let endpoint = '';
            let method = isAdding ? 'POST' : 'PUT';
            switch (activeTab) {
                case 'pillars': endpoint = `/api/pillars${isAdding ? '' : '/' + editingId}`; break;
                case 'activities': endpoint = `/api/activities${isAdding ? '' : '/' + editingId}`; break;
                case 'clientele': endpoint = `/api/clientele${isAdding ? '' : '/' + editingId}`; break;
                case 'csr': endpoint = `/api/csr-connects${isAdding ? '' : '/' + editingId}`; break;
                case 'press-releases': endpoint = `/api/press-releases${isAdding ? '' : '/' + editingId}`; break;
            }

            const res = await apiFetch(endpoint, {
                method: method,
                body: formDataObj
            });

            // If success
            setEditingId(null);
            setIsAdding(false);
            setFormData({});
            fetchData();
        } catch (err) {
            console.error("Error saving:", err);
        }
    };

    const handleAddNew = () => {
        setIsAdding(true);
        setEditingId('new');
        setFormData({});
        setFileSize(0);
    };

    const renderFormFields = () => {
        if (activeTab === 'pillars') {
            return (
                <>
                    <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <select value={formData.icon || 'BookOpen'} onChange={e => setFormData({ ...formData, icon: e.target.value })}>
                        <option value="BookOpen">BookOpen (Education)</option>
                        <option value="Utensils">Utensils (Nutrition)</option>
                        <option value="Users">Users (Livelihood)</option>
                        <option value="Heart">Heart (Generic)</option>
                        <option value="Globe">Globe (Environment)</option>
                    </select>
                </>
            );
        }
        if (activeTab === 'activities') {
            return (
                <>
                    <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                    <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                </>
            );
        }
        if (activeTab === 'clientele') {
            return (
                <>
                    <input type="text" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </>
            );
        }
        if (activeTab === 'csr') {
            return (
                <>
                    <input type="text" placeholder="Company Name" value={formData.company_name || ''} onChange={e => setFormData({ ...formData, company_name: e.target.value })} required />
                    <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <input type="text" placeholder="Website URL" value={formData.website_url || ''} onChange={e => setFormData({ ...formData, website_url: e.target.value })} />
                </>
            );
        }
        if (activeTab === 'press-releases') {
            return (
                <>
                    <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                    <textarea placeholder="Content" value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                </>
            );
        }
        if (activeTab === 'press-releases') {
            return (
                <>
                    <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                    <textarea placeholder="Content" value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                </>
            );
        }
    };

    return (
        <div className="admin-dashboard-overlay">
            <motion.div className="admin-dashboard glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="admin-header">
                    <h2>Admin Dashboard</h2>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <div className="admin-tabs">
                    {['pillars', 'activities', 'clientele', 'csr', 'volunteers', 'press-releases'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => { setActiveTab(tab); setEditingId(null); setIsAdding(false); }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="admin-content">
                    {error && (
                        <div style={{ background: '#ff4d4d', color: 'white', padding: '10px', marginBottom: '15px', borderRadius: '5px' }}>
                            Error: {error}
                        </div>
                    )}
                    <div className="content-actions">
                        <h3>Managing {activeTab}</h3>
                        {activeTab !== 'volunteers' && !editingId && (
                            <button className="add-btn" onClick={handleAddNew}>
                                <Plus size={16} /> Add New
                            </button>
                        )}
                    </div>

                    {editingId ? (
                        <form onSubmit={handleSave} className="edit-form glass-panel">
                            <h4>{isAdding ? 'Add New' : 'Edit Item'}</h4>
                            {renderFormFields()}

                            <div className="file-upload-wrapper">
                                <label htmlFor="file-upload" className="file-label">
                                    <Upload size={16} /> {formData.image_url || formData.logo_url ? 'Change Image' : 'Upload Image'}
                                </label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFileSize(e.target.files[0].size);
                                        } else {
                                            setFileSize(0);
                                        }
                                    }}
                                />
                                {(fileSize > 0) && (
                                    <div style={{ marginTop: '5px', fontSize: '0.9em', fontWeight: 'bold' }}>
                                        <span style={{ color: fileSize > 10 * 1024 * 1024 ? '#ff4d4d' : '#4caf50' }}>
                                            Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                        {fileSize > 10 * 1024 * 1024 && <span style={{ color: '#ff4d4d', marginLeft: '10px' }}> (Exceeds 10MB limit)</span>}
                                    </div>
                                )}
                                {(formData.image_url || formData.logo_url) && !isAdding && (
                                    <span className="current-file">Current: {formData.image_url || formData.logo_url}</span>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => { setEditingId(null); setIsAdding(false); }}>Cancel</button>
                                <button type="submit" className="save-btn"><Save size={16} /> Save</button>
                            </div>
                        </form>
                    ) : (
                        <div className={activeTab === 'volunteers' ? 'volunteers-list' : 'items-list'}>
                            {activeTab === 'volunteers' ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'white' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #ffffff33', textAlign: 'left' }}>
                                            <th style={{ padding: '10px' }}>Date</th>
                                            <th style={{ padding: '10px' }}>Name</th>
                                            <th style={{ padding: '10px' }}>Email</th>
                                            <th style={{ padding: '10px' }}>Phone</th>
                                            <th style={{ padding: '10px' }}>Message</th>
                                            <th style={{ padding: '10px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(v => (
                                            <tr key={v.id} style={{ borderBottom: '1px solid #ffffff11' }}>
                                                <td style={{ padding: '10px' }}>{new Date(v.submitted_at).toLocaleDateString()}</td>
                                                <td style={{ padding: '10px' }}>{v.name}</td>
                                                <td style={{ padding: '10px' }}>{v.email}</td>
                                                <td style={{ padding: '10px' }}>{v.phone}</td>
                                                <td style={{ padding: '10px' }}>{v.message}</td>
                                                <td style={{ padding: '10px' }}>
                                                    <button onClick={() => handleDelete(v.id)} className="delete-btn" style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                data.map(item => (
                                    <div key={item.id} className="admin-item">
                                        <div className="item-info">
                                            <img
                                                src={item.image_url || item.logo_url || item.image || '/placeholder.jpg'}
                                                alt="Thumbnail"
                                                className="item-thumb"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                                            />
                                            <div>
                                                <h4>{item.title || item.name || item.company_name}</h4>
                                                <p>{(item.description || '').substring(0, 50)}...</p>
                                            </div>
                                        </div>
                                        <div className="item-actions">
                                            <button onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="delete-btn"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
