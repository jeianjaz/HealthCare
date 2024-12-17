import React, { useState, useEffect } from 'react';
import useVideo from '@/hooks/useVideo';
import VideoControls from './VideoControls';
import VideoDisplay from './VideoDisplay';
import ChatPanel from './ChatPanel';
import NoteTaking from './NoteTaking';
import { ChatBubbleLeftRightIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardIcon } from '@heroicons/react/24/outline';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
    <span className="text-gray-600">Connecting to video...</span>
  </div>
);

interface VideoRoomProps {
  roomId: string;
  userType?: 'patient' | 'doctor' | 'admin';
  onEndCall?: () => void;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ roomId, userType = 'patient', onEndCall }) => {
  const [identity, setIdentity] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { 
    room,
    error,
    participants,
    participantTracks,
    localTracks,
    connect,
    isAudioMuted,
    isVideoMuted,
    toggleAudio,
    toggleVideo,
    participantMediaState,
  } = useVideo({ roomName: roomId, identity });

  useEffect(() => {
    const storedFirstName = localStorage.getItem('first_name');
    const storedLastName = localStorage.getItem('last_name');
    const fullName = storedFirstName && storedLastName 
      ? `${storedFirstName} ${storedLastName}` 
      : storedFirstName || '';
    
    setIdentity(fullName);
  }, [userType]);

  const handleConnect = async () => {
    if (!roomId || !identity) return;
    setIsConnecting(true);
    try {
      await connect();
    } finally {
      setIsConnecting(false);
    }
  };

  const cleanupTracks = () => {
    if (room?.localParticipant) {
      // Stop and unpublish all tracks from local participant
      room.localParticipant.tracks.forEach(publication => {
        if (publication.track) {
          publication.track.stop();
          publication.unpublish();
          const attachedElements = publication.track.detach();
          attachedElements.forEach(element => element.remove());
        }
      });
    }

    // Also cleanup local tracks array
    if (localTracks) {
      localTracks.forEach(track => {
        track.stop();
        const attachedElements = track.detach();
        attachedElements.forEach(element => element.remove());
      });
    }
  };

  const handleDisconnect = () => {
    setShowConfirmation(true);
  };

  const confirmDisconnect = () => {
    cleanupTracks();
    if (room) {
      room.disconnect();
    }
    onEndCall?.();
  };

  useEffect(() => {
    if (identity) {
      handleConnect();
    }
  }, [identity]);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTracks();
      if (room) {
        room.disconnect();
      }
    };
  }, [room, localTracks]);

  const toggleChat = () => {
    setIsChatVisible(prev => {
      if (!prev) {
        setIsNotesVisible(false);
      }
      return !prev;
    });
  };

  const toggleNotes = () => {
    setIsNotesVisible(prev => {
      if (!prev) {
        setIsChatVisible(false);
      }
      return !prev;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 flex lg:flex-row gap-4 p-6 overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col space-y-4 min-w-0">
          <div className="flex-1 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Consultation</h2>
            <div className="h-[calc(100%-2rem)]">
              {isConnecting && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <LoadingSpinner />
                </div>
              )}
              <VideoDisplay
                localTracks={localTracks}
                participantTracks={participantTracks}
                participantMediaState={participantMediaState}
                isLocalAudioMuted={isAudioMuted}
                isLocalVideoMuted={isVideoMuted}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              {/* Empty div for spacing */}
              <div className="w-[100px]"></div>

              {/* Center controls */}
              <div className="flex-1 flex justify-center">
                <VideoControls
                  room={room}
                  isAudioMuted={isAudioMuted}
                  isVideoMuted={isVideoMuted}
                  participants={participants}
                  error={error}
                  handleConnect={handleConnect}
                  handleDisconnect={handleDisconnect}
                  handleMuteAudio={toggleAudio}
                  handleMuteVideo={toggleVideo}
                  isAdmin={userType === 'admin'}
                  isLoading={isConnecting}
                />
              </div>
              
              {/* Right side buttons */}
              <div className="flex gap-2">
                {userType === 'admin' && (
                  <button
                    onClick={toggleNotes}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title={isNotesVisible ? "Hide Notes" : "Show Notes"}
                  >
                    <ClipboardIcon className="h-6 w-6 text-gray-600" />
                  </button>
                )}
                <button
                  onClick={toggleChat}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title={isChatVisible ? "Hide Chat" : "Show Chat"}
                >
                  {isChatVisible ? (
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-600" />
                  ) : (
                    <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side panels container */}
        <div className="flex gap-4 transition-all duration-300 ease-in-out overflow-hidden">
          {/* Notes panel */}
          {userType === 'admin' && (
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isNotesVisible ? 'w-96 opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <div className="w-96 bg-white rounded-xl shadow-md h-full">
                <NoteTaking recordId={roomId} />
              </div>
            </div>
          )}

          {/* Chat panel */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isChatVisible ? 'w-96 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <div className="w-96 bg-white rounded-xl shadow-md h-full">
              <ChatPanel
                roomId={roomId}
                identity={identity}
                userType={userType}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">End Consultation?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to end this consultation?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                End Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;