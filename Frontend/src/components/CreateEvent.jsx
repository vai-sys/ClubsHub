// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import api from '../api'

// const EVENT_TYPES = ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'MEETUP', 'CULTURAL', 'TECHNICAL', 'OTHER'];
// const EVENT_MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];

// export default function CreateEvent() {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     clubId: '',
//     date: '',
//     time: '',
//     duration: '',
//     venue: '',
//     tags: [],
//     fees: 0,
//     maxParticipants: '',
//     registrationDeadline: '',
//     platformLink: '',
//     eventType: '',
//     mode: '',
//     departmentsAllowed: [],
//     eventBanner: null,
//     attachments: []
//   });

//   const [clubs, setClubs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [departments] = useState([
//     'Computer Science',
//     'Electronics',
//     'Mechanical',
//     'Civil',
//     'Electrical',
//     'Information Technology'
//   ]);

 
//   useEffect(() => {
//     const fetchClubs = async () => {
//       try {
     
//         const response = await api.get('/club');
//         setClubs(response.data);
//       } catch (error) {
//         console.error('Failed to fetch clubs:', error);
//         setError('Failed to load clubs');
//       }
//     };

//     fetchClubs();
//   }, []);

//   const validateForm = () => {
//     const validationErrors = [];
    
//     const eventDate = new Date(formData.date + ' ' + formData.time);
//     const deadline = new Date(formData.registrationDeadline);
    
//     if (deadline >= eventDate) {
//       validationErrors.push('Registration deadline must be before event date');
//     }

//     if (parseInt(formData.maxParticipants) <= 0) {
//       validationErrors.push('Maximum participants must be greater than 0');
//     }

//     if (parseInt(formData.duration) <= 0) {
//       validationErrors.push('Duration must be greater than 0');
//     }

//     if (formData.departmentsAllowed.length === 0) {
//       validationErrors.push('At least one department must be selected');
//     }

//     if (validationErrors.length > 0) {
//       setError(validationErrors.join(', '));
//       return false;
//     }

//     return true;
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === 'file') {
//       if (name === 'eventBanner') {
//         setFormData(prev => ({
//           ...prev,
//           eventBanner: files[0]
//         }));
//       } else if (name === 'attachments') {
//         setFormData(prev => ({
//           ...prev,
//           attachments: Array.from(files)
//         }));
//       }
//     } else if (name === 'tags') {
//       setFormData(prev => ({
//         ...prev,
//         tags: value.split(',').map(tag => tag.trim())
//       }));
//     } else if (name === 'departmentsAllowed') {
//       const options = e.target.options;
//       const selectedDepts = [];
//       for (let i = 0; i < options.length; i++) {
//         if (options[i].selected) {
//           selectedDepts.push(options[i].value);
//         }
//       }
//       setFormData(prev => ({
//         ...prev,
//         departmentsAllowed: selectedDepts
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const formPayload = new FormData();
      
     
//       const eventDateTime = new Date(`${formData.date} ${formData.time}`);
      
  
//       Object.keys(formData).forEach(key => {
//         if (key === 'date' || key === 'time') {
//           return; 
//         }
        
//         if (key === 'tags' || key === 'departmentsAllowed') {
//           formPayload.append(key, JSON.stringify(formData[key]));
//         } else if (key === 'eventBanner') {
//           if (formData.eventBanner) {
//             formPayload.append('eventBanner', formData.eventBanner);
//           }
//         } else if (key === 'attachments') {
//           formData.attachments.forEach(file => {
//             formPayload.append('attachments', file);
//           });
//         } else {
//           formPayload.append(key, formData[key]);
//         }
//       });

    
//       formPayload.append('date', eventDateTime.toISOString());

     
//       const response = await api.post('/event', formPayload);
//       console.log(response);

//       setSuccess('Event created successfully and pending approval!');
      
  
//       setFormData({
//         name: '',
//         description: '',
//         clubId: '',
//         date: '',
//         time: '',
//         duration: '',
//         venue: '',
//         tags: [],
//         fees: 0,
//         maxParticipants: '',
//         registrationDeadline: '',
//         platformLink: '',
//         eventType: '',
//         mode: '',
//         departmentsAllowed: [],
//         eventBanner: null,
//         attachments: []
//       });

//     } catch (error) {
//       console.error('Event creation failed:', error);
//       setError(error.response?.data?.message || 'Failed to create event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Club
//             </label>
//             <select
//               name="clubId"
//               value={formData.clubId}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select Club</option>
//               {clubs.map(club => (
//                 <option key={club._id} value={club._id}>
//                   {club.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               rows="4"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Date
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Time
//             </label>
//             <input
//               type="time"
//               name="time"
//               value={formData.time}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Duration (minutes)
//             </label>
//             <input
//               type="number"
//               name="duration"
//               value={formData.duration}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Venue
//             </label>
//             <input
//               type="text"
//               name="venue"
//               value={formData.venue}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Type
//             </label>
//             <select
//               name="eventType"
//               value={formData.eventType}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select Event Type</option>
//               {EVENT_TYPES.map(type => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Mode
//             </label>
//             <select
//               name="mode"
//               value={formData.mode}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select Mode</option>
//               {EVENT_MODES.map(mode => (
//                 <option key={mode} value={mode}>
//                   {mode}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Maximum Participants
//             </label>
//             <input
//               type="number"
//               name="maxParticipants"
//               value={formData.maxParticipants}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Registration Deadline
//             </label>
//             <input
//               type="datetime-local"
//               name="registrationDeadline"
//               value={formData.registrationDeadline}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Platform Link
//             </label>
//             <input
//               type="url"
//               name="platformLink"
//               value={formData.platformLink}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Fees (₹)
//             </label>
//             <input
//               type="number"
//               name="fees"
//               value={formData.fees}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Tags (comma-separated)
//             </label>
//             <input
//               type="text"
//               name="tags"
//               value={formData.tags.join(', ')}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               placeholder="e.g., technology, coding, workshop"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Departments Allowed
//             </label>
//             <select
//               name="departmentsAllowed"
//               multiple
//               value={formData.departmentsAllowed}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             >
//               {departments.map(dept => (
//                 <option key={dept} value={dept}>
//                   {dept}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Banner
//             </label>
//             <input
//               type="file"
//               name="eventBanner"
//               onChange={handleInputChange}
//               accept="image/*"
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Attachments
//             </label>
//             <input
//               type="file"
//               name="attachments"
//               onChange={handleInputChange}
//               multiple
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//             />
        
//           </div>
//         </div>

//         <div className="flex gap-4 mt-6">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {loading ? 'Creating Event...' : 'Create Event'}
//           </button>
          
//           <button
//             type="button"
//             onClick={() => {
//               setFormData({
//                 name: '',
//                 description: '',
//                 clubId: '',
//                 date: '',
//                 time: '',
//                 duration: '',
//                 venue: '',
//                 tags: [],
//                 fees: 0,
//                 maxParticipants: '',
//                 registrationDeadline: '',
//                 platformLink: '',
//                 eventType: '',
//                 mode: '',
//                 departmentsAllowed: [],
//                 eventBanner: null,
//                 attachments: []
//               });
//               setError('');
//               setSuccess('');
//             }}
//             className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//           >
//             Reset
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Upload, ChevronLeft, ChevronRight, Save, RefreshCw } from 'lucide-react';

