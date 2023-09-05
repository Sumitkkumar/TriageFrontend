import React from "react";
import ReactDOM from "react-dom";
import "../css/Modal.css";

const Modal = ({ isOpen, setIsOpen, data }) => {
  return ReactDOM.createPortal(
    isOpen && (
      <div className="modal">
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
        <div className="content">
          <h2 className="pageSubHeadings">Payload</h2>
          <div className="content-box">
            <p>{JSON.stringify(data)}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="closeBtn">
            Close
          </button>
        </div>
      </div>
    ),
    document.getElementById("portal")
  );
};

export default Modal;
