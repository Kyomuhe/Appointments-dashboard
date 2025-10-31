import { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { makeAuthenticatedRequest, showToast } from "../utils/util";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    displayAppointments();
  }, []);

  const displayAppointments = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest("displayUsers","administrator", {});
      console.log(response)

      if(response?.returnCode !== 0){
        showToast(response?.returnMessage, "error")
        return;
      }
      setUsers(response.returnObject.reverse() || []);


    } catch (error) {
      console.error('Error loading appointments:', error);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400">Registered users</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-[#1A2234]/50 rounded-lg border border-white/10">
          <div className="bg-blue-500/10 p-6 rounded-full mb-6">
            <Calendar className="w-16 h-16 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No users Yet</h2>
          <p className="text-gray-400 text-center max-w-md">
            Oops no one has Registered with nextDoc yet.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1A2234]/50 rounded-lg border border-white/10 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-500 dark:bg-[#0F1419]/50 border-b border-white/10">
                <tr>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    userName
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {users.map((data) => (
                  <tr key={data.id} className="hover:bg-white/5 transition-colors">
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center gap-2 text-white">
                        <User className="w-4 h-4 text-gray-900 dark:text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">{data.firstName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{data.lastName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <span className='text-gray-700 dark:text-gray-300'>{data.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-300 max-w-xs">
                        <span className="line-clamp-2 text-gray-700 dark:text-gray-300">{data.username}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;