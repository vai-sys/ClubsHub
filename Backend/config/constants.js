const UserRoles = {
  MEMBER: 'member',
  CLUB_ADMIN: 'clubAdmin',
  FACULTY_COORDINATOR: 'facultyCoordinator',
  SUPER_ADMIN: 'superAdmin',
};

  
  module.exports = {
    UserRoles,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: '1h'
  };