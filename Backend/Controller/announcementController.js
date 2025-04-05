const Announcement=require("../models/Anouncement")
exports.createAnnouncement = async (req, res) => {
   try {
       const { title, description, createdBy, createdByRole, allowedRolesToView } = req.body;

       
       if (!title || !description || !createdBy || !createdByRole || !allowedRolesToView) {
           return res.status(400).json({ success: false, message: "Please add all the necessary fields" });
       }

       const newAnnouncement = new Announcement(req.body);
       await newAnnouncement.save();

       res.status(201).json({ success: true, message: 'Announcement created successfully', announcement: newAnnouncement });
   } catch (error) {
       res.status(500).json({ success: false, message: 'Error creating announcement', error: error.message });
   }
};

exports.GetAllAnnouncements = async (req, res) => {
   try {
     const { status, priority, clubId } = req.query;
     let filter = {};
 
     if (status) filter.status = status;
     if (priority) filter.priority = priority;
     if (clubId) filter.clubId = clubId;
 
     const allAnnouncements = await Announcement.find(filter).sort({ createdAt: -1 });
 
     return res.status(200).json({ success: true, announcements: allAnnouncements });
 
   } catch (err) {
     console.error("Error fetching announcements:", err.message);
     return res.status(500).json({ success: false, message: "Internal server error" });
   }
 };


 exports.getAnnouncementById = async (req, res) => {
   try {
     const { id } = req.params;
 
     
     const announcement = await Announcement.findById(id);
 
     if (!announcement) {
       return res.status(404).json({ success: false, message: "Announcement not found" });
     }
 
     return res.status(200).json({ success: true, announcement });
 
   } catch (error) {
     console.error("Error fetching announcement:", error.message);
     return res.status(500).json({ success: false, message: "Internal server error" });
   }
 };


 exports.updateAnnouncement = async (req, res) => {
   try {
       const updatedAnnouncement = await Announcement.findByIdAndUpdate(
           req.params.id,
           { ...req.body, updatedAt: Date.now() },
           { new: true, runValidators: true }
       );

       if (!updatedAnnouncement) {
           return res.status(404).json({ success: false, message: 'Announcement not found' });
       }

       res.status(200).json({ success: true, message: 'Announcement updated successfully', announcement: updatedAnnouncement });
   } catch (error) {
       res.status(500).json({ success: false, message: 'Error updating announcement', error: error.message });
   }
};

exports.deleteAnnouncement = async (req, res) => {
   try {
       const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

       if (!deletedAnnouncement) {
           return res.status(404).json({ success: false, message: 'Announcement not found' });
       }

       res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
   } catch (error) {
       res.status(500).json({ success: false, message: 'Error deleting announcement', error: error.message });
   }
};