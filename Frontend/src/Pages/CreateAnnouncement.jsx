import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';

const CreateAnnouncement = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    attachments.forEach(file => formData.append('attachments', file));

    try {
      await api.post('/api/announcements', formData);
      alert('Announcement created successfully');
      setTitle('');
      setDescription('');
      setAttachments([]);
      if (onCreated) onCreated();
    } catch (err) {
      alert('Error creating announcement');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 w-full" required />
      <input type="file" multiple accept=".pdf,.jpg,.png,.jpeg" onChange={(e) => setAttachments([...e.target.files])} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create</button>
    </form>
  );
};

export default CreateAnnouncement;