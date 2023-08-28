import React from "react";
import ReactDOM from "react-dom";
import "./css/ModalOverlay.css";

const ModalOverlay = ({ isOpen, closeModal, url, data }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="overlay" onClick={closeModal}></div>
      <div className="content">
        <h2>Warehouse Response</h2>

        {data.map((val, key) => (
          <p key={key}>{val["warehouse Response"]}</p>
        ))}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default ModalOverlay;
