import React, { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus } from '../services/appointments';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import { Typography, Box, Paper, Button, Alert, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

interface Appointment {
  _id: string;
  patientId: { _id: string; name: string; email: string };
  doctorId: { _id: string; name: string; email: string; profile?: { specialization?: string } };
  dateTime: string;
  status: string;
  symptoms: string;
  notes?: string;
}

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    if (user?.role !== 'doctor') return; // Only doctors can change status
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }
    setStatusUpdateLoading(appointmentId); // Indicate which appointment is being updated
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointments(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  if (loading) return <Typography>Loading appointments...</Typography>;
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (appointments.length === 0) return <Typography>No appointments found.</Typography>;

  return (
    <Box className="mt-8">
      <Typography variant="h5" component="h3" className="mb-4 text-gray-800 font-bold">
        Your Appointments
      </Typography>
      <List>
        {appointments.map(appt => (
          <Paper elevation={2} key={appt._id} className="p-4 mb-4 rounded-lg shadow-md">
            <ListItem className="flex flex-col items-start p-0">
              <ListItemText
                primary={
                  <Typography variant="h6" component="span" className="text-blue-700">
                    {user?.role === 'patient' ? `Dr. ${appt.doctorId.name}` : `Patient: ${appt.patientId.name}`}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date:</strong> {formatDate(appt.dateTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Symptoms:</strong> {appt.symptoms}
                    </Typography>
                    {appt.notes && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notes:</strong> {appt.notes}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> <span className={`font-semibold ${appt.status === 'confirmed' ? 'text-green-600' : appt.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{appt.status.toUpperCase()}</span>
                    </Typography>
                  </>
                }
              />
              {user?.role === 'doctor' && ( 
                <Box className="mt-3 w-full">
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id={`status-label-${appt._id}`}>Update Status</InputLabel>
                    <Select
                      labelId={`status-label-${appt._id}`}
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt._id, e.target.value as string)}
                      label="Update Status"
                      disabled={statusUpdateLoading === appt._id}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default AppointmentList;
