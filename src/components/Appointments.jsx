import { useState, useEffect } from 'react';
import { Edit2, Trash2, Calendar, Clock, User, FileText } from 'lucide-react';
import { makeAuthenticatedRequest, showToast } from "../utils/util";
import Delete from '../models/Delete';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDelete, setDeleteModal] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); 

  useEffect(() => {
    displayAppointments();
  }, []);

  const displayAppointments = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
      const patientId = user.id;
      const id = { "patientId": patientId };
      
      const response = await makeAuthenticatedRequest("displayPatientAppointments", "appointment", id);
      console.log(response)
      
      if (response?.returnCode === 0) {
        setAppointments(response.returnObject || []);
      } else {
        showToast(response?.returnMessage || 'Failed to load appointments', 'error');
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // const formatTime = (timeString) => {
  //   return new Date(timeString).toLocaleTimeString('en-US', {
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'confirmed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400">View and manage your scheduled appointments</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-[#1A2234]/50 rounded-lg border border-white/10">
          <div className="bg-blue-500/10 p-6 rounded-full mb-6">
            <Calendar className="w-16 h-16 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Appointments Yet</h2>
          <p className="text-gray-400 text-center max-w-md">
            You haven't scheduled any appointments. Book your first appointment with a doctor to get started.
          </p>
        </div>
      ) : (
        <div className="bg-[#1A2234]/50 rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F1419]/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{appointment.doctorName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>{formatDate(appointment.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Clock className="w-4 h-4" />
                          <span>{(appointment.scheduledTime)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-300 max-w-xs">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{appointment.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => {
                          setSelectedAppointmentId(appointment.id); 
                          setDeleteModal(true);
                        }}

                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 
                          className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Delete
        isOpen={isDelete}
        onClose={() => setDeleteModal(false)}
        appointmentId={selectedAppointmentId}
        onDeleteSuccess={displayAppointments} 
      />
    </div>
  );
};

export default Appointment;