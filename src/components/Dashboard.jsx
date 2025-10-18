import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    availableDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =  () => {
      
      setStats({
        totalAppointments: 12,
        upcomingAppointments: 3,
        completedAppointments: 9,
        availableDoctors: 15
      });

      setRecentAppointments([
        {
          id: 1,
          doctorName: 'Dr. John Smith',
          specialty: 'Cardiologist',
          date: '2025-10-20',
          time: '10:00 AM',
          status: 'Scheduled'
        },
        {
          id: 2,
          doctorName: 'Dr. Sarah Johnson',
          specialty: 'Dermatologist',
          date: '2025-10-22',
          time: '02:00 PM',
          status: 'Scheduled'
        },
        {
          id: 3,
          doctorName: 'Dr. Mike Wilson',
          specialty: 'General Practitioner',
          date: '2025-10-25',
          time: '11:30 AM',
          status: 'Confirmed'
        }
      ]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Total Appointments"
          value={stats.totalAppointments}
          color="bg-blue-500/20"
        />
        <StatCard
          icon={Clock}
          title="Upcoming"
          value={stats.upcomingAppointments}
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
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{appointment.doctorName}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{appointment.specialty}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{appointment.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{appointment.time}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        {appointment.status}
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