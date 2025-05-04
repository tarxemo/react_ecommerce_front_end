import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../api/queries';
import { 
  UPDATE_USER_PROFILE, 
  UPDATE_PROFILE_PICTURE, 
  UPDATE_PASSWORD 
} from '../api/mutations';
import { FaUser, FaLock, FaCamera, FaSave } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import axios from 'axios';
import { ENDPOINT } from '../api/environment';
import { getAccessToken } from '../utils/auth';
import { getCloudinaryUrl } from '../utils/cloudinary';
interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
}

interface PasswordFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface UserType {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  profilePicture: string;
  userType: string;
}

interface UpdateProfileResponse {
  updateUserProfile: {
    success: boolean;
    errors: string[];
    user: UserType;
  };
}

interface UpdateProfileVariables {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch current user data
  const { data, loading, error } = useQuery<{ me: UserType }>(GET_ME);

  // Profile update mutation
  const [updateProfile] = useMutation<UpdateProfileResponse, UpdateProfileVariables>(
    UPDATE_USER_PROFILE,
    {
      refetchQueries: [{ query: GET_ME }],
      onCompleted: () => {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: (err) => {
        setErrorMessage(err.message);
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  // Profile picture update mutation
  const [] = useMutation<{
    updateProfilePicture: {
      success: boolean;
      errors: string[];
      user: Pick<UserType, 'id' | 'profilePicture'>;
    }
  }>(UPDATE_PROFILE_PICTURE, {
    refetchQueries: [{ query: GET_ME }],
    onCompleted: () => {
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });

  // Password update mutation
  const [updatePassword] = useMutation<{
    updatePassword: {
      success: boolean;
      errors: string[];
    }
  }>(UPDATE_PASSWORD, {
    onCompleted: () => {
      setSuccessMessage('Password updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('profile_picture', file);
  
      try {
        const response = await axios.post(
                `${ENDPOINT}/api/profile-picture/`, 
          formData,
          {
            headers: {
              'Authorization': `Bearer ${getAccessToken()}`, // or `Bearer ${yourJWTToken}` for JWT
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        console.log('Upload successful:', response.data);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variables: Partial<ProfileFormData> = {};
    
    // Only include fields that have been changed
    (Object.keys(profileForm) as Array<keyof ProfileFormData>).forEach(key => {
      if (profileForm[key] !== '') {
        variables[key] = profileForm[key];
      }
    });

    if (Object.keys(variables).length > 0) {
      updateProfile({ variables });
    }
  };

  // Handle password form submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrorMessage("New passwords don't match");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    updatePassword({
      variables: {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      }
    });
  };

  if (loading) return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div>Loading...</div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div>Error: {error.message}</div>
      </div>
      <Footer />
    </div>
  );

  const user = data?.me;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative mb-4">
                    {user?.profilePicture ? (
                      <img 
                        src={getCloudinaryUrl(user.profilePicture)}
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#FFE31A]"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-[#FFE31A]">
                        <FaUser className="text-3xl text-gray-400" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#FFE31A] text-gray-900 rounded-full p-2 cursor-pointer hover:bg-yellow-500 transition">
                      <FaCamera />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfilePictureUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-bold">{user?.username}</h2>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left py-2 px-4 rounded-md mb-2 flex items-center ${activeTab === 'profile' ? 'bg-[#FFE31A] text-gray-900' : 'hover:bg-gray-700'}`}
                >
                  <FaUser className="mr-2" /> Profile
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left py-2 px-4 rounded-md flex items-center ${activeTab === 'password' ? 'bg-[#FFE31A] text-gray-900' : 'hover:bg-gray-700'}`}
                >
                  <FaLock className="mr-2" /> Password
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-gray-800 rounded-lg p-6">
              {successMessage && (
                <div className="mb-4 p-3 bg-green-500 text-white rounded-md">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-500 text-white rounded-md">
                  {errorMessage}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaUser className="mr-2" /> Profile Information
                  </h2>
                  
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          defaultValue={user?.firstName || ''}
                          onChange={handleProfileChange}
                          placeholder={user?.firstName || 'First name'}
                          className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          defaultValue={user?.lastName || ''}
                          onChange={handleProfileChange}
                          placeholder={user?.lastName || 'Last name'}
                          className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={user?.email || ''}
                        onChange={handleProfileChange}
                        placeholder={user?.email || 'Email'}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone_number"
                        defaultValue={user?.phoneNumber || ''}
                        onChange={handleProfileChange}
                        placeholder={user?.phoneNumber || 'Phone number'}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea
                        name="address"
                        defaultValue={user?.address || ''}
                        onChange={handleProfileChange}
                        placeholder={user?.address || 'Address'}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                        rows={3}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        defaultValue={user?.dateOfBirth || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#FFE31A] text-gray-900 font-medium rounded-md hover:bg-yellow-500 transition flex items-center"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaLock className="mr-2" /> Change Password
                  </h2>
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Current Password</label>
                      <input
                        type="password"
                        name="old_password"
                        value={passwordForm.old_password}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-[#FFE31A]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#FFE31A] text-gray-900 font-medium rounded-md hover:bg-yellow-500 transition flex items-center"
                    >
                      <FaLock className="mr-2" /> Change Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;