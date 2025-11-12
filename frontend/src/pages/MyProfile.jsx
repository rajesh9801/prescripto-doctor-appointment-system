import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;
        const response = await axios.get(`${backendUrl}/api/user/my-profile`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data.success) {
          const user = response.data.userData;
          setUserData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "Not Selected",
            dob: user.dob || "",
            image: user.image || "/default-avatar.png",
            address: {
              line1: user.address?.line1 || "",
              line2: user.address?.line2 || "",
            },
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [backendUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUserData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file), // show preview instantly
      }));
    }
  };

  const handleSave = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("addressLine1", userData.address.line1);
      formData.append("addressLine2", userData.address.line2);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.userData);
        setIsEdit(false);
        setSelectedImage(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating profile");
    }
  };

  if (!userData) {
    return (
      <div className="text-center py-10 text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <img
          src={userData.image}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover shadow-md"
        />
        {isEdit && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-3 text-sm"
          />
        )}
        {isEdit ? (
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            className="mt-3 border rounded-lg px-3 py-1 w-full text-center"
          />
        ) : (
          <p className="mt-3 text-xl font-semibold">{userData.name}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
        <div className="space-y-3">
          <div>
            <p className="font-medium">Email:</p>
            <p className="text-gray-700">{userData.email}</p>
          </div>

          <div>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                }
                className="border rounded-lg px-3 py-1 w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.phone || "Not Provided"}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className="border rounded-lg px-3 py-1 w-full"
                  placeholder="Address Line 1"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  className="border rounded-lg px-3 py-1 w-full"
                  placeholder="Address Line 2"
                />
              </div>
            ) : (
              <p className="text-gray-700">
                {userData.address.line1 || "Not Provided"} <br />
                {userData.address.line2 || ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
        <div className="space-y-3">
          <div>
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="border rounded-lg px-3 py-1 w-full"
              >
                <option value="Not Selected">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-700">{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                className="border rounded-lg px-3 py-1 w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.dob || "Not Provided"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isEdit ? (
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Save Information
        </button>
      ) : (
        <button
          onClick={() => setIsEdit(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default MyProfile;
