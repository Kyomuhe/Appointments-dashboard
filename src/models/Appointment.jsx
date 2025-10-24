import { useState, useMemo } from 'react';
import { X, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { makeAuthenticatedRequest, showToast } from '../utils/util';

const BookAppointmentModal = ({ isOpen, onClose, doctor, appointment, updateTitle, buttonTitle ,onSuccess}) => {
  console.log(doctor)
  const [selectedTime, setSelectedTime] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [description, setDescription] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const user = useMemo(
    () => {
      return JSON.parse(localStorage.getItem('user'))
    }, []
  )

  if (!isOpen) return null;
  const selectedDoctorId = doctor?.id
  const selectedDoctorName = doctor?.name
  const timeRanges = appointment ? [] : doctor?.timeRanges
  const timeSlots = appointment ? appointment.timeRanges.split(',').map(slot => slot.trim()) : timeRanges.split(',').map(slot => slot.trim())
  //console.log(timeSlots)

  // const timeSlots = [
  //   '8:00 am - 1:00 am',
  //   '02:00 am - 03:00 pm',
  //   '03:00 pm - 04:00 pm'
  // ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const makingAppointment = async () => {
    try {
      if (!selectedDate) {
        showToast("Please select a date", "error");
        return;
      }
      if (!selectedTime) {
        showToast("Please select a time slot", "error");
        return;
      }

      const doctorName = selectedDoctorName
      const doctorId = selectedDoctorId
      const patientName = user.lastName + ' ' + user.firstName
      const patientId = user.id
      const timeRange = selectedTime
      const notes = description
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate).padStart(2, '0');
      const scheduledDate = `${year}-${month}-${day}`;
      const data = { doctorName, doctorId, patientName, timeRange, notes, scheduledDate, patientId }
      console.log(data)

      const response = await makeAuthenticatedRequest("makeAppointment", "appointment", data)
      console.log(response)
      if (response?.returnCode !== 0) {
        const errorMessage = response?.returnMessage || "oops failed to make appointment"
        showToast(errorMessage, "error")
        return;
      }
      showToast('booked successfully', 'success');
      onClose()
    } catch (error) {
      showToast("oops some thing unexpected happend", "error")
      console.log(error)

    }
  }
  const updateAppointment = async () => {
    try {
      if (!selectedDate) {
        showToast("Please select a date", "error");
        return;
      }
      if (!selectedTime) {
        showToast("Please select a time slot", "error");
        return;
      }

      const appointmentId = appointment?.appointment?.id
      const timeRange = selectedTime
      const notes = description
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate).padStart(2, '0');
      const scheduledDate = `${year}-${month}-${day}`;
      const data = { timeRange, notes, scheduledDate, appointmentId }
      console.log("sending updated data")
      console.log(data)
      console.log(appointment)

      const response = await makeAuthenticatedRequest("updateAppointment", "appointment", data)
      if (response?.returnCode !== 0) {
        const errorMessage = response?.returnMessage || "oops failed to make appointment"
        showToast(errorMessage, "error")
        return;

      }
      showToast("updated successfully", "success")
      onSuccess?.();
      onClose()
    } catch (error) {
      showToast("ooops something unexpected happened", "error")
      console.log(error)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative bg-gradient-to-br from-[#1A2234] to-[#0F1419] rounded-xl shadow-2xl w-full max-w-3xl border border-white/10 pointer-events-auto animate-scaleIn">
          <div className="bg-gradient-to-r from-[#1A2234] to-[#0F1419] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{updateTitle}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="p-5">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                The clinic will send an online consultation link to your number. The doctor will be available at the time you choose.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Select Time</label>
                <div className="space-y-2">
                  {timeSlots.map((time, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border border-white/10"
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        checked={selectedTime === time}
                        onChange={() => setSelectedTime(time)}
                        className="w-3.5 h-3.5 text-cyan-500"
                      />
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-xs">{time}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-300 mb-2">Notes (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any additional notes or symptoms..."
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>

              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-300">Select Date</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPreviousMonth}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="flex items-center gap-1.5 text-cyan-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </span>
                    </div>
                    <button
                      onClick={goToNextMonth}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        disabled={!day}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square flex items-center justify-center rounded text-xs transition-all ${!day
                          ? 'invisible'
                          : selectedDate === day
                            ? 'bg-cyan-500 text-white font-bold'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            <button
              onClick={() => appointment ? updateAppointment() : makingAppointment()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all text-sm">
              {buttonTitle}
            </button>
          </div>
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
    </>
  );
};

export default BookAppointmentModal;


// {
//   "doctor": {
//     "name": "steven",
//     "timeSlots": []
//   }
// }