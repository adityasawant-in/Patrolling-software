import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import toast from 'react-hot-toast';

const QRForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    buildingName: '',
    location: '',
    uniqueCode: '',
  });
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateUniqueCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({ ...prev, uniqueCode: code }));
  };

  const generateQRCode = () => {
    if (!formData.buildingName || !formData.location || !formData.uniqueCode) {
      toast.error('Please fill all fields');
      return;
    }
    setQrGenerated(true);
  };

  const handleSave = async () => {
    try {
      // Get the QR code canvas
      const qrCanvas = document.querySelector('canvas');
      const qrDataUrl = qrCanvas.toDataURL('image/png');
      
      // Convert data URL to Blob
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('qrImage', blob, 'qrcode.png');
      formDataToSend.append('buildingName', formData.buildingName);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('uniqueCode', formData.uniqueCode);
  
      // Updated axios configuration
      const result = await axios.post(
        'http://localhost:5000/api/qr/create', 
        formDataToSend,
        {
          headers: {
              "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
      }
      );
  
      console.log('Save response:', result.data);
      toast.success('QR Code saved successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Full error details:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || 'Failed to save QR Code');
      } else {
        toast.error('Network error occurred');
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Building Name"
            className="w-full p-2 border rounded"
            value={formData.buildingName}
            onChange={(e) => setFormData(prev => ({ ...prev, buildingName: e.target.value }))}
          />
          
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border rounded"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Unique Code"
              className="flex-1 p-2 border rounded"
              value={formData.uniqueCode}
              readOnly
            />
            <button
              onClick={generateUniqueCode}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate Code
            </button>
          </div>

          {!qrGenerated ? (
            <button
              onClick={generateQRCode}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Generate QR Code
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <QRCodeCanvas
                  value={JSON.stringify(formData)}
                  size={200}
                  level="H"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Save QR Code
              </button>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRForm;