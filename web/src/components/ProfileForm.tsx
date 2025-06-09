import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/user';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    age?: number;
    gender?: string;
    specialization?: string;
    phone?: string;
    address?: string;
  };
}

const ProfileForm = () => {
  const { user, login } = useAuth(); // Use login to update context after profile update
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const data = await getUserProfile();
          setProfileData(data);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setProfileData(prev => prev ? { ...prev, name: value } : null);
    } else {
      setProfileData(prev => prev ? { ...prev, profile: { ...prev.profile, [name]: value } } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!profileData) return;

    try {
      const updatedUser = await updateUserProfile({
        name: profileData.name,
        profile: profileData.profile,
      });
      // Update the user in AuthContext to reflect changes
      if (user) {
        login(updatedUser, localStorage.getItem('token') || '');
      }
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profileData) return <p>No profile data available.</p>;

  return (
    <div style={{ marginBottom: 32, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Your Profile</h3>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={profileData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={profileData.email} disabled style={{ background: '#f0f0f0' }} />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="age" value={profileData.profile?.age || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={profileData.profile?.gender || ''} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {user?.role === 'doctor' && (
          <div>
            <label>Specialization:</label>
            <input name="specialization" value={profileData.profile?.specialization || ''} onChange={handleChange} />
          </div>
        )}
        <div>
          <label>Phone:</label>
          <input name="phone" value={profileData.profile?.phone || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Address:</label>
          <textarea name="address" value={profileData.profile?.address || ''} onChange={handleChange}></textarea>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm; 