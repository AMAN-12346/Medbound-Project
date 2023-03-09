import Gallerymodel from "../../../models/gallery";

const GalleryServices = {
  createGellary: async (instaintObj) => {
    return await Gallerymodel.create(instaintObj);
  },

  UpdateGallery: async (query, instaintObj) => {
    return await Gallerymodel.findByIdAndUpdate(query, instaintObj, {
      new: true,
    });
  },

  findGallery: async (query) => {
    return await Gallerymodel.findOne(query);
  },
};

module.exports = { GalleryServices };
