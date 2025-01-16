import { useState, useEffect } from 'react';
import QRForm from './QRForm';
import QRCard from './QRCard';
import { fetchQRCodes } from '../../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [qrCodes, setQRCodes] = useState([]);

  const loadQRCodes = async () => {
    try {
      const data = await fetchQRCodes();
      setQRCodes(data);
    } catch (error) {
      toast.error('Failed to load QR codes');
    }
  };

  useEffect(() => {
    loadQRCodes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Dashboard</h1>
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map(qrCode => (
            <QRCard key={qrCode._id} qrCode={qrCode} onDelete={loadQRCodes} />
          ))}
        </div>

        {showForm && (
          <QRForm
            onClose={() => setShowForm(false)}
            onSave={loadQRCodes}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;