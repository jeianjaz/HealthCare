'use client';

import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { Plus, Clock, Calendar as CalendarIcon, Users, Clock3, Activity, BarChart2 } from 'lucide-react';
import { Schedule } from '@/types/schedule';
import { motion, AnimatePresence } from 'framer-motion';
import { AddTimeSlotModal } from '@/components/Modals/Consultation/AddTimeSlotModal';
import { BlockTimeModal } from '@/components/Modals/Consultation/BlockTimeModal';
import { scheduleApi } from '@/services/scheduleApi';
import { useRouter } from 'next/navigation';
import BackgroundElements from '@/components/BackgroundElements';

export default function ConsultationsPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showBlockTime, setShowBlockTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const DefaultLimit = 10;
  const [dailyLimit, setDailyLimit] = useState(DefaultLimit);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = await scheduleApi.getSchedules();
      setSchedules(schedules);
    };
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const response = await scheduleApi.getSchedules();
      // Handle the nested data structure
      setSchedules(response.data || []);
    } catch (err) {
      setError('Failed to fetch schedules');
      setSchedules([]);
    } finally {
      setIsLoading(false);
    } 
  };

  const handleAddTimeSlot = () => {
    setShowAddSlot(true);
  };

  const handleBlockTime = () => {
    setShowBlockTime(true);
  };

  const handleAddSlotSubmit = async (data: {
    slots: Array<{
      startTime: string;
      endTime: string;
      slotDuration: number;
      breakTime: number;
    }>;
    recurring: boolean;
    days: string[];
    slotType: string;
    recurringPattern: string;
    recurringInterval: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const promises = data.slots.map(slot =>
        scheduleApi.addTimeSlot({
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: slot.startTime,
          endTime: slot.endTime,
          recurring: data.recurring,
          days: data.recurring ? data.days : undefined,
        })
      );

      await Promise.all(promises);
      await fetchSchedules();
      setShowAddSlot(false);
    } catch (err) {
      setError('Failed to add time slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockTimeSubmit = async (data: { 
    startDate: Date; 
    endDate: Date; 
    reason: string 
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      await scheduleApi.blockTime({
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd'),
        reason: data.reason
      });

      await fetchSchedules(); // Refresh schedules
      setShowBlockTime(false);
    } catch (err) {
      setError('Failed to block time');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (slotId: string) => {
    try {
      // Make an API call to delete the time slot
      await scheduleApi.deleteTimeSlot(slotId);
      
      // Update the state to remove the deleted slot
      setSchedules(prevSchedules => prevSchedules.filter(slot => slot.id !== slotId));
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  const confirmDelete = (slotId: string) => {
    setSlotToDelete(slotId);
  };

  const cancelDelete = () => {
    setSlotToDelete(null);
  };

  const executeDelete = async () => {
    if (slotToDelete) {
      await handleDeleteTimeSlot(slotToDelete);
      setSlotToDelete(null);
    }
  };

  // Add this function to calculate the minimum allowed date (3 days from now)
  const getMinimumAllowedDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3); // Add 3 days to current date
    return minDate;
  };

  // Fix calendar click handling
  const handleDateChange = (value: Date | null) => {
    if (value instanceof Date) {
      const minAllowedDate = getMinimumAllowedDate();
      if (value < minAllowedDate) {
        setError('Please select a date at least 3 days from today');
        return;
      }
      setError(null);
      setSelectedDate(value);
      
      // Optionally refresh schedules when date changes
      fetchSchedules();
    }
  };

  const getExistingSlotCount = (date: Date) => {
    return schedules.filter(s => 
      s.attributes.date === format(date, 'yyyy-MM-dd')
    ).length;
  };

  return (
    <>
      <div className="flex items-center justify-end gap-4 mb-8">
        {/* Remove the back button and title since they're in the layout */}
        <div className="flex items-center gap-2">
          <label htmlFor="dailyLimit" className="text-sm font-medium text-gray-600">
            Daily Limit:
          </label>
          <input
            id="dailyLimit"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-2 py-1 border rounded-lg text-center focus:ring-2 focus:ring-[#ABF600] focus:border-[#ABF600]"
            min="1"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddTimeSlot}
          className="flex items-center gap-2 bg-[#ABF600] text-[#1A202C] px-4 py-2 rounded-xl hover:bg-[#9DE100] transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Time Slot</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBlockTime}
          className="flex items-center gap-2 bg-[#F3F3F3] text-[#1A202C] px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
        >
          <Clock className="w-5 h-5" />
          <span>Block Time Off</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AddTimeSlotModal
        isOpen={showAddSlot}
        onClose={() => setShowAddSlot(false)}
        onSubmit={handleAddSlotSubmit}
        selectedDate={selectedDate}
        isLoading={isLoading}
        dailyLimit={dailyLimit}
        existingSlots={getExistingSlotCount(selectedDate)}
      />
      
      <BlockTimeModal
        isOpen={showBlockTime}
        onClose={() => setShowBlockTime(false)}
        onSubmit={handleBlockTimeSubmit}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-12 gap-8">
        {/* Time Slots Section - Moved to top */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CalendarIcon className="w-6 h-6 text-[#1A202C]" />
            <h3 className="text-xl font-bold text-[#1A202C]">
              Schedule for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {Array.isArray(schedules) && schedules
                .filter(s => s.attributes.date === format(selectedDate, 'yyyy-MM-dd'))
                .map((schedule, index) => (
                  <motion.div 
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                      schedule.attributes.status === 'booked' 
                        ? 'bg-blue-50 hover:bg-blue-100' 
                        : schedule.attributes.status === 'blocked'
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Clock3 className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">
                          {schedule.attributes.start_time} - {schedule.attributes.end_time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`capitalize px-4 py-1 rounded-full text-sm font-medium ${
                          schedule.attributes.status === 'booked' 
                            ? 'bg-blue-200 text-blue-800' 
                            : schedule.attributes.status === 'blocked'
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {schedule.attributes.status}
                        </span>
                        {schedule.attributes.patient && (
                          <span className="text-sm text-gray-600">
                            Patient: {schedule.attributes.patient.attributes.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Confirmation Dialog */}
          {slotToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                <p className="mb-6">Are you sure you want to delete this time slot?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Calendar and Stats Section */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7">
              <div className="w-full bg-white rounded-lg p-5 shadow-sm">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={getMinimumAllowedDate()}
                  tileDisabled={({ date }) => date < getMinimumAllowedDate()}
                  tileClassName={({ date }) => {
                    const hasAppointments = schedules?.some(
                      (schedule) =>
                        new Date(schedule.attributes.date).toDateString() === date.toDateString()
                    );
                    const isDisabled = date < getMinimumAllowedDate();
                    return `${hasAppointments ? 'has-appointments' : ''} ${isDisabled ? 'disabled-date' : ''}`;
                  }}
                  className="max-w-[400px] mx-auto"
                />
              </div>
            </div>

            {/* Upcoming Consultations Section */}
            <div className="col-span-12 md:col-span-5">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="text-base font-semibold mb-3 text-gray-800">Upcoming Consultations</h3>
                <div className="space-y-2">
                  {schedules?.filter(schedule => 
                    new Date(schedule.attributes.date) >= new Date()
                  ).slice(0, 5).map((schedule) => (
                    <div 
                      key={schedule.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-[#ABF600] bg-opacity-20 p-1.5 rounded-lg">
                          <CalendarIcon className="w-4 h-4 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">
                            {format(new Date(schedule.attributes.date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-gray-600">
                            {schedule.attributes.start_time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-800">
                          {schedule.attributes.status === 'booked' ? 'Patient Scheduled' : 'No Patient'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {schedule.attributes.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-3 space-y-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-[#1A202C] mb-6">Weekly Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F3F3F3] rounded-xl">
                <div className="flex items-center space-x-3">
                  <BarChart2 className="w-5 h-5 text-[#1A202C]" />
                  <span className="text-gray-700">Total Consultations</span>
                </div>
                <span className="font-bold text-lg text-[#1A202C]">32</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-[#1A202C] mb-6">Today's Overview</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#ABF600]/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-[#ABF600]" />
                    <span className="text-gray-700">Total Slots</span>
                  </div>
                  <span className="font-bold text-lg text-[#1A202C]">
                    {schedules.filter(s => s.attributes.date === format(new Date(), 'yyyy-MM-dd')).length}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Booked</span>
                  </div>
                  <span className="font-bold text-lg text-[#1A202C]">
                    {schedules.filter(s => 
                      s.attributes.date === format(new Date(), 'yyyy-MM-dd') && 
                      s.attributes.status === 'booked'
                    ).length}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock3 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Available</span>
                  </div>
                  <span className="font-bold text-lg text-[#1A202C]">
                    {schedules.filter(s => 
                      s.attributes.date === format(new Date(), 'yyyy-MM-dd') && 
                      s.attributes.status === 'available'
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}