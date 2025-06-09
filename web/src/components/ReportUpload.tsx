import React, { useState, useEffect } from 'react';
import { uploadReport } from '../services/reports';
import { getDoctors } from '../services/appointments'; // To select a doctor for the report
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';

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
        console.error('Failed to load doctors for report upload:', err);
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

    if (!file || !reportDate || !reportType || !doctorId) {
      setError('Please fill in all required fields (File, Date, Type, Doctor).');
      setSubmitting(false);
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
      setSubmitting(false);
    }
  };

  return (
    <Box className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <Typography variant="h6" component="h3" className="mb-4 text-gray-800 font-semibold">
        Upload Medical Report
      </Typography>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <InputLabel htmlFor="fileInput" className="mb-2 block text-sm font-medium text-gray-700">Select File (Image/PDF):</InputLabel>
          <input
            id="fileInput"
            type="file"
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
            required
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            onChange={e => setReportType(e.target.value as string)}
            label="Report Type"
            required
          >
            <MenuItem value="lab">Lab Report</MenuItem>
            <MenuItem value="prescription">Prescription</MenuItem>
            <MenuItem value="xray">X-Ray</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date of Report"
          type="date"
          value={reportDate}
          onChange={e => setReportDate(e.target.value)}
          fullWidth
          required
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Associated Doctor</InputLabel>
          <Select
            value={doctorId}
            onChange={e => setDoctorId(e.target.value as string)}
            label="Associated Doctor"
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
          {submitting ? 'Uploading...' : 'Upload Report'}
        </Button>
      </form>
    </Box>
  );
};

export default ReportUpload; 