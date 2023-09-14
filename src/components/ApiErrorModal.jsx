import React from "react";
import "../css/ApiErrorModal.css";

const ApiErrorModal = ({ status, message, onClose, content }) => {
  let errorMessage;

  if (status === 400) {
    errorMessage = `${message} ${content}`;
  } else {
    errorMessage = message;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <span className="close-icon-box">&times;</span>
        </span>
        <p className="error-message">
          {status === 400 ? (
            <>
              {message} <br /><span style={{ color: "green", fontWeight: "bold" }}>{content}</span>
            </>
          ) : (
            errorMessage
          )}
        </p>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ApiErrorModal;