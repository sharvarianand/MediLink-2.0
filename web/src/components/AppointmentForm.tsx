import React, { useState, useEffect } from 'react';
import { createAppointment, getDoctors } from '../services/appointments';

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
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const appointment = await createAppointment({
        doctorId,
        dateTime: new Date(dateTime).toISOString(),
        symptoms,
        notes,
      });
      setSuccess('Appointment booked successfully!');
      setDoctorId(doctors[0]?.id || '');
      setDateTime('');
      setSymptoms('');
      setNotes('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div style={{ marginBottom: 32, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Book New Appointment</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor:</label>
          <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name} {doc.profile?.specialization ? `(${doc.profile.specialization})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date and Time:</label>
          <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
        </div>
        <div>
          <label>Symptoms:</label>
          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} required></textarea>
        </div>
        <div>
          <label>Notes (optional):</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}></textarea>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm; 