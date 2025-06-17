import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Button, Alert, Paper } from '@mui/material';

const TestConnection = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Testing...');
  const [doctorsData, setDoctorsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [frontendPort, setFrontendPort] = useState<string>('3002');

  const testBackendConnection = async () => {
    try {
      setBackendStatus('Testing...');
      setError(null);
      
      // Test basic connectivity
      const response = await fetch('http://localhost:5000/api/users/doctors');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('✅ Backend Connected Successfully');
        setDoctorsData(data);
      } else {
        setBackendStatus('❌ Backend Error');
        setError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      setBackendStatus('❌ Backend Connection Failed');
      setError(err.message);
    }
  };

  useEffect(() => {
    testBackendConnection();
    // Get the current port from window.location
    setFrontendPort(window.location.port || '3002');
  }, []);

  return (
    <Container maxWidth="md" className="mt-10 p-6">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" component="h1" className="mb-6 text-center">
          Frontend-Backend Connection Test
        </Typography>
        
        <Box className="space-y-4">
          <Typography variant="h6">Connection Information:</Typography>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Frontend:</strong> http://localhost:{frontendPort}<br/>
              <strong>Backend:</strong> http://localhost:5000<br/>
              <strong>API Base:</strong> http://localhost:5000/api
            </Typography>
          </Alert>
          
          <Typography variant="h6">Backend Status:</Typography>
          <Alert severity={backendStatus.includes('✅') ? 'success' : 'error'}>
            {backendStatus}
          </Alert>
          
          {error && (
            <Alert severity="error">
              Error: {error}
            </Alert>
          )}
          
          {doctorsData && (
            <Box>
              <Typography variant="h6">Doctors Data:</Typography>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(doctorsData, null, 2)}
              </pre>
            </Box>
          )}
          
          <Button 
            variant="contained" 
            onClick={testBackendConnection}
            className="mt-4"
          >
            Test Connection Again
          </Button>
          
          <Box className="mt-6 p-4 bg-blue-50 rounded">
            <Typography variant="h6" className="mb-2">Next Steps:</Typography>
            <Typography variant="body2" className="space-y-1">
              1. ✅ Frontend is running on port {frontendPort}<br/>
              2. ✅ Backend is running on port 5000<br/>
              3. ✅ CORS is configured for multiple ports<br/>
              4. 🔄 Test the connection above<br/>
              5. 🚀 Try the main application at <a href="/" className="text-blue-600 underline">Home Page</a>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestConnection; 