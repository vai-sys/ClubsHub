const Announcement = require("../models/Anouncement");
const { UserRoles } = require("../config/constants");
const uploadAttachments = require("../middleware/uploadAttachments");


exports.createAnnouncement = async (req, res) => {
  try {

    const { title, description, clubId } = req.body;
    
  
    const createdBy = req.user.id;
    const createdByRole = req.user.role;
    
   
    if (!title || !description || !clubId) {
      return res.status(400).json({
        success: false,
        message: "Please add all the necessary fields, including clubId",
      });
    }
    
  
    let allowedRolesToView = [];
    
    if (createdByRole === UserRoles.CLUB_ADMIN) {
      allowedRolesToView = [
        UserRoles.MEMBER,
        UserRoles.FACULTY_COORDINATOR,
        UserRoles.CLUB_ADMIN,
        UserRoles.SUPER_ADMIN,
      ];
    } else if (createdByRole === UserRoles.SUPER_ADMIN) {
      allowedRolesToView = [
        UserRoles.CLUB_ADMIN,
        UserRoles.FACULTY_COORDINATOR,
        UserRoles.SUPER_ADMIN,
      ];
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create announcements",
      });
    }
    
  
    const uploadedAttachments = req.files?.map(file => file.path) || [];
    
 
    const newAnnouncement = new Announcement({
      title,
      description,
      clubId: clubId, 
      createdBy,
      createdByRole,
      allowedRolesToView,
      attachments: uploadedAttachments
    });
    
  
    await newAnnouncement.save();
    
    
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    
   
    res.status(500).json({
      success: false,
      message: "Error creating announcement",
      error: error.message,
    });
  }
};



exports.getAllAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;
    const { status, priority, clubId } = req.query;

    let filter = {
      allowedRolesToView: { $in: [userRole] },
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (clubId) filter.clubId = clubId;

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (err) {
    console.error("Error fetching announcements:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    if (!announcement.allowedRolesToView.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this announcement",
      });
    }

    res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // if (announcement.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to update this announcement",
    //   });
    // }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating announcement",
      error: error.message,
    });
  }
};


exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // if (announcement.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to delete this announcement",
    //   });
    // }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting announcement",
      error: error.message,
    });
  }
};

exports.getAnnouncementsByClubId = async (req, res) => {
  try {
    const { clubId } = req.params;

    const announcements = await Announcement.find({ clubId })
      .where('isActive')
      .equals(true)
      .sort({ visibleFrom: -1 })
      .populate('createdBy', 'name email'); 

   
    return res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Error fetching club announcements:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch announcements' 
    });
  }
};

