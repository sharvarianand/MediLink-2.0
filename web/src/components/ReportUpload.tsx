import React, { useState, useEffect } from 'react';
import { uploadReport } from '../services/reports';
import { getDoctors } from '../services/appointments'; // To select a doctor for the report

interface Doctor {
  id: string;
  name: string;
  email: string;
  profile: { specialization?: string };
}

const ReportUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState<string>('lab');
  const [reportDate, setReportDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setDoctorId(data[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load doctors for report upload:', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!file || !reportDate || !reportType || !doctorId) {
      setError('Please fill in all required fields (File, Date, Type, Doctor).');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);
    formData.append('date', new Date(reportDate).toISOString());
    formData.append('notes', notes);
    formData.append('doctorId', doctorId);

    try {
      const response = await uploadReport(formData);
      setSuccess('Report uploaded successfully!');
      setFile(null);
      setReportType('lab');
      setReportDate('');
      setNotes('');
      setDoctorId(doctors[0]?.id || '');
      (document.getElementById('fileInput') as HTMLInputElement).value = ''; // Clear file input
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 32, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Upload Medical Report</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select File (Image/PDF):</label>
          <input
            id="fileInput"
            type="file"
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
            required
          />
        </div>
        <div>
          <label>Report Type:</label>
          <select value={reportType} onChange={e => setReportType(e.target.value)} required>
            <option value="lab">Lab Report</option>
            <option value="prescription">Prescription</option>
            <option value="xray">X-Ray</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Date of Report:</label>
          <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} required />
        </div>
        <div>
          <label>Associated Doctor:</label>
          <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
            {doctors.length === 0 ? (
                <option value="">Loading doctors...</option>
            ) : (
                doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                        {doc.name} {doc.profile?.specialization ? `(${doc.profile.specialization})` : ''}
                    </option>
                ))
            )}
          </select>
        </div>
        <div>
          <label>Notes (optional):</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}></textarea>
        </div>
        <button type="submit" style={{ marginTop: 10 }} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportUpload; 