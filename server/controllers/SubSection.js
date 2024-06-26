const SubSection = require("../models/SubSection.js");
const Section = require("../models/Section.js");
const { uploadVideoToCloudinary } = require("../utils/videoUploader");
const { findById } = require("../models/Course.js");

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;

    const video = req.files.video;
    console.log(video);
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "data is missing in creating subsection",
      });
    }

    const uploadVideoUrl = await uploadVideoToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("here1 subsection");
    const subSectionDetails = await SubSection.create({
      title,
      description,
      timeduration: `${uploadVideoUrl?.duration}`,
      videourl: uploadVideoUrl.secure_url,
    });
    const updateSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subsections: subSectionDetails._id,
        },
      },
      {
        new: true,
      }
    ).populate("subsections");

    console.log("here2 subsection");
    return res.status(202).json({
      success: true,
      message: "successfully create subsection",
      updateSection,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "unable to  create subsection",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    console.log("update subsection");
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    console.log("here");
    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    console.log("here1");
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadVideoUrl = await uploadVideoToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videourl = uploadVideoUrl.secure_url;
      subSection.timeduration = `${uploadVideoUrl.duration}`;
    }
    console.log("here2");
    await subSection.save();
    const updateSection = await Section.findById(sectionId)
      .populate("subsections")
      .exec();
    console.log("here3");
    return res.status(202).json({
      success: true,
      message: "update Subsection",
      data: updateSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: "unable to update Subsection",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId) {
      return res.status(404).json({
        success: false,
        message: "missing fileld in delete subsection",
      });
    }
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subsections: subSectionId,
        },
      },
      {
        new: true,
      }
    );

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    const updatedSection = await Section.findById(sectionId).populate(
      "subsections"
    );

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
