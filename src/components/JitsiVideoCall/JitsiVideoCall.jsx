import React, { useState, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiVideoCall = ({roomName}) => {
    const [showMeeting, setShowMeeting] = useState(true);
    const apiRef = useRef();

    const handleApiReady = (externalApi) => {
        apiRef.current = externalApi;
    };

    const handleReadyToClose = () => {
        // Handle when the meeting ends
        alert("Meeting closed!");
    };

    return (
        <div stlye={'margin-top: 10px;'}>
            {/* Embed the Jitsi meeting */}
            {showMeeting && (
                <JitsiMeeting
                    roomName={roomName}
                    configOverwrite={{
                        subject: 'Video Call with Customer',
                        hideConferenceSubject: false,
                    }}
                    lang="en"
                    onApiReady={handleApiReady}
                    onReadyToClose={handleReadyToClose}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = "600px";
                        iframeRef.style.width = "800px";
                        iframeRef.style.border = "2px solid #3d3d3d";
                    }}
                />
            )}
        </div>
    );
};

export default JitsiVideoCall;