'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { scheduleApi } from '@/services/scheduleApi';
import { Schedule } from '@/types/schedule';
import { format } from 'date-fns';
import { Calendar, Clock, User, Activity, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const ScheduleSkeleton = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start gap-6 animate-pulse">
        <div className="space-y-4 flex-1">
          <div className="pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-gray-200 rounded"/>
              <div className="h-6 bg-gray-200 rounded w-1/3"/>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"/>
              <div className="h-5 bg-gray-200 rounded w-1/4"/>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"/>
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"/>
                <div className="h-5 bg-gray-200 rounded w-32 mb-1"/>
                <div className="h-4 bg-gray-200 rounded w-24"/>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"/>
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"/>
                <div className="h-6 bg-gray-200 rounded w-20"/>
              </div>
            </div>
          </div>
        </div>
        <div className="w-28 h-12 bg-gray-200 rounded-lg"/>
      </div>
    </div>
  );
};

const PatientRoomsPage = () => {
  const [bookedSchedules, setBookedSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.slice(0, 5).split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  useEffect(() => {
    const fetchBookedSchedules = async () => {
      try {
        const schedules = await scheduleApi.getPatientBookedSchedules();
        setBookedSchedules(schedules);
      } catch (error) {
        console.error('Failed to fetch booked schedules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSchedules();
  }, []);

  const handleJoinRoom = (roomId: string) => {
    router.push(`/patient/consultations/rooms/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto p-6">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"/>
            <div className="h-6 bg-gray-200 rounded w-1/2"/>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <ScheduleSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Consultation Schedule
          </h2>
          <p className="text-gray-600 text-lg">
            View and join your upcoming medical consultations
          </p>
        </motion.div>
        
        <div className="space-y-6">
          {bookedSchedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex justify-between items-start gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <p className="text-xl font-semibold">
                          {formatDate(schedule.attributes.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <p className="text-lg">
                          {formatTime(schedule.attributes.start_time)} - {formatTime(schedule.attributes.end_time)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Doctor</p>
                          <p className="font-medium text-gray-900">{schedule.attributes.doctor.attributes.name}</p>
                          <p className="text-sm text-gray-500">{schedule.attributes.doctor.attributes.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`${getStatusColor(schedule.attributes.status)} px-3 py-1 rounded-full text-sm font-medium capitalize inline-block mt-1`}>
                            {schedule.attributes.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinRoom(schedule.attributes.room)}
                    className="px-6 py-3 bg-[#ABF600] text-[#1A202C] rounded-lg hover:bg-[#9DE100] transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center gap-2 group-hover:scale-105"
                  >
                    <Video className="w-4 h-4" />
                    Join Call
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {bookedSchedules.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No scheduled consultations found</p>
              <p className="text-gray-500">Your upcoming consultations will appear here</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRoomsPage;