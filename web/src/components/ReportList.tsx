import React, { useState, useEffect } from 'react';
import { getReports } from '../services/reports';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

interface MedicalReport {
  _id: string;
  patientId: string;
  doctorId: { name: string; email: string };
  fileUrl: string;
  fileName: string;
  fileType: string;
  extractedText?: string;
  reportType: string;
  date: string;
  notes?: string;
  uploadedAt: string;
}

const ReportList = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user?.id) {
        const data = await getReports(user.id);
        setReports(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  if (loading) return <p>Loading medical reports...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (reports.length === 0) return <p>No medical reports found.</p>;

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Your Medical Reports</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reports.map(report => (
          <li key={report._id} style={{ border: '1px solid #eee', padding: 15, marginBottom: 10, borderRadius: 8 }}>
            <p><strong>File Name:</strong> {report.fileName}</p>
            <p><strong>Report Type:</strong> {report.reportType.toUpperCase()}</p>
            <p><strong>Date:</strong> {formatDate(report.date)}</p>
            <p><strong>Uploaded At:</strong> {formatDate(report.uploadedAt)}</p>
            {report.doctorId && <p><strong>Doctor:</strong> {report.doctorId.name}</p>}
            {report.extractedText && (
              <div>
                <p><strong>Extracted Text:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap', border: '1px dashed #ddd', padding: 10 }}>
                  {report.extractedText.substring(0, 300)}...
                </p>
              </div>
            )}
            <p><a href={report.fileUrl} target="_blank" rel="noopener noreferrer">View Original File</a></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList; 