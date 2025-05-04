// import React, { useState, useContext, useEffect } from 'react';
// import { AuthContext } from '../AuthContext';
// import api from '../api';
// import { 
//   Megaphone, 
//   Upload, 
//   X, 
//   Check
// } from 'lucide-react';

// const CreateAnnouncement = ({ onCreated }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [clubId, setClubId] = useState('');
//   const [clubs, setClubs] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
    
//     fetchClubs();
//   }, [user]);

//   const fetchClubs = async () => {
//     try {
//       console.log('Fetching clubs...');
//       const response = await api.get('/club');
//       console.log('API response:', response);
      
//       if (response.data && response.data) {
//         console.log('Clubs data:', response.data);
//         setClubs(response.data);
//       } else {
//         console.error('Unexpected API response structure:', response);
//       }
//     } catch (err) {
//       console.error('Error fetching clubs:', err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');
//     setSuccess('');

//     if (!clubId) {
//       setError('Please select a club');
//       setIsSubmitting(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('clubId', clubId);
    
//     if (attachments.length > 0) {
//       attachments.forEach(file => formData.append('attachments', file));
//     }

//     try {
//       await api.post('/announcement', formData);
//       setSuccess('Announcement created successfully');
//       setTitle('');
//       setDescription('');
//       setAttachments([]);
//       setClubId(''); 
//       if (onCreated) onCreated();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error creating announcement');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const removeAttachment = (index) => {
//     const newAttachments = [...attachments];
//     newAttachments.splice(index, 1);
//     setAttachments(newAttachments);
//   };

//   const renderAttachmentPreviews = () => {
//     if (attachments.length === 0) return null;
    
//     return (
//       <div className="mt-4 space-y-2">
//         <p className="text-sm font-medium text-gray-700">Selected files:</p>
//         <div className="flex flex-wrap gap-2">
//           {Array.from(attachments).map((file, index) => (
//             <div key={index} className="relative group flex items-center bg-gray-50 rounded-md p-2 pr-8">
//               <span className="text-sm truncate max-w-xs">{file.name}</span>
//               <button
//                 type="button"
//                 onClick={() => removeAttachment(index)}
//                 className="absolute right-1 text-gray-400 hover:text-red-500"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
//       <div className="flex items-center mb-6">
//         <Megaphone className="w-6 h-6 mr-3 text-blue-600" />
//         <h2 className="text-2xl font-semibold text-gray-800">Create New Announcement</h2>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center">
//           <Check className="w-5 h-5 mr-2" />
//           {success}
//         </div>
//       )}

     

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//             Title *
//           </label>
//           <input 
//             id="title"
//             type="text" 
//             value={title} 
//             onChange={(e) => setTitle(e.target.value)} 
//             placeholder="Enter announcement title" 
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
//             required 
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//             Description *
//           </label>
//           <textarea 
//             id="description"
//             value={description} 
//             onChange={(e) => setDescription(e.target.value)} 
//             placeholder="Enter announcement details" 
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-32" 
//             required 
//           />
//         </div>

//         <div>
//           <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-1">
//             Select Club *
//           </label>
//           <select
//             id="clubId"
//             value={clubId}
//             onChange={(e) => setClubId(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             required
//           >
//             <option value="">-- Select a club --</option>
//             {clubs.map((club) => (
//               <option key={club._id} value={club._id}>
//                 {club.name}
//               </option>
//             ))}
//           </select>
//           {clubs.length === 0 && (
//             <p className="mt-1 text-sm text-red-500">
//               No clubs available. Please try refreshing the page.
//             </p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
//             Attachments (Optional)
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
//             <div className="space-y-1 text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="flex text-sm text-gray-600">
//                 <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     name="attachments"
//                     type="file"
//                     multiple
//                     accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
//                     className="sr-only"
//                     onChange={(e) => setAttachments([...e.target.files])}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 PNG, JPG, PDF up to 10MB
//               </p>
//             </div>
//           </div>
//           {renderAttachmentPreviews()}
//         </div>

//         <div className="flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={() => {
//               setTitle('');
//               setDescription('');
//               setAttachments([]);
//               setClubId('');
//             }}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
//               isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Creating...
//               </>
//             ) : (
//               'Create Announcement'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateAnnouncement;


import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { 
  Megaphone, 
  Upload, 
  X, 
  Check,
  Calendar
} from 'lucide-react';

const CreateAnnouncement = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState([]);
  const [visibleUntil, setVisibleUntil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchClubs();
  }, [user]);

  const fetchClubs = async () => {
    try {
      console.log('Fetching clubs...');
      const response = await api.get('/club');
      console.log('API response:', response);
      
      if (response.data && response.data) {
        console.log('Clubs data:', response.data);
        setClubs(response.data);
      } else {
        console.error('Unexpected API response structure:', response);
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!clubId) {
      setError('Please select a club');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('clubId', clubId);
    
    // Add visibleUntil date if provided
    if (visibleUntil) {
      formData.append('visibleUntil', visibleUntil);
    }
    
    if (attachments.length > 0) {
      attachments.forEach(file => formData.append('attachments', file));
    }

    try {
      await api.post('/announcement', formData);
      setSuccess('Announcement created successfully');
      setTitle('');
      setDescription('');
      setAttachments([]);
      setClubId('');
      setVisibleUntil('');
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const renderAttachmentPreviews = () => {
    if (attachments.length === 0) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">Selected files:</p>
        <div className="flex flex-wrap gap-2">
          {Array.from(attachments).map((file, index) => (
            <div key={index} className="relative group flex items-center bg-gray-50 rounded-md p-2 pr-8">
              <span className="text-sm truncate max-w-xs">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute right-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate minimum date for the date picker (today)
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <Megaphone className="w-6 h-6 mr-3 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Create New Announcement</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center">
          <Check className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input 
            id="title"
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter announcement title" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            required 
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea 
            id="description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter announcement details" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-32" 
            required 
          />
        </div>

        <div>
          <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Club *
          </label>
          <select
            id="clubId"
            value={clubId}
            onChange={(e) => setClubId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Select a club --</option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
          {clubs.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              No clubs available. Please try refreshing the page.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="visibleUntil" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Visible Until (Optional)
          </label>
          <div className="relative">
            <input
              id="visibleUntil"
              type="date"
              value={visibleUntil}
              min={getTodayString()}
              onChange={(e) => setVisibleUntil(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            If set, the announcement will automatically be hidden after this date.
          </p>
        </div>

        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="attachments"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => setAttachments([...e.target.files])}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>
          {renderAttachmentPreviews()}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setDescription('');
              setAttachments([]);
              setClubId('');
              setVisibleUntil('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Announcement'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;