import React from 'react';
import UserClubAffiliations from "../components/myactivity/UserClubAffiliations";
import UserEvents from "../components/myactivity/UserEvents";

const Myactivity = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Activity</h1>
          <p className="text-gray-600">View your registered events and club affiliations</p>
        </div>
        
       
        <div className="mb-8">
          <UserEvents />
        </div>
        
      
        <div>
          <UserClubAffiliations />
        </div>
      </div>
    </div>
  );
};

export default Myactivity;