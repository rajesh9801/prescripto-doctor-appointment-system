import React, { useContext, useState } from "react";
import { assets, specialityData } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [fees, setFees] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [about, setAbout] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", education);
      formData.append("available", true); // ✅ required
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // ✅ Axios request
      const res = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 👈 fix here
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const data = res.data; // ✅ axios parses automatically
      if (data.success) {
        toast.success("Doctor added successfully");
        // ✅ Clear form fields
        setName("");
        setEmail("");
        setPassword("");
        setExperience("");
        setFees("");
        setAbout("");
        setSpeciality("");
        setEducation("");
        setAddress1("");
        setAddress2("");
        setDocImg(null);
      }
      else toast.error(error.message);
    } catch (error) {
      toast.error("Something.... went wrong");
    }
  };

  return (
    <div className="min-h-screen  bg-gray-50 flex justify-center items-start py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Add Doctor</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upload section */}
          <div className="flex flex-col items-center space-y-2">
            <label htmlFor="doc-img" className="cursor-pointer flex flex-col items-center">
              <img
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="Upload doctor"
                className="w-20 h-20 object-cover rounded-full border border-gray-300 p-2"
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Upload doctor <br /> picture
              </p>
            </label>
            <input
              type="file"
              id="doc-img"
              hidden
              onChange={(e) => setDocImg(e.target.files[0])}
            />
          </div>

          {/* Form fields */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700">Doctor name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Speciality</label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {specialityData.map((items, index) => (
                  <option key={index} value={items.speciality}>
                    {items.speciality}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700">Doctor Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Education</label>
              <input
                type="text"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Education"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Doctor Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Address</label>
              <input
                type="text"
                required
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Address 1"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                required
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Address 2"
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700">Fees</label>
              <input
                type="number"
                required
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Your fees"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* About me */}
        <div className="mt-6">
          <label className="block text-sm text-gray-700">About me</label>
          <textarea
            placeholder="Write about yourself"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-full transition"
          >
            Add doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
