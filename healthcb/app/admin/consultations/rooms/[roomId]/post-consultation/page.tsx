'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CompleteConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const [consultationRecord, setConsultationRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    diagnosis: '',
    prescribed_medications: '',
    treatment_plan: '',
    post_consultation_notes: '',
    requires_followup: false,
    followup_date: '',
    followup_notes: '',
    attachments: null as File | null,
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('/api/consultation-record/get_room_record/', {
          params: { room: roomId },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setConsultationRecord(response.data.data);
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    };
    fetchRecord();
  }, [roomId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, attachments: e.target.files[0]});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consultationRecord?.id) {
      console.error('No consultation record found');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      const submissionData = {
        ...formData,
        followup_date: formData.requires_followup ? formData.followup_date : null,
        followup_notes: formData.requires_followup ? formData.followup_notes : '',
      };

      delete submissionData.attachments;

      const response = await axios.patch(
        `/api/consultation-record/${consultationRecord.id}/complete_consultation/`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (formData.attachments) {
        const formPayload = new FormData();
        formPayload.append('file', formData.attachments);
        
        await axios.post(
          `/api/consultation-record/${consultationRecord.id}/upload_attachment/`,
          formPayload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );
      }

      router.push('/admin/consultations');
      router.refresh();
    } catch (error) {
      console.error('Error completing consultation:', error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Complete Consultation</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <textarea 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.diagnosis}
            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prescribed Medications</label>
          <textarea 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.prescribed_medications}
            onChange={(e) => setFormData({...formData, prescribed_medications: e.target.value})}
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
          <textarea 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.treatment_plan}
            onChange={(e) => setFormData({...formData, treatment_plan: e.target.value})}
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.post_consultation_notes}
            onChange={(e) => setFormData({...formData, post_consultation_notes: e.target.value})}
            rows={3}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requires_followup"
            checked={formData.requires_followup}
            onChange={(e) => setFormData({...formData, requires_followup: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requires_followup" className="ml-2 block text-sm text-gray-900">
            Requires Follow-up
          </label>
        </div>

        {formData.requires_followup && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
              <input
                type="date"
                value={formData.followup_date}
                onChange={(e) => setFormData({...formData, followup_date: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Notes</label>
              <textarea
                value={formData.followup_notes}
                onChange={(e) => setFormData({...formData, followup_notes: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Attachments</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Complete Consultation
          </button>
        </div>
      </form>
    </div>
  );
}