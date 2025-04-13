import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

const EditAnnouncement = ({ announcementId, onUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/announcement/${announcementId}`);
      setTitle(res.data.title);
      setDescription(res.data.description);
    };
    fetchData();
  }, [announcementId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/announcements/${announcementId}`, { title, description });
      alert('Updated successfully');
      if (onUpdated) onUpdated();
    } catch (err) {
      alert('Error updating announcement');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 p-4">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" required />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Update</button>
    </form>
  );
};

export default EditAnnouncement;