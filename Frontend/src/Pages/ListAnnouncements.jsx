import React, { useEffect, useState } from 'react';

import EditAnnouncement from './EditAnnouncement';
import api from '../api';


const ListAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchAnnouncements = async () => {
    const res = await api.get('/announcement');
    setAnnouncements(res.data.announcements);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcement/${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert('Error deleting announcement');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      {announcements.map((a) => (
        <div key={a._id} className="border rounded p-4 mb-4">
          {editingId === a._id ? (
            <EditAnnouncement
              announcementId={a._id}
              onUpdated={() => {
                setEditingId(null);
                fetchAnnouncements();
              }}
            />
          ) : (
            <>
              <h3 className="text-xl font-semibold">{a.title}</h3>
              <p>{a.description}</p>
              {a.attachments?.map((file, index) => (
                <a key={index} href={file} target="_blank" rel="noreferrer" className="text-blue-600 block">
                  View Attachment {index + 1}
                </a>
              ))}
              <div className="mt-2 space-x-2">
                <button onClick={() => setEditingId(a._id)} className="text-yellow-600">Edit</button>
                <button onClick={() => handleDelete(a._id)} className="text-red-600">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListAnnouncement;