import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../css/Modal.css";
import { GrFormClose } from "react-icons/gr";
import { BiSolidCopyAlt, BiCheck } from "react-icons/bi";

const Modal = ({ isOpen, setIsOpen, data }) => {
  const [toggleCopy, setToggleCopy] = useState(false);

  const copyText = () => {
    setToggleCopy(true);
    let textContent = JSON.stringify(data);
    navigator.clipboard.writeText(textContent);
    setTimeout(() => {setToggleCopy(false)}, 4000)
  };

  return ReactDOM.createPortal(
    isOpen && (
      <div className="modal">
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
        <div className="content">
          <h2 className="pageSubHeadings">Payload</h2>
          <div className="content-box">
            <p>{JSON.stringify(data)}</p>
          </div>
          <div className="buttons__wrapper">
            <button
              onClick={() => setIsOpen(false)}
              className="button button__close"
            >
              <GrFormClose className="button__icon" />
              Close
            </button>
            <button onClick={copyText} className="button button__copy">
              {toggleCopy ? (
                <>
                  <BiCheck className="button__icon" />
                  Copied
                </>
              ) : (
                <>
                  <BiSolidCopyAlt className="button__icon" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    ),
    document.getElementById("portal")
  );
};

export default Modal;
