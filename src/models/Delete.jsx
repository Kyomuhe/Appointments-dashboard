import { makeAuthenticatedRequest, showToast } from "../utils/util"
import { Trash2 } from 'lucide-react';

const Delete = ({ isOpen, onClose, appointmentId, onDeleteSuccess }) => {
    const deleteAppointment = async() => {
        try {
            const id = { "appointmentId": appointmentId }
            const response = await makeAuthenticatedRequest("deleteAppointment", "appointment", id)
            console.log(response)
            
            if (response?.returnCode === 0) {
                showToast('Appointment deleted successfully', 'success');
                onDeleteSuccess(); 
                onClose();
            } else {
                showToast(response?.returnMessage || 'Failed to delete appointment', 'error');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            showToast('Failed to delete appointment', 'error');
        }
    }

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn flex items-center justify-center" 
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-[#1A2234] to-[#0F1419] rounded-2xl max-w-md w-full p-8 shadow-2xl transform animate-scaleIn"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Delete Appointment</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Are you sure you want to delete this appointment? This action cannot be undone.
                    </p>
                </div>
                
                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 text-gray-300 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={deleteAppointment}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors duration-300 shadow-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </div>
    )
}

export default Delete