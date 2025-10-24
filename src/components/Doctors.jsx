import {showToast , makeAuthenticatedRequest} from "../utils/util"
import { useState, useEffect } from "react"
import { Star, Clock, DollarSign } from "lucide-react"
import avatar from '../assets/doctor1.png'
import BookAppointmentModal from "../models/Appointment"

const Doctors = () => {
    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(doctors[0])
    const [selectedSpecialty, setSelectedSpecialty] = useState('All')
    const [filteredDoctors, setFilteredDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAppointmentModalOpen, setAppointmentModal] = useState(false);
    


    useEffect(() => {
        displayDoctors()
    }, [])

    useEffect(() => {
        filterDoctors()
    }, [doctors, selectedSpecialty])

    const displayDoctors = async () => {
        try {
            setLoading(true)
            const response = await makeAuthenticatedRequest("displayDoctors", "doc", {})
            const data = response
            console.log(JSON.stringify(data))

            if (data?.returnCode !== 0) {
                const errorMessage = data?.returnMessage || 'Failed to fetch doctors'
                showToast(`${errorMessage}`, 'error')
                console.error(errorMessage)
                return;
            }

            const doctorsList = data?.returnObject || []
            console.log("this is the doctor list")
            console.log(doctorsList)
            setDoctors(doctorsList)


            if (doctorsList.length > 0) {
                setSelectedDoctor(doctorsList[0])
            }
        } catch (error) {
            console.error("Error fetching doctors:", error)
            showToast("Error loading doctors", 'error')
        } finally {
            setLoading(false)
        }
    }

    const filterDoctors = () => {
        let filtered = doctors

        if (selectedSpecialty !== 'All') {
            filtered = filtered.filter(doc => doc.specialty === selectedSpecialty)
        }

        setFilteredDoctors(filtered)
    }

    const specialties = ['All', ...new Set(doctors.map(doc => doc.specialty))]

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {specialties.map(specialty => (
                    <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                            selectedSpecialty === specialty
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                    >
                        {specialty}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-400">Loading doctors...</div>
                </div>
            ) : (
                <div className="flex gap-6 flex-1 overflow-hidden">
                    <div className="w-80 flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-3">Choose Doctor</h3>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {filteredDoctors.map(doctor => (
                                <button
                                    key={doctor.id}
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className={`w-full text-left p-3 rounded-lg transition-all ${
                                        selectedDoctor?.id === doctor.id
                                            ? 'bg-blue-600/20 border border-blue-500/50'
                                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <img 
                                            src={avatar} 
                                            alt={doctor.name} 
                                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white text-sm truncate">{doctor.name}</h4>
                                            <p className="text-xs text-blue-400">{doctor.specialty}</p>
                                            <p className="text-xs text-gray-500 mt-1">{doctor.fee}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedDoctor && (
                        <div className="flex-1 overflow-y-auto">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
                                    <div className="flex gap-4">
                                        <img 
                                            src={avatar} 
                                            alt={selectedDoctor.name} 
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{selectedDoctor.name}</h2>
                                            <p className="text-blue-400 text-sm font-medium">{selectedDoctor.specialty}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs text-gray-400">4.8 • {selectedDoctor.experience}y experience</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                    onClick = {
                                        () => {
                                        setAppointmentModal(!isAppointmentModalOpen);
                                        setSelectedDoctor(selectedDoctor);
                                        //setSelectedDoctor(selectedDoctor.name)
                                        // setSelectedDoctor(selectedDoctor.id)
                                        }
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                                        Make an Appointment
                                    </button>
                                </div>


                                <div className="mb-5 pb-5 border-b border-white/10">
                                    <p className="text-xs text-gray-400 font-semibold mb-1">EDUCATION</p>
                                    <p className="text-sm text-white">{selectedDoctor.education}</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-cyan-400" />
                                            <p className="text-xs text-gray-400 font-semibold">AVAILABILITY</p>
                                        </div>
                                        <p className="text-sm text-white ml-6">{selectedDoctor.availability}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <DollarSign className="w-4 h-4 text-cyan-400" />
                                            <p className="text-xs text-gray-400 font-semibold">CONSULTATION FEE</p>
                                        </div>
                                        <p className="text-sm text-white ml-6">{selectedDoctor.fee}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold mb-1">SERVICES</p>
                                        <p className="text-sm text-white">{selectedDoctor.services}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )
            }
            <BookAppointmentModal
            isOpen={isAppointmentModalOpen}
            onClose = {() => setAppointmentModal(false)}
            doctor = {selectedDoctor}
            updateTitle={`Booking with ${selectedDoctor?.name || " "}`}
            buttonTitle = "Book Appointment"
            
           // DoctorName = {selectedDoctor}
            
            />

        </div>
    )
}

export default Doctors