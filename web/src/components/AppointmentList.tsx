import React, { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus } from '../services/appointments';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

interface Appointment {
  _id: string;
  patientId: { name: string; email: string };
  doctorId: { name: string; email: string; profile?: { specialization?: string } };
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
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointments(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Your Appointments</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {appointments.map(appt => (
          <li key={appt._id} style={{ border: '1px solid #eee', padding: 15, marginBottom: 10, borderRadius: 8 }}>
            <p><strong>Date:</strong> {formatDate(appt.dateTime)}</p>
            {user?.role === 'patient' && (
              <p><strong>Doctor:</strong> {appt.doctorId.name} ({appt.doctorId.profile?.specialization || 'N/A'})</p>
            )}
            {user?.role === 'doctor' && (
              <p><strong>Patient:</strong> {appt.patientId.name}</p>
            )}
            <p><strong>Symptoms:</strong> {appt.symptoms}</p>
            <p><strong>Status:</strong> {appt.status.toUpperCase()}</p>
            {user?.role === 'doctor' && ( 
              <div>
                <button onClick={() => handleStatusChange(appt._id, 'confirmed')} disabled={appt.status === 'confirmed'}>Confirm</button>
                <button onClick={() => handleStatusChange(appt._id, 'cancelled')} disabled={appt.status === 'cancelled'} style={{ marginLeft: 5 }}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
