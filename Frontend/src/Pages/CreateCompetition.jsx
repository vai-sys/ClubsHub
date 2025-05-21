import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Save, Plus, Trash, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateCompetition() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    description: '',
    teamAllowed: false,
    teamSizeLimit: 1,
    evaluationCriteria: '',
    prizes: [],
    rounds: [{
      name: 'Round 1',
      description: '',
      date: '',
      duration: 60,
      isLive: false
    }],
    judges: [],
    rules: [],
 
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/event/${id}`);
        console.log("response", response);
        setEventDetails(response.data.data);
        
        if (response.data.data.eventType !== 'COMPETITION') {
          setError('This event is not marked as a competition.');
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        setError('Failed to load event details');
      }
    };

    if (id) {
      fetchEventDetails();
    } else {
      setError('Event ID is missing. Please create an event first.');
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePrizeChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedPrizes = [...prev.prizes];
      updatedPrizes[index] = {
        ...updatedPrizes[index],
        [name]: value
      };
      return {
        ...prev,
        prizes: updatedPrizes
      };
    });
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [
        ...prev.prizes, 
        { position: prev.prizes.length + 1, reward: '' }
      ]
    }));
  };

  const removePrize = (index) => {
    setFormData(prev => {
      const updatedPrizes = [...prev.prizes];
      updatedPrizes.splice(index, 1);
      
      return {
        ...prev,
        prizes: updatedPrizes.map((prize, i) => ({
          ...prize,
          position: i + 1
        }))
      };
    });
  };

  const handleJudgeChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedJudges = [...prev.judges];
      updatedJudges[index] = {
        ...updatedJudges[index],
        [name]: value
      };
      return {
        ...prev,
        judges: updatedJudges
      };
    });
  };

  const addJudge = () => {
    setFormData(prev => ({
      ...prev,
      judges: [
        ...prev.judges,
        { name: '', profile: '', userId: '' }
      ]
    }));
  };

  const removeJudge = (index) => {
    setFormData(prev => {
      const updatedJudges = [...prev.judges];
      updatedJudges.splice(index, 1);
      return {
        ...prev,
        judges: updatedJudges
      };
    });
  };

  const handleRoundChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updatedRounds = [...prev.rounds];
      updatedRounds[index] = {
        ...updatedRounds[index],
        [name]: type === 'checkbox' ? checked : value
      };
      return {
        ...prev,
        rounds: updatedRounds
      };
    });
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [
        ...prev.rounds,
        {
          name: `Round ${prev.rounds.length + 1}`,
          description: '',
          date: '',
          duration: 60,
          isLive: false
        }
      ]
    }));
  };

  const removeRound = (index) => {
    if (formData.rounds.length === 1) {
      setError('At least one round is required');
      return;
    }
    
    setFormData(prev => {
      const updatedRounds = [...prev.rounds];
      updatedRounds.splice(index, 1);
      
      // Rename rounds to maintain sequential naming
      return {
        ...prev,
        rounds: updatedRounds.map((round, i) => ({
          ...round,
          name: `Round ${i + 1}`
        }))
      };
    });
  };

  const handleRuleChange = (index, e) => {
    const { value } = e.target;
    setFormData(prev => {
      const updatedRules = [...prev.rules];
      updatedRules[index] = value;
      return {
        ...prev,
        rules: updatedRules
      };
    });
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const removeRule = (index) => {
    setFormData(prev => {
      const updatedRules = [...prev.rules];
      updatedRules.splice(index, 1);
      return {
        ...prev,
        rules: updatedRules
      };
    });
  };

  const validateForm = () => {
    const validationErrors = [];
    
    if (formData.teamAllowed && (!formData.teamSizeLimit || formData.teamSizeLimit < 2)) {
      validationErrors.push('Team size must be at least 2 for team competitions');
    }

   
    
    if (!formData.description.trim()) {
      validationErrors.push('Description is required');
    }
    
    if (!formData.evaluationCriteria.trim()) {
      validationErrors.push('Evaluation criteria is required');
    }

    // Validate rounds
    for (let i = 0; i < formData.rounds.length; i++) {
      const round = formData.rounds[i];
      if (!round.name || !round.description || !round.date || !round.duration) {
        validationErrors.push(`All fields for ${round.name || 'a round'} are required`);
        break; // Break after first error to avoid overwhelming the user
      }
    }

    // Validate prizes
    if (formData.prizes.length === 0) {
      validationErrors.push('At least one prize is required');
    } else {
      for (let i = 0; i < formData.prizes.length; i++) {
        const prize = formData.prizes[i];
        if (!prize.position || !prize.reward) {
          validationErrors.push(`All fields for prize #${i + 1} are required`);
          break; 
        }
      }
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return false;
    }

    return true;
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
      const competitionData = {
        event: id, 
        ...formData
      };
 console.log("payload",competitionData)
      const response = await api.post('/competition', competitionData);
     
      setSuccess('Competition created successfully!');
      navigate(`/competition/${response.data.data._id}`);
    } catch (error) {
      console.error('Competition creation failed:', error);
      setError(error.response?.data?.message || 'Failed to create competition');
    } finally {
      setLoading(false);
    }
  };

  if (!eventDetails && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Create Competition</h1>
      <p className="text-gray-600 mb-8">
        Configure the competition settings for{' '}
        <span className="font-semibold">{eventDetails?.name || 'your event'}</span>
      </p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <p>{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Competition Details */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Competition Details</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Provide detailed information about the competition"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="teamAllowed"
                    name="teamAllowed"
                    checked={formData.teamAllowed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="teamAllowed" className="text-sm font-medium text-gray-700">
                    Allow Team Participation
                  </label>
                </div>
              </div>

              {formData.teamAllowed && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Team Size*
                  </label>
                  <input
                    type="number"
                    name="teamSizeLimit"
                    value={formData.teamSizeLimit}
                    onChange={handleInputChange}
                    min="2"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* <div className="space-y-2">
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
            </div> */}
          </div>
        </section>

        {/* Prizes Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Prizes*</h2>
            <button
              type="button"
              onClick={addPrize}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Prize
            </button>
          </div>
          
          {formData.prizes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Click "Add Prize" to define prizes for the competition
            </div>
          ) : (
            <div className="space-y-4">
              {formData.prizes.map((prize, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Prize #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removePrize(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Position
                      </label>
                      <input
                        type="number"
                        name="position"
                        value={prize.position}
                        onChange={(e) => handlePrizeChange(index, e)}
                        min="1"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Reward
                      </label>
                      <input
                        type="text"
                        name="reward"
                        value={prize.reward}
                        onChange={(e) => handlePrizeChange(index, e)}
                        placeholder="e.g., ₹10,000 or Trophy"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Evaluation Criteria Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Evaluation Criteria*</h2>
          
          <div className="space-y-2">
            <textarea
              name="evaluationCriteria"
              value={formData.evaluationCriteria}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              rows="6"
              placeholder="Describe how submissions will be judged and what criteria will be used."
              required
            />
          </div>
        </section>

        {/* Rules Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Competition Rules</h2>
            <button
              type="button"
              onClick={addRule}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Rule
            </button>
          </div>
          
          {formData.rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Click "Add Rule" to define competition rules
            </div>
          ) : (
            <div className="space-y-4">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e)}
                    placeholder={`Rule #${index + 1}`}
                    className="flex-grow px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Judges Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Judges</h2>
            <button
              type="button"
              onClick={addJudge}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Judge
            </button>
          </div>
          
          {formData.judges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Click "Add Judge" to add competition judges
            </div>
          ) : (
            <div className="space-y-4">
              {formData.judges.map((judge, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Judge #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeJudge(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={judge.name}
                        onChange={(e) => handleJudgeChange(index, e)}
                        placeholder="Judge's full name"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Profile
                      </label>
                      <input
                        type="text"
                        name="profile"
                        value={judge.profile}
                        onChange={(e) => handleJudgeChange(index, e)}
                        placeholder="e.g., Professor, Industry Expert"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        User ID (if registered)
                      </label>
                      <input
                        type="text"
                        name="userId"
                        value={judge.userId}
                        onChange={(e) => handleJudgeChange(index, e)}
                        placeholder="User ID (optional)"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rounds Section */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Competition Rounds*</h2>
            <button
              type="button"
              onClick={addRound}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Round
            </button>
          </div>
          
          <div className="space-y-6">
            {formData.rounds.map((round, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-medium">{round.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeRound(index)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      disabled={formData.rounds.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Date & Time*
                      </label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={round.date}
                        onChange={(e) => handleRoundChange(index, e)}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Duration (minutes)*
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={round.duration}
                        onChange={(e) => handleRoundChange(index, e)}
                        min="1"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`isLive-${index}`}
                      name="isLive"
                      checked={round.isLive}
                      onChange={(e) => handleRoundChange(index, e)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`isLive-${index}`} className="text-sm text-gray-700">
                      Set as active round immediately after creation
                    </label>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Round Description*
                    </label>
                    <textarea
                      name="description"
                      value={round.description}
                      onChange={(e) => handleRoundChange(index, e)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Explain what participants should do in this round"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(`/event/${id}`)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            Cancel
          </button>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  description: '',
                  teamAllowed: false,
                  teamSizeLimit: 1,
                  evaluationCriteria: '',
                  prizes: [],
                  rounds: [{
                    name: 'Round 1',
                    description: '',
                    date: '',
                    duration: 60,
                    isLive: false
                  }],
                  judges: [],
                  rules: [],
                  registrationDeadline: ''
                });
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
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 text-white border-t-2 border-b-2 border-white rounded-full"></div>
                  Creating Competition...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Competition
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}