import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const AddingNewUser = () => {
  const { token } = useUser();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    profile_picture: '',
    date_of_birth: '',
    marital_status: 'single',
    payment_methods: [{ type: 'credit_card', details: '' }],
    locations: [{ name: '', address: '', lat: 0, lng: 0 }],
  });

  const [notification, setNotification] = useState({
    message: '',
    type: '', // "success" or "error"
    visible: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentMethodChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPaymentMethods = [...formData.payment_methods];
    updatedPaymentMethods[index][name] = value;
    setFormData({ ...formData, payment_methods: updatedPaymentMethods });
  };

  const handleLocationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLocations = [...formData.locations];
    updatedLocations[index][name] = value;
    setFormData({ ...formData, locations: updatedLocations });
  };

  const addPaymentMethod = () => {
    setFormData({
      ...formData,
      payment_methods: [
        ...formData.payment_methods,
        { type: 'credit_card', details: '' },
      ],
    });
  };

  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [
        ...formData.locations,
        { name: '', address: '', lat: 0, lng: 0 },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/register-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Clear the form on success
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          password: '',
          role: 'user',
          profile_picture: '',
          date_of_birth: '',
          marital_status: 'single',
          payment_methods: [{ type: 'credit_card', details: '' }],
          locations: [{ name: '', address: '', lat: 0, lng: 0 }],
        });

        // Show success notification
        setNotification({
          message: 'User added successfully!',
          type: 'success',
          visible: true,
        });
      } else {
        // Show error notification
        setNotification({
          message: `Error: ${data.message}`,
          type: 'error',
          visible: true,
        });
      }
    } catch (error) {
      // Show error notification
      setNotification({
        message: 'An error occurred while submitting the form.',
        type: 'error',
        visible: true,
      });
    }

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 5000);
  };

  return (
    <div
      className={`p-6 min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full p-8 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Notification */}
        {notification.visible && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.message}
          </div>
        )}

        <h2 className="text-2xl text-center font-bold mb-6">Add New User</h2>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Marital Status
            </label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
          {formData.payment_methods.map((method, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    name="type"
                    value={method.type}
                    onChange={(e) => handlePaymentMethodChange(index, e)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Details
                  </label>
                  <input
                    type="text"
                    name="details"
                    value={method.details}
                    onChange={(e) => handlePaymentMethodChange(index, e)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPaymentMethod}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Payment Method
          </button>
        </div>

        {/* Locations */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Locations</h3>
          {formData.locations.map((location, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={location.name}
                    onChange={(e) => handleLocationChange(index, e)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={location.address}
                    onChange={(e) => handleLocationChange(index, e)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="lat"
                    value={location.lat}
                    onChange={(e) => handleLocationChange(index, e)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="lng"
                    value={location.lng}
                    onChange={(e) => handleLocationChange(index, e)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addLocation}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Location
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-15 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddingNewUser;