// Constants
const EVENT_TYPES = ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'MEETUP', 'CULTURAL', 'TECHNICAL', 'OTHER'];
const EVENT_MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clubId: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    tags: [],
    fees: 0,
    maxParticipants: '',
    registrationDeadline: '',
    platformLink: '',
    eventType: '',
    mode: '',
    departmentsAllowed: [],
    eventBanner: null,
    attachments: []
  });

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments] = useState([
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology'
  ]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get('/club');
        setClubs(response.data);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
        setError('Failed to load clubs');
      }
    };

    fetchClubs();
  }, []);

  const validateForm = () => {
    const validationErrors = [];
    
    if (formData.date && formData.time && formData.registrationDeadline) {
      const eventDate = new Date(`${formData.date} ${formData.time}`);
      const deadline = new Date(formData.registrationDeadline);
      
      if (deadline >= eventDate) {
        validationErrors.push('Registration deadline must be before event date');
      }
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) <= 0) {
      validationErrors.push('Maximum participants must be greater than 0');
    }

    if (formData.duration && parseInt(formData.duration) <= 0) {
      validationErrors.push('Duration must be greater than 0');
    }

    if (formData.departmentsAllowed.length === 0) {
      validationErrors.push('At least one department must be selected');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (name === 'eventBanner') {
        setFormData(prev => ({
          ...prev,
          eventBanner: files[0]
        }));
      } else if (name === 'attachments') {
        setFormData(prev => ({
          ...prev,
          attachments: Array.from(files)
        }));
      }
    } else if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      }));
    } else if (name === 'departmentsAllowed') {
      const options = e.target.options;
      const selectedDepts = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedDepts.push(options[i].value);
        }
      }
      setFormData(prev => ({
        ...prev,
        departmentsAllowed: selectedDepts
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formPayload = new FormData();
      
      // Combine date and time for the event
      const eventDateTime = new Date(`${formData.date} ${formData.time}`);
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'date' || key === 'time') {
          return; // Skip these as we'll add the combined date
        }
        
        if (key === 'tags' || key === 'departmentsAllowed') {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else if (key === 'eventBanner') {
          if (formData.eventBanner) {
            formPayload.append('eventBanner', formData.eventBanner);
          }
        } else if (key === 'attachments') {
          formData.attachments.forEach(file => {
            formPayload.append('attachments', file);
          });
        } else {
          formPayload.append(key, formData[key]);
        }
      });

     
      formPayload.append('date', eventDateTime.toISOString());

      const response = await api.post('/event', formPayload);
      console.log( "res",response.data);

      setSuccess('Event created successfully and pending approval!');
      
      
      if (formData.eventType === 'COMPETITION' && response.data && response.data.data?._id) {
  navigate(`/competition/${response.data.data._id}`);
  return;
}

      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        clubId: '',
        date: '',
        time: '',
        duration: '',
        venue: '',
        tags: [],
        fees: 0,
        maxParticipants: '',
        registrationDeadline: '',
        platformLink: '',
        eventType: '',
        mode: '',
        departmentsAllowed: [],
        eventBanner: null,
        attachments: []
      });
      setActiveStep(1);

    } catch (error) {
      console.error('Event creation failed:', error);
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div className={`text-sm font-medium ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Basic Info</div>
          <div className={`text-sm font-medium ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Event Details</div>
          <div className={`text-sm font-medium ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Media & Finalize</div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            style={{ width: `${(activeStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderStepOne = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Organizing Club*
            </label>
            <select
              name="clubId"
              value={formData.clubId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Club</option>
              {clubs.map(club => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              rows="5"
              placeholder="Describe your event in detail"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Type*
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Event Type</option>
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {formData.eventType === 'COMPETITION' && (
              <p className="text-sm text-blue-600 mt-1">
                Competition events will redirect to a dedicated competition page.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Mode*
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Mode</option>
              {EVENT_MODES.map(mode => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleNextStep}
            disabled={!formData.name || !formData.clubId || !formData.description || !formData.eventType || !formData.mode}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center"
          >
            Next Step
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Date*
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Time*
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)*
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 120"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Venue*
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="Location or platform name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {formData.mode !== 'OFFLINE' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Platform Link
              </label>
              <input
                type="url"
                name="platformLink"
                value={formData.platformLink}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Maximum Participants*
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Registration Deadline*
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Registration Fees (₹)
            </label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleInputChange}
              placeholder="0 for free events"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextStep}
            disabled={!formData.date || !formData.time || !formData.duration || !formData.venue || !formData.maxParticipants || !formData.registrationDeadline}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center"
          >
            Next Step
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderStepThree = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleInputChange}
              placeholder="e.g., technology, coding, workshop"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">Add relevant tags to help participants find your event</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Departments Allowed*
            </label>
            <div className="relative">
              <select
                name="departmentsAllowed"
                multiple
                value={formData.departmentsAllowed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
                size={4}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple departments</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Banner
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-7">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {formData.eventBanner ? formData.eventBanner.name : "Upload banner image"}
                  </p>
                </div>
                <input 
                  type="file" 
                  name="eventBanner" 
                  onChange={handleInputChange}
                  accept="image/*" 
                  className="opacity-0" 
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-7">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {formData.attachments.length > 0 
                      ? `${formData.attachments.length} file(s) selected` 
                      : "Upload additional files"}
                  </p>
                </div>
                <input 
                  type="file" 
                  name="attachments" 
                  onChange={handleInputChange}
                  multiple 
                  className="opacity-0" 
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Event Name</p>
              <p className="font-medium">{formData.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Event Type</p>
              <p className="font-medium">{formData.eventType || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date & Time</p>
              <p className="font-medium">
                {formData.date && formData.time 
                  ? new Date(`${formData.date} ${formData.time}`).toLocaleString() 
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Venue</p>
              <p className="font-medium">{formData.venue || '-'}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  clubId: '',
                  date: '',
                  time: '',
                  duration: '',
                  venue: '',
                  tags: [],
                  fees: 0,
                  maxParticipants: '',
                  registrationDeadline: '',
                  platformLink: '',
                  eventType: '',
                  mode: '',
                  departmentsAllowed: [],
                  eventBanner: null,
                  attachments: []
                });
                setActiveStep(1);
                setError('');
                setSuccess('');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={loading || formData.departmentsAllowed.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Create New Event</h1>
      <p className="text-gray-600 mb-8">Fill out the form below to create and publish your event</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>{success}</p>
          </div>
        </div>
      )}

      {renderProgressBar()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {activeStep === 1 && renderStepOne()}
        {activeStep === 2 && renderStepTwo()}
        {activeStep === 3 && renderStepThree()}
      </form>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
