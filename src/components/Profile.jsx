import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { User, Mail, BookOpen, Calendar, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  // Degree options
  const degreeOptions = ['BSc Computer Science', 'BSc Information Technology'];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEditForm(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Create a clean object with only the fields we want to update
      const updateData = {
        name: editForm.name,
        degree: editForm.degree
      };
      
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData({
          ...updatedData,
          joinedAt: updatedData.joinedAt || userData.joinedAt
        });
        setIsEditing(false);
        setMessage('Profile updated successfully! ✅');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-pink-900 mb-2"
          >
            👤 Your Profile
          </motion.h1>
          <p className="text-pink-700">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-pink-200"
        >
          {/* Edit Toggle */}
          <div className="flex justify-end mb-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center px-4 py-2 rounded-full ${
                isEditing 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
              } transition`}
            >
              {isEditing ? <X size={18} className="mr-2" /> : <Edit3 size={18} className="mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center"
            >
              {message}
            </motion.div>
          )}

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-center">
              <User className="text-pink-500 mr-4" size={24} />
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="flex-1 p-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              ) : (
                <div>
                  <p className="text-sm text-pink-600">Name</p>
                  <p className="text-xl font-semibold text-pink-900">{userData?.name}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center">
              <Mail className="text-pink-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-pink-600">Email</p>
                <p className="text-lg text-pink-900">{userData?.email}</p>
              </div>
            </div>

            {/* Degree */}
            <div className="flex items-center">
              <BookOpen className="text-pink-500 mr-4" size={24} />
              {isEditing ? (
                <select
                  value={editForm.degree || ''}
                  onChange={(e) => setEditForm({...editForm, degree: e.target.value})}
                  className="flex-1 p-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">Select your degree</option>
                  {degreeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <div>
                  <p className="text-sm text-pink-600">Degree/Course</p>
                  <p className="text-lg text-pink-900">{userData?.degree || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Join Date */}
            <div className="flex items-center">
              <Calendar className="text-pink-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-pink-600">Member Since</p>
                <p className="text-lg text-pink-900">
                  {new Date(userData?.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition shadow-md flex items-center justify-center"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;