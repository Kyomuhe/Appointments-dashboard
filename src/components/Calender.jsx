import { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { makeAuthenticatedRequest } from '../utils/util'

const MyCalendar = () => {
    const [appointments, setAppointments] = useState([])
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem('user'));
    }, [])

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            const patientData = { "patientId": user.id }
            console.log("this is the user id")
            console.log(patientData)
            const response = await makeAuthenticatedRequest("displayPatientAppointments", "appointment", patientData);
            console.log(response)
            const userAppointments = response?.returnObject || []
            setAppointments(userAppointments)
        } catch (error) {
            console.error(error)
        }
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(moment(currentMonth).subtract(1, 'month').toDate())
    }

    const goToNextMonth = () => {
        setCurrentMonth(moment(currentMonth).add(1, 'month').toDate())
    }

    const goToToday = () => {
        setCurrentMonth(new Date())
    }

    const getAppointmentsForDate = date => {
        return appointments.filter(apt =>
            moment(apt.appointment.scheduledDate).isSame(date, 'day')
        )
    }

    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-amber-500',
        'bg-pink-500',
        'bg-cyan-500'
    ]

    return (
        <div className="h-screen">
            <div className="h-full max-w-7xl flex flex-col ">
                <div className="bg-gradient-to-r from-[#1A2234]/80 to-[#2A3444]/80 border-b border-white/10 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-white">
                                {moment(currentMonth).format('MMMM YYYY')}
                            </h1>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Today
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-300" />
                            </button>
                            <button
                                onClick={goToNextMonth}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-[#0F1620]/40">
                    <div className="h-full flex flex-col">
                        <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                <div key={i} className="text-center py-4 text-sm font-semibold text-gray-300 border-r border-white/10 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
                            {Array.from({ length: 42 }, (_, i) => {
                                const start = moment(currentMonth).startOf('month').startOf('week')
                                const day = moment(start).add(i, 'days')
                                const isCurrentMonth = day.month() === moment(currentMonth).month()
                                const isToday = day.isSame(new Date(), 'day')
                                const dayAppointments = getAppointmentsForDate(day)

                                return (
                                    <div
                                        key={i}
                                        className={`border-r border-b border-white/10 p-2 min-h-[120px] ${!isCurrentMonth ? 'bg-white/5' : 'bg-[#1A2234]/40'
                                            }`}
                                    >
                                        <div className={`text-sm font-medium mb-2 ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-300'
                                            } ${isToday ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center' : ''}`}>
                                            {day.date()}
                                        </div>

                                        <div className="space-y-1">
                                            {dayAppointments.map((apt, idx) => (
                                                <div
                                                    key={apt.id}
                                                    className={`${colors[idx % colors.length]} text-white text-xs px-2 py-1 rounded-md cursor-pointer hover:opacity-90 transition-opacity`}
                                                    title={`${apt.appointment.doctorName} - ${apt.appointment.scheduledTime}`}
                                                >
                                                    <div className="font-medium truncate">{apt.appointment.doctorName}</div>
                                                    <div className="text-xs opacity-90 truncate">{apt.appointment.scheduledTime}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyCalendar