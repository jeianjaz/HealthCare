import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { consultationApi } from '@/services/consultationApi';

interface NoteTakingProps {
  recordId: string;
}

export default function NoteTaking({ recordId }: NoteTakingProps) {
  const [notes, setNotes] = useState('');

  const debouncedSave = useCallback(
    debounce(async (value: string) => {
      try {
        await consultationApi.updateConsultationNotes(recordId, {
          consultation_notes: value
        });
      } catch (error) {
        console.error('Failed to save notes:', error);
      }
    }, 1000),
    [recordId]
  );

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const record = await consultationApi.getRecordByRoomId(recordId);
        console.log('record:', record);
        setNotes(record.data.attributes.consultation_notes || '');
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };
    fetchNotes();
  }, [recordId]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setNotes(newValue);
    debouncedSave(newValue);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-[#1A202C] mb-4">Consultation Notes</h3>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-[#ABF600] focus:border-transparent"
        placeholder="Enter consultation notes here..."
      />
    </div>
  );
}
