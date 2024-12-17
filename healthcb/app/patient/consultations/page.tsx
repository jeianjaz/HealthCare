"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfToday, isToday, isPast } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { 
  Calendar as CalendarIcon, Clock,
  MessageCircle, Phone, X,
  ArrowLeft, Stethoscope, Clock2, Clock3, Activity,
  Calendar as CalendarIcon2, CheckCircle2, AlertCircle, Check
} from 'lucide-react';
import BackgroundElements from '@/components/BackgroundElements';
import withPatientAuth from '@/components/withPatientAuth';
import { scheduleApi } from '@/services/scheduleApi';
import { consultationApi } from '@/services/consultationApi';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Slot = {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  doctorId: string;
  doctorName: string;
  room: string;
};

type ConsultationRequest = {
  symptoms: string;
  duration: string;
  additionalNotes: string;
};

const commonSymptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Sore throat",
  "Body aches",
  "Fatigue",
  "Shortness of breath",
  "Nausea",
  "Dizziness",
  "Chest pain",
  "Back pain",
  "Stomach pain",
  "Allergies",
  "Skin rash",
  "Other (please specify)"
];

const symptomDurations = [
  "Less than 24 hours",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "More than a month",
  "Other (please specify)"
];

function Consultations() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [consultationData, setConsultationData] = useState<ConsultationRequest>({
    symptoms: '',
    duration: '',
    additionalNotes: ''
  });
  const [upcomingConsultation, setUpcomingConsultation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAvailableSlots(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const fetchUpcomingConsultation = async () => {
      try {
        setIsLoading(true);
        const patientId = localStorage.getItem('user_id');
        if (patientId) {
          const consultation = await consultationApi.getUpcomingConsultation(patientId);
          setUpcomingConsultation(consultation);
        }
      } catch (error) {
        console.error('Failed to fetch upcoming consultation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingConsultation();
  }, []);

  const fetchAvailableSlots = async (date: Date) => {
    try {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const response = await scheduleApi.getAvailableSlots(localDate);
      
      if (response?.data && Array.isArray(response.data)) {
        setAvailableSlots(response.data.map((slot: any) => ({
          id: slot.id,
          time: `${slot.attributes.start_time} - ${slot.attributes.end_time}`,
          startTime: slot.attributes.start_time,
          endTime: slot.attributes.end_time,
          doctorId: slot.attributes.doctor.id,
          doctorName: slot.attributes.doctor.attributes.name,
          room: slot.attributes.room
        })));
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleDateSelect = (value: Date | null) => {
    if (value) {
      setSelectedDate(value);
      setSelectedSlot("");
    }
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot.id);
    setShowRequestForm(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const patientId = localStorage.getItem('user_id');
    const selectedSlotData = availableSlots.find(slot => slot.id === selectedSlot);

    if (!patientId || !selectedSlotData) {
      console.error('Missing required data');
      return;
    }

    try {
      const response = await consultationApi.createRequest({
        patient: patientId,
        doctor: selectedSlotData.doctorId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: selectedSlotData.startTime,
        end_time: selectedSlotData.endTime,
        symptoms: consultationData.symptoms,
        duration: consultationData.duration,
        additional_notes: consultationData.additionalNotes,
      });
      console.log('Consultation request submitted:', response);
      setShowRequestForm(false);
    } catch (error) {
      console.error('Failed to submit consultation request:', error);
    }
  };

  const formatTimeWithAMPM = (time: string) => {
    const [hours, minutes] = time.slice(0, 5).split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="container mx-auto relative z-10">
      {/* Booking Steps */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-[#1A202C] mb-8">Book Your Consultation</h2>
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-[#ABF600] -translate-y-1/2"
            initial={{ width: "0%" }}
            animate={{ 
              width: !selectedDate ? "0%" : !selectedSlot ? "50%" : "100%" 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Steps */}
          <div className="relative grid grid-cols-3 gap-4">
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4
                transition-all duration-300 relative
                ${!selectedDate 
                  ? 'bg-[#ABF600] text-[#1A202C] shadow-lg shadow-[#ABF600]/20' 
                  : 'bg-[#1A202C] text-white'
                }
              `}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  1
                </motion.span>
                {selectedDate && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 w-6 h-6 bg-[#ABF600] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-[#1A202C]" />
                  </motion.div>
                )}
              </div>
              <p className={`font-medium text-center transition-colors duration-300 ${!selectedDate ? 'text-[#1A202C]' : 'text-gray-400'}`}>
                Select Date
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4
                transition-all duration-300 relative
                ${selectedDate && !selectedSlot 
                  ? 'bg-[#ABF600] text-[#1A202C] shadow-lg shadow-[#ABF600]/20' 
                  : selectedSlot 
                    ? 'bg-[#1A202C] text-white'
                    : 'bg-gray-100 text-gray-400'
                }
              `}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  2
                </motion.span>
                {selectedSlot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 w-6 h-6 bg-[#ABF600] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-[#1A202C]" />
                  </motion.div>
                )}
              </div>
              <p className={`font-medium text-center transition-colors duration-300 ${selectedDate && !selectedSlot ? 'text-[#1A202C]' : 'text-gray-400'}`}>
                Choose Time
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4
                transition-all duration-300 relative
                ${selectedSlot 
                  ? 'bg-[#ABF600] text-[#1A202C] shadow-lg shadow-[#ABF600]/20' 
                  : 'bg-gray-100 text-gray-400'
                }
              `}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  3
                </motion.span>
              </div>
              <p className={`font-medium text-center transition-colors duration-300 ${selectedSlot ? 'text-[#1A202C]' : 'text-gray-400'}`}>
                Confirm Details
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Calendar and Slots Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#1A202C]">Select Date</h2>
              <CalendarIcon className="w-6 h-6 text-[#ABF600]" />
            </div>
            <Calendar
              onChange={handleDateSelect}
              value={selectedDate}
              minDate={startOfToday()}
              className="w-full"
              tileDisabled={({ date }) => date < startOfToday()}
            />
          </div>

          {/* Available Slots Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#1A202C]">Available Slots</h2>
              <Clock className="w-6 h-6 text-[#ABF600]" />
            </div>
            {availableSlots.length > 0 ? (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedSlot === slot.id
                        ? 'border-[#ABF600] bg-[#ABF600]/10'
                        : 'border-gray-200 hover:border-[#ABF600]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {formatTimeWithAMPM(slot.startTime)} - {formatTimeWithAMPM(slot.endTime)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Doctor: {slot.doctorName}</p>
                      <p>Room: {slot.room}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No available slots for this date.</p>
                <p className="text-sm mt-2">Please select another date.</p>
              </div>
            )}
          </div>
        </div>

        {/* Consultation Info */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#1A202C] mb-6">Consultation Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#ABF600]/10 via-[#ABF600]/5 to-transparent rounded-lg border border-[#ABF600]/20">
              <div className="p-3 bg-[#ABF600]/20 rounded-lg">
                <Clock3 className="w-6 h-6 text-[#1A202C]" />
              </div>
              <div>
                <p className="font-bold text-[#1A202C] text-lg">Duration</p>
                <p className="text-gray-600">30 minutes per session</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#ABF600]/10 via-[#ABF600]/5 to-transparent rounded-lg border border-[#ABF600]/20">
              <div className="p-3 bg-[#ABF600]/20 rounded-lg">
                <Activity className="w-6 h-6 text-[#1A202C]" />
              </div>
              <div>
                <p className="font-bold text-[#1A202C] text-lg">Availability</p>
                <p className="text-gray-600">
                  <span className="font-bold text-[#1A202C]">{availableSlots.length} slots</span> available for <span className="font-bold text-[#1A202C]">{format(selectedDate, 'MMM d, yyyy')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Consultation Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-[#1A202C] mb-4 flex items-center gap-2">
          <CalendarIcon2 className="w-6 h-6 text-[#ABF600]" />
          Next Consultation
        </h2>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : upcomingConsultation ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#ABF600]/10 via-[#ABF600]/5 to-transparent rounded-lg border border-[#ABF600]/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="font-semibold text-[#1A202C]">Scheduled</p>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <CalendarIcon className="w-4 h-4" />
                {format(new Date(upcomingConsultation.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {upcomingConsultation.start_time}
              </p>
            </div>
            <button 
              onClick={() => router.push('/patient/consultation/' + upcomingConsultation.id)}
              className="w-full py-2 px-4 bg-[#ABF600] text-[#1A202C] rounded-lg font-medium hover:bg-[#9EE500] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              View Details
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">No upcoming consultations</p>
            <p className="text-sm text-gray-500 mt-1">Schedule one below</p>
          </div>
        )}
      </div>

      {/* Consultation Request Form Popup */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Request Consultation</h3>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What symptoms are you experiencing?
                  </label>
                  <select
                    value={consultationData.symptoms}
                    onChange={(e) => setConsultationData({
                      ...consultationData,
                      symptoms: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABF600] focus:border-transparent bg-[#F9FAFB] text-gray-600"
                    required
                  >
                    <option value="">Select symptoms</option>
                    {commonSymptoms.map((symptom) => (
                      <option key={symptom} value={symptom}>{symptom}</option>
                    ))}
                  </select>
                  {consultationData.symptoms === "Other (please specify)" && (
                    <input
                      type="text"
                      placeholder="Please specify your symptoms"
                      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABF600] focus:border-transparent bg-[#F9FAFB] text-gray-600 placeholder-gray-400"
                      onChange={(e) => setConsultationData({
                        ...consultationData,
                        symptoms: e.target.value
                      })}
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How long have you had these symptoms?
                  </label>
                  <select
                    value={consultationData.duration}
                    onChange={(e) => setConsultationData({
                      ...consultationData,
                      duration: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABF600] focus:border-transparent bg-[#F9FAFB] text-gray-600"
                    required
                  >
                    <option value="">Select duration</option>
                    {symptomDurations.map((duration) => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                  {consultationData.duration === "Other (please specify)" && (
                    <input
                      type="text"
                      placeholder="Please specify the duration"
                      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABF600] focus:border-transparent bg-[#F9FAFB] text-gray-600 placeholder-gray-400"
                      onChange={(e) => setConsultationData({
                        ...consultationData,
                        duration: e.target.value
                      })}
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={consultationData.additionalNotes}
                    onChange={(e) => setConsultationData({
                      ...consultationData,
                      additionalNotes: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ABF600] focus:border-transparent bg-[#F9FAFB] text-gray-600 placeholder-gray-400 h-32 resize-none"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#ABF600] text-[#1A202C] rounded-lg hover:bg-[#9DE100] transition-colors font-medium"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default withPatientAuth(Consultations);