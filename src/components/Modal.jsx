import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, setIsOpen, data }) => {
  return ReactDOM.createPortal(
    isOpen && (
      <div className="modal">
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
        <div className="content">
          <h2 className="pageSubHeadings">Payload</h2>
          {JSON.stringify(data)}
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
