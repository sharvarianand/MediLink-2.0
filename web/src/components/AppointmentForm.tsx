import React, { useState, useEffect } from 'react';
import { createAppointment, getDoctors } from '../services/appointments';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';

interface Doctor {
  id: string;
  name: string;
  email: string;
  profile: { specialization?: string };
}

const AppointmentForm = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setDoctorId(data[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load doctors');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const appointment = await createAppointment({
        doctorId,
        dateTime: new Date(dateTime).toISOString(),
        symptoms,
        notes,
      });
      setSuccess('Appointment booked successfully!');
      setDoctorId(doctors[0]?.id || ''); // Reset to first doctor or empty
      setDateTime('');
      setSymptoms('');
      setNotes('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <Typography variant="h6" component="h3" className="mb-4 text-gray-800 font-semibold">
        Book New Appointment
      </Typography>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl fullWidth variant="outlined">
          <InputLabel>Doctor</InputLabel>
          <Select
            value={doctorId}
            onChange={e => setDoctorId(e.target.value as string)}
            label="Doctor"
            required
            disabled={loadingDoctors}
          >
            {loadingDoctors ? (
              <MenuItem value="">Loading doctors...</MenuItem>
            ) : doctors.length === 0 ? (
              <MenuItem value="">No doctors available</MenuItem>
            ) : (
              doctors.map(doc => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name} {doc.profile?.specialization ? `(${doc.profile.specialization})` : ''}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <TextField
          label="Date and Time"
          type="datetime-local"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          fullWidth
          required
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Symptoms"
          multiline
          rows={3}
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          fullWidth
          required
          variant="outlined"
        />
        <TextField
          label="Notes (optional)"
          multiline
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          disabled={submitting}
        >
          {submitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
    </Box>
  );
};

export default AppointmentForm; 