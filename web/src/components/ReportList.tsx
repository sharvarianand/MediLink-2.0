import React, { useState, useEffect } from 'react';
import { getReports } from '../services/reports';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import { Typography, Box, Paper, Alert, List, ListItem, ListItemText, Button } from '@mui/material';

interface MedicalReport {
  _id: string;
  patientId: string;
  doctorId: { _id: string; name: string; email: string };
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

  if (loading) return <Typography>Loading medical reports...</Typography>;
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (reports.length === 0) return <Typography>No medical reports found.</Typography>;

  return (
    <Box className="mt-8">
      <Typography variant="h5" component="h3" className="mb-4 text-gray-800 font-bold">
        Your Medical Reports
      </Typography>
      <List>
        {reports.map(report => (
          <Paper elevation={2} key={report._id} className="p-4 mb-4 rounded-lg shadow-md">
            <ListItem className="flex flex-col items-start p-0">
              <ListItemText
                primary={
                  <Typography variant="h6" component="span" className="text-indigo-700">
                    {report.fileName}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Report Type:</strong> {report.reportType.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date:</strong> {formatDate(report.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Uploaded At:</strong> {formatDate(report.uploadedAt)}
                    </Typography>
                    {report.doctorId && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Doctor:</strong> {report.doctorId.name}
                      </Typography>
                    )}
                    {report.notes && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notes:</strong> {report.notes}
                      </Typography>
                    )}
                    {report.extractedText && (
                      <Box className="mt-2 p-2 border border-dashed border-gray-300 rounded-md bg-gray-50">
                        <Typography variant="body2" className="font-semibold">Extracted Text Preview:</Typography>
                        <Typography variant="caption" style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto', display: 'block' }}>
                          {report.extractedText.substring(0, 300)}{report.extractedText.length > 300 ? '...' : ''}
                        </Typography>
                      </Box>
                    )}
                    <Box className="mt-3">
                      <Button
                        variant="outlined"
                        color="primary"
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        View Original File
                      </Button>
                    </Box>
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ReportList; 