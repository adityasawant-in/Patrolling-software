import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver'; // Import the FileSaver library

const QRCard = ({ qrCode, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteQRCode = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/qr/${qrCode._id}`, {
        withCredentials: true,
      });
      toast.success('QR code deleted successfully');
      onDelete(); // Call onDelete to refresh the list after deleting
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete QR code. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const saveQRCode = () => {
    saveAs(qrCode.qrCodeUrl, `${qrCode.uniqueCode}.png`); // Save the QR code image
    toast.success('QR code saved successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <img
          src={qrCode.qrCodeUrl}
          alt={`QR Code for ${qrCode.buildingName}`}
          className="mx-auto w-48 h-48 object-contain"
        />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {qrCode.buildingName}
          </h3>
          <p className="text-gray-600">Location: {qrCode.location}</p>
          <p className="text-gray-600">Code: {qrCode.uniqueCode}</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={deleteQRCode}
            className={`w-full py-2 rounded text-white ${isDeleting ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={saveQRCode}
            className="w-full py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
          >
            Save QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCard;
