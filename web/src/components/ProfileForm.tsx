import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/user';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Alert, Paper } from '@mui/material';

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
    medicalConditions?: string[];
  };
}

const ProfileForm = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

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

  const handleMedicalConditionChange = (index: number, value: string) => {
    setProfileData(prev => prev ? {
      ...prev,
      profile: {
        ...prev.profile,
        medicalConditions: prev.profile?.medicalConditions?.map((cond, i) => i === index ? value : cond) || []
      }
    } : null);
  };

  const handleAddCondition = () => {
    setProfileData(prev => prev ? {
      ...prev,
      profile: {
        ...prev.profile,
        medicalConditions: [...(prev.profile?.medicalConditions || []), '']
      }
    } : null);
  };

  const handleRemoveCondition = (index: number) => {
    setProfileData(prev => prev ? {
      ...prev,
      profile: {
        ...prev.profile,
        medicalConditions: prev.profile?.medicalConditions?.filter((_, i) => i !== index) || []
      }
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (!profileData) return;

    try {
      const updatedUser = await updateUserProfile({
        name: profileData.name,
        profile: profileData.profile,
      });
      if (user) {
        login(updatedUser, localStorage.getItem('token') || '');
      }
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography>Loading profile...</Typography>;
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!profileData) return <Typography>No profile data available.</Typography>;

  return (
    <Paper elevation={3} className="mb-8 p-6 rounded-lg shadow-md bg-white">
      <Typography variant="h5" component="h3" className="mb-6 text-gray-800 font-bold">
        Your Profile
      </Typography>
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
        />
        <TextField
          label="Email"
          type="email"
          value={profileData.email}
          disabled
          fullWidth
          variant="filled"
          className="bg-gray-100"
        />
        <TextField
          label="Age"
          type="number"
          name="age"
          value={profileData.profile?.age || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={profileData.profile?.gender || ''}
            onChange={handleChange}
            label="Gender"
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        {user?.role === 'doctor' && (
          <TextField
            label="Specialization"
            name="specialization"
            value={profileData.profile?.specialization || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        )}
        <TextField
          label="Phone"
          name="phone"
          value={profileData.profile?.phone || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Address"
          name="address"
          multiline
          rows={3}
          value={profileData.profile?.address || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        {user?.role === 'patient' && (
          <Box>
            <Typography variant="subtitle1" className="mb-2">Medical Conditions</Typography>
            {(profileData.profile?.medicalConditions || []).map((condition, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <TextField
                  label={`Condition ${idx + 1}`}
                  value={condition}
                  onChange={e => handleMedicalConditionChange(idx, e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveCondition(idx)}
                  sx={{ minWidth: 36 }}
                >
                  X
                </Button>
              </Box>
            ))}
            <Button variant="outlined" color="primary" onClick={handleAddCondition} sx={{ mt: 1 }}>
              Add Condition
            </Button>
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Paper>
  );
};

export default ProfileForm;
