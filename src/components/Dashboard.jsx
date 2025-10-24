import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import nextDoc from '../assets/nextDoc.png'
import { makeAuthenticatedRequest, showToast } from '../utils/util';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const navigate = useNavigate
  const [generalCount, setGeneralCount] = useState()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    availableDoctors: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem('user'));
  }, [])

  useEffect(() => {
    if (generalCount) {
      setStats({
        totalAppointments: generalCount.appointmentCount || 0,
        pendingAppointments: generalCount.appointmentCount || 0,
        completedAppointments: 0,
        availableDoctors: generalCount.doctorCount || 0
      });
    }
  }, [generalCount]);


  useEffect(() => {
    fetchDashboardData();
    returnCount();
  }, []);


  const returnCount = async () => {
    try {
      if (!user) {
        showToast("user data seems to be tampered with", "error")
        navigate("/")
        return;

      }
      const patientData = { "patientId": user.id }
      const response = await makeAuthenticatedRequest("returnGeneralCount", "doc", patientData);
      const data = response
      if (data?.returnCode !== 0) {
        showToast(data?.returnMessage, "error")
        console.log(data?.returnMessage)
        return;
      }
      const count = data?.returnObject || []
      // console.log(generalCount)
      // console.log(data)
      setGeneralCount(count)
    } catch (error) {
      console.error(error)
      showToast(error.message, "error")

    }

  }



  const fetchDashboardData = async () => {
    try {
      if (!user) {
        showToast("user data seems to be tampered with", "error")
        navigate("/")
        return;

      }
      const patientId = { "patientId": user.id }
      const response = await makeAuthenticatedRequest("displayPatientAppointments", "appointment", patientId)
      // console.log("this is the recent appintment")
      // console.log(response)

      const patientAppointments = response?.returnObject || []
      patientAppointments.reverse();

      const newAppointments = patientAppointments.slice(0, 3)

      setRecentAppointments(newAppointments)
      console.log("these are the recent appointment")
      console.log(newAppointments)
    } catch (error) {
      console.error(error)
      showToast(error.message, "error")
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-gradient-to-br from-[#1A2234]/80 to-[#0F1419]/80 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );


  return (
    <div className="space-y-6">
      <div className="bg-blue-500 py-16 px-8 rounded">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-shrink-0">
            <img
              src={nextDoc}
              alt="Doctor with telemedicine screen"
              className="w-80 h-auto"
            />
          </div>

          <div className="text-white text-center md:text-left">
            <p className="text-3xl font-semibold mb-4">
              Leading High Quality<br />
              Virtual Health Platform
            </p>
            <p className="text-lg opacity-95">
              Ready to book your appointment with the top doctors in the country, {user.lastName}?
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Total Appointments"
          value={stats.totalAppointments}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={Clock}
          title="pending"
          value={stats.pendingAppointments}
          color="bg-yellow-500/20"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completedAppointments}
          color="bg-green-500/20"
        />
        <StatCard
          icon={Users}
          title="Available Doctors"
          value={stats.availableDoctors}
          color="bg-purple-500/20"
        />
      </div>

      <div className="bg-gradient-to-br from-[#1A2234]/80 to-[#0F1419]/80 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Appointments</h2>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No appointments scheduled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Doctor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Specialty</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((data) => (
                  <tr key={data.appointment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{data.appointment.doctorName}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{data.appointment.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{data.appointment.scheduledDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{data.appointment.scheduledTime}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        {data.appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;