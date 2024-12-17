'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, UserCheck, UserX, Clock, Search, Calendar as CalendarIcon, Filter, AlertCircle, X } from 'lucide-react';
import { consultationApi, ConsultationRequest } from '@/services/consultationApi';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar.css';

type Value = Date | null;
type FilterType = 'status' | 'date' | 'search';
type StatusType = 'all' | 'pending' | 'accepted' | 'rejected';

interface ActiveFilter {
  type: FilterType;
  label: string;
  color: string;
}

export default function ConsultationRequestsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('all');
  const [selectedDate, setSelectedDate] = useState<Value>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchRequests(null);
  }, []);

  const fetchRequests = async (date: Date | null) => {
    try {
      setLoading(true);
      const data = await consultationApi.getRequests(date || undefined);
      setRequests(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      await consultationApi.updateRequestStatus(id, status);
      await fetchRequests(selectedDate || null);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update request status');
      }
    } finally {
      setLoading(false);
    }
  };

    const handleDateSelect = (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setShowCalendar(false);
      fetchRequests(value);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedDate(null);
    fetchRequests(null);
  };

  const removeFilter = async (filterType: FilterType) => {
    switch (filterType) {
      case 'status':
        setSelectedStatus('all');
        break;
      case 'date':
        setSelectedDate(null);
        fetchRequests(null); // Fetch all requests without date filter
        break;
      case 'search':
        setSearchQuery('');
        break;
    }
  };

  // Memoized filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Status filter
      if (selectedStatus !== 'all' && request.attributes.status !== selectedStatus) {
        return false;
      }

      if (selectedDate) {
        const requestDate = new Date(request.attributes.date);
        if (isNaN(requestDate.getTime()) || format(requestDate, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')) {
          return false;
        }
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const patientName = `${request.attributes.relationships.patient.attributes.first_name} ${request.attributes.relationships.patient.attributes.last_name}`.toLowerCase();
        const patientEmail = request.attributes.relationships.patient.attributes.email.toLowerCase();
        return (
          patientName.includes(searchLower) ||
          patientEmail.includes(searchLower) ||
          request.attributes.symptoms.toLowerCase().includes(searchLower) ||
          (request.attributes.additional_notes && request.attributes.additional_notes.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [requests, selectedStatus, selectedDate, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Active filters display
  const activeFilters = (): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];
    
    if (selectedStatus !== 'all') {
      filters.push({
        type: 'status' as FilterType,
        label: `Status: ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`,
        color: getStatusColor(selectedStatus)
      });
    }
    
    if (selectedDate) {
      filters.push({
        type: 'date' as FilterType,
        label: `Date: ${format(selectedDate, 'MMM d, yyyy')}`,
        color: 'bg-blue-100 text-blue-800'
      });
    }
    
    if (searchQuery) {
      filters.push({
        type: 'search' as FilterType,
        label: `Search: ${searchQuery}`,
        color: 'bg-purple-100 text-purple-800'
      });
    }
    
    return filters;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      className="max-w-[2000px] mx-auto px-6 py-8 space-y-8 min-h-screen bg-gradient-to-br from-gray-50 to-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#ABF600] bg-opacity-20 rounded-xl">
            <ClipboardList className="w-8 h-8 text-[#1A202C]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Consultation Requests</h1>
            <p className="text-gray-500 mt-1">Manage and track patient consultation requests</p>
          </div>
        </div>
        <motion.div 
          className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100"
          animate={pulseAnimation}
        >
          <div className="text-sm text-gray-500">
            Total Requests: <span className="font-semibold text-[#1A202C]">{requests.length}</span>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={itemVariants}
      >
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-yellow-100 rounded-xl">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Clock className="w-8 h-8 text-yellow-600" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Pending</h3>
              <motion.p 
                className="text-3xl font-bold text-[#1A202C]"
                animate={pulseAnimation}
              >
                {requests.filter(r => r.attributes.status === 'pending').length}
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-green-100 rounded-xl">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Accepted</h3>
              <p className="text-3xl font-bold text-[#1A202C]">
                {requests.filter(r => r.attributes.status === 'accepted').length}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-red-100 rounded-xl">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Rejected</h3>
              <p className="text-3xl font-bold text-[#1A202C]">
                {requests.filter(r => r.attributes.status === 'rejected').length}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Active Filters */}
      {activeFilters().length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-3 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeFilters().map((filter, index) => (
            <motion.div
              key={filter.type}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${filter.color}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-sm font-medium">{filter.label}</span>
              <button
                onClick={() => removeFilter(filter.type)}
                className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          
          {activeFilters().length > 1 && (
            <motion.button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4" />
              Clear all filters
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div 
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        variants={itemVariants}
      >
        <div className="flex flex-wrap gap-6 items-center">
          <motion.div 
            className="relative flex-1 min-w-[240px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </motion.div>
            <input
              type="text"
              placeholder="Search by patient name, email, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#ABF600] focus:border-[#ABF600] bg-gray-50 text-gray-900 transition-all duration-300"
            />
          </motion.div>
          
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-3 pl-12 pr-6 py-3 border rounded-xl focus:ring-2 focus:ring-[#ABF600] focus:border-[#ABF600] bg-gray-50 relative min-w-[200px]"
            >
              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <span className="text-gray-900 font-medium">
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select date'}
              </span>
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-xl shadow-xl p-4 border border-gray-100"
                >
                  <Calendar
                    onChange={handleDateSelect}
                    value={selectedDate}
                    className="border-0 rounded-xl"
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
          
          <motion.select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StatusType)}
            className="pl-6 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#ABF600] focus:border-[#ABF600] bg-gray-50 text-gray-900 font-medium appearance-none cursor-pointer min-w-[160px]"
            whileHover={{ scale: 1.02 }}
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 16px center', backgroundSize: '20px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </motion.select>
        </div>
      </motion.div>

      {/* Requests Table */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Symptoms
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-8 h-8 border-3 border-[#ABF600] border-t-transparent rounded-full"
                      />
                      <span className="text-gray-600 font-medium">Loading requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-6 max-w-lg mx-auto"
                    >
                      <div className="p-6 bg-gray-50 rounded-full">
                        <ClipboardList className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No consultation requests found
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl p-6 bg-gray-50 rounded-xl">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Try searching for:</h4>
                          <ul className="space-y-3 text-sm text-gray-600">
                            <motion.li 
                              className="flex items-center gap-2"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-1.5 h-1.5 bg-[#ABF600] rounded-full" />
                              Patient name: "John Smith"
                            </motion.li>
                            <motion.li 
                              className="flex items-center gap-2"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-1.5 h-1.5 bg-[#ABF600] rounded-full" />
                              Email: "john@example.com"
                            </motion.li>
                            <motion.li 
                              className="flex items-center gap-2"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-1.5 h-1.5 bg-[#ABF600] rounded-full" />
                              Symptoms: "headache", "fever"
                            </motion.li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Try filtering by:</h4>
                          <ul className="space-y-3 text-sm text-gray-600">
                            <motion.li 
                              className="flex items-center gap-2"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                              Status: "Pending"
                            </motion.li>
                            <motion.li 
                              className="flex items-center gap-2"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              Status: "Accepted"
                            </motion.li>
                            <motion.li 
                              className="flex items-center gap-2"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                              Status: "Rejected"
                            </motion.li>
                          </ul>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStatus('all');
                          setSelectedDate(null);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Filter className="w-4 h-4" />
                        Clear all filters
                      </motion.button>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.tr 
                    key={request.id} 
                    className="hover:bg-gray-50 transition-colors"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    transition={{
                      delay: index * 0.1
                    }}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {request.attributes.relationships.patient.attributes.first_name} {request.attributes.relationships.patient.attributes.last_name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {request.attributes.relationships.patient.attributes.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {format(new Date(request.attributes.date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {request.attributes.start_time.slice(0, 5)} - {request.attributes.end_time.slice(0, 5)}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-base text-gray-900 max-w-xs truncate">
                        {request.attributes.symptoms}
                      </div>
                      {request.attributes.additional_notes && (
                        <div className="text-sm text-gray-500 max-w-xs truncate mt-1">
                          Note: {request.attributes.additional_notes}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(request.attributes.status)}`}>
                        {request.attributes.status.charAt(0).toUpperCase() + request.attributes.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {request.attributes.status === 'pending' && (
                        <div className="flex gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateStatus(request.id, 'approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#ABF600] text-[#1A202C] rounded-lg hover:bg-[#9DE100] transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                          >
                            <UserCheck className="w-5 h-5" />
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateStatus(request.id, 'rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                          >
                            <UserX className="w-5 h-5" />
                            Reject
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
