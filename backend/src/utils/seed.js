const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalReport = require('../models/MedicalReport');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medilink';

const indianDoctorNames = [
  'Dr. Aarav Sharma',
  'Dr. Priya Patel',
  'Dr. Rohan Mehra',
  'Dr. Ananya Singh',
  'Dr. Aditya Verma',
  'Dr. Sneha Nair',
  'Dr. Karan Kapoor',
  'Dr. Isha Desai',
  'Dr. Arjun Reddy',
  'Dr. Meera Joshi'
];

const indianPatientNames = [
  'Rahul Gupta',
  'Pooja Sinha',
  'Vikram Rao',
  'Neha Jain',
  'Amit Kulkarni',
  'Sonal Agarwal',
  'Ritesh Bansal',
  'Divya Menon',
  'Siddharth Chatterjee',
  'Kavya Pillai'
];

const specializations = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Oncology',
  'Psychiatry',
  'ENT',
  'General Medicine'
];

const medicalConditionsList = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Thyroid Disorder',
  'Heart Disease',
  'Arthritis',
  'None'
];

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Appointment.deleteMany({});
  await MedicalReport.deleteMany({});

  // Create doctors
  const doctors = await Promise.all(indianDoctorNames.map((name, i) =>
    User.create({
      name,
      email: `doctor${i + 1}@medilink.com`,
      password: 'password123',
      role: 'doctor',
      profile: {
        specialization: specializations[i % specializations.length],
        phone: `90000000${i + 1}`,
        address: `Clinic ${i + 1}, Mumbai`
      }
    })
  ));

  // Create patients
  const patients = await Promise.all(indianPatientNames.map((name, i) =>
    User.create({
      name,
      email: `patient${i + 1}@medilink.com`,
      password: 'password123',
      role: 'patient',
      profile: {
        age: 25 + (i % 10),
        gender: i % 2 === 0 ? 'male' : 'female',
        phone: `80000000${i + 1}`,
        address: `House ${i + 1}, Delhi`,
        medicalConditions: [medicalConditionsList[i % medicalConditionsList.length]]
      }
    })
  ));

  // Create appointments
  for (let i = 0; i < 10; i++) {
    await Appointment.create({
      doctorId: doctors[i % doctors.length]._id,
      patientId: patients[i % patients.length]._id,
      dateTime: new Date(Date.now() + i * 86400000),
      status: ['pending', 'confirmed', 'cancelled'][i % 3],
      notes: 'Follow up in 2 weeks',
      symptoms: 'Fever, cough'
    });
  }

  // Create medical reports
  for (let i = 0; i < 10; i++) {
    await MedicalReport.create({
      patientId: patients[i % patients.length]._id,
      doctorId: doctors[i % doctors.length]._id,
      fileUrl: `/uploads/report${i + 1}.pdf`,
      fileName: `report${i + 1}.pdf`,
      fileType: 'application/pdf',
      extractedText: 'Sample extracted text from report.',
      reportType: ['lab', 'prescription', 'xray', 'other'][i % 4],
      date: new Date(Date.now() - i * 86400000),
      notes: 'Sample report notes.'
    });
  }

  console.log('Mock data inserted!');
  mongoose.disconnect();
}

seed(); 