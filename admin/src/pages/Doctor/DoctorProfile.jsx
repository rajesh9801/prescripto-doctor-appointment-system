import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, updateProfileData } =
    useContext(DoctorContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    speciality: "",
    degree: "",
    experience: "",
    address: { line1: "", city: "", state: "", pincode: "" },
    available: true,
    fees: "",
    about: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  useEffect(() => {
    if (profileData) setFormData(profileData);
  }, [profileData]);

  // ✅ Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle address object fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // ✅ Handle boolean toggle
  const handleAvailableToggle = () => {
    setFormData((prev) => ({ ...prev, available: !prev.available }));
  };

  // ✅ Handle Cloudinary image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "doctor_profile_upload");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        data
      );
      setFormData((prev) => ({ ...prev, image: res.data.secure_url }));
      toast.success("Profile image updated");
    } catch (error) {
      toast.error("Image upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Save updates
  const handleSave = () => {
    updateProfileData({
      fees: formData.fees,
      address: formData.address,
      available: formData.available,
      about: formData.about,
      image: formData.image,
    });
    setIsEditing(false);
  };

  if (!profileData)
    return (
      <div className="text-center text-gray-500 py-20">
        Loading profile data...
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {formData.image ? (
            <img
              src={formData.image}
              alt="Doctor"
              className="w-20 h-20 rounded-full border object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Dr. {formData.name}
            </h2>
            <p className="text-gray-500">{formData.speciality}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            isEditing
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Image upload */}
      {isEditing && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Profile Image
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
          {uploading && (
            <p className="text-xs text-blue-600 mt-1">Uploading...</p>
          )}
        </div>
      )}

      {/* Fees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Consultation Fee
          </label>
          <input
            type="number"
            name="fees"
            value={formData.fees || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg p-2 mt-1 ${
              isEditing
                ? "border-gray-300 focus:ring focus:ring-blue-100 focus:border-blue-400"
                : "border-gray-200 bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Available toggle */}
        <div className="flex items-center gap-3 mt-6">
          <label className="text-sm font-medium text-gray-700">Available:</label>
          <input
            type="checkbox"
            checked={formData.available}
            onChange={handleAvailableToggle}
            disabled={!isEditing}
            className="w-5 h-5 accent-blue-600"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <input
            type="text"
            name="line1"
            value={formData.address.line1 || ""}
            onChange={handleAddressChange}
            disabled={!isEditing}
            placeholder="Address Line 1"
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="city"
            value={formData.address.city || ""}
            onChange={handleAddressChange}
            disabled={!isEditing}
            placeholder="City"
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="state"
            value={formData.address.state || ""}
            onChange={handleAddressChange}
            disabled={!isEditing}
            placeholder="State"
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="pincode"
            value={formData.address.pincode || ""}
            onChange={handleAddressChange}
            disabled={!isEditing}
            placeholder="Pincode"
            className="border rounded-lg p-2"
          />
        </div>
      </div>

      {/* About */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">About</label>
        <textarea
          name="about"
          rows="4"
          value={formData.about || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className={`w-full border rounded-lg p-2 mt-1 ${
            isEditing
              ? "border-gray-300 focus:ring focus:ring-blue-100 focus:border-blue-400"
              : "border-gray-200 bg-gray-100 text-gray-500"
          }`}
          placeholder="Write a short professional bio..."
        />
      </div>
    </div>
  );
};

export default DoctorProfile;
