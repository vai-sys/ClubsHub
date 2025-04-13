const handleError = (res, error, message) => {
    console.error(`${message}:`, error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: Object.values(error.errors).map(err => err.message)
        });
    }
    
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    
    return res.status(500).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
};

const validateEventInput = (eventDetails) => {
    const errors = [];
    
    if (!eventDetails.name?.trim()) {
        errors.push('Event name is required');
    }
    
    if (!eventDetails.date || isNaN(new Date(eventDetails.date).getTime())) {
        errors.push('Valid event date is required');
    }
    
    if (!eventDetails.clubId) {
        errors.push('Club ID is required');
    }
    
    if (!eventDetails.description?.trim()) {
        errors.push('Event description is required');
    }
    
    if (!eventDetails.venue?.trim()) {
        errors.push('Event venue is required');
    }
    
    return errors;
};

const validateFileUpload = (file, allowedTypes, maxSize) => {
    if (!file) return null;
    
    if (!allowedTypes.includes(file.mimetype)) {
        return 'Invalid file type';
    }
    
    if (file.size > maxSize) {
        return 'File size too large';
    }
    
    return null;
};

module.exports = {
    handleError,
    validateEventInput,
    validateFileUpload
}; 