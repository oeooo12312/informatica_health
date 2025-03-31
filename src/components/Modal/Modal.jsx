import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ children, onClose, onClosePrompt}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCloseClick = () => {
    // Show confirmation before closing
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    onClose(); // Close the modal
  };

  const handleCancelClose = () => {
    // If cancelled, just close the confirmation and keep the modal open
    setShowConfirmation(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!showConfirmation ? (
          <>
            <button className="close-btn" onClick={handleCloseClick}>✖</button>
            {children}
          </>
        ) : (
          <div className="confirmation-dialog">
            <p>{onClosePrompt}</p>
            <div className="confirmation-actions">
              <button onClick={handleConfirmClose}>Yes</button>
              <button onClick={handleCancelClose}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;