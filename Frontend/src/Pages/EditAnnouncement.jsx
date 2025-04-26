import React, { useState, useEffect } from 'react';
import { X, Upload, X as CloseIcon } from 'lucide-react';
import api from '../api';

const EditAnnouncement = ({ announcementId, initialData, onUpdated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const baseURL = "http://localhost:3000";
  
  useEffect(() => {
    // If initialData is provided, use it to populate the form
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setExistingAttachments(initialData.attachments || []);
    } else {
      // Otherwise fetch the announcement data
      const fetchAnnouncementData = async () => {
        try {
          const res = await api.get(`/announcement/${announcementId}`);
          // Check for different response structures
          const announcement = res.data.data || res.data.announcement || res.data;
          setTitle(announcement.title || '');
          setDescription(announcement.description || '');
          setExistingAttachments(announcement.attachments || []);
        } catch (err) {
          console.error('Error fetching announcement details', err);
          setError('Failed to load announcement details');
        }
      };
      
      fetchAnnouncementData();
    }
  }, [announcementId, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      // Append any new files to be uploaded
      attachments.forEach(file => {
        formData.append('files', file);
      });
      
      // Add existing attachments that should be kept
      formData.append('existingAttachments', JSON.stringify(existingAttachments));
      
      // Use formData with multipart/form-data for the update
      await api.put(`/announcement/${announcementId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onUpdated();
    } catch (err) {
      console.error('Error updating announcement', err);
      setError('Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };
  
  const removeNewFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const removeExistingFile = (index) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
  };
  
  // Preview for new files
  const renderNewFilePreview = (file, index) => {
    const isImage = file.type.startsWith('image/');
    const fileURL = URL.createObjectURL(file);
    
    return (
      <div key={`new-${index}`} className="relative group border border-gray-200 rounded-lg overflow-hidden">
        {isImage ? (
          <div className="h-24 w-24 relative">
            <img 
              src={fileURL} 
              alt={file.name}
              className="h-full w-full object-cover" 
            />
            <button 
              type="button" 
              onClick={() => removeNewFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 flex items-center justify-center bg-gray-100 relative">
            <div className="text-center p-2">
              <p className="text-xs truncate max-w-full">{file.name}</p>
            </div>
            <button 
              type="button" 
              onClick={() => removeNewFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Preview for existing files
  const renderExistingFilePreview = (filePath, index) => {
    const fixedPath = filePath.replace(/\\/g, '/');
    const fileURL = `${baseURL}/${fixedPath}`;
    const fileName = fixedPath.split('/').pop();
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
    
    return (
      <div key={`existing-${index}`} className="relative group border border-gray-200 rounded-lg overflow-hidden">
        {isImage ? (
          <div className="h-24 w-24 relative">
            <img 
              src={fileURL} 
              alt={fileName}
              className="h-full w-full object-cover" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
              }}
            />
            <button 
              type="button" 
              onClick={() => removeExistingFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 flex items-center justify-center bg-gray-100 relative">
            <div className="text-center p-2">
              <p className="text-xs truncate max-w-full">{fileName}</p>
            </div>
            <button 
              type="button" 
              onClick={() => removeExistingFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Edit Announcement</h3>
        <button 
          onClick={onCancel} 
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          
          {/* Existing attachments */}
          {existingAttachments.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Current attachments:</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {existingAttachments.map((file, idx) => renderExistingFilePreview(file, idx))}
              </div>
            </div>
          )}
          
          {/* New attachments preview */}
          {attachments.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">New attachments:</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {attachments.map((file, idx) => renderNewFilePreview(file, idx))}
              </div>
            </div>
          )}
          
          {/* File input */}
          <div className="mt-2">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-6 py-4 transition-all hover:border-blue-400"
            >
              <Upload className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Upload new images or files</span>
              <input
                id="file-upload"
                name="files"
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnnouncement;