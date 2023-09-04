import React from "react";
import ReactDOM from "react-dom";
import "../css/Modal.css";
import ClockLoader from "react-spinners/ClockLoader";
import * as colors from "../utils/colors"

const LoadingScreen = ({ loading }) => {
  return ReactDOM.createPortal(
    loading && (
      <div className="modal">
        <div className="overlay"></div>
        <ClockLoader color={colors.purple700} size={150} />
      </div>
    ),
    document.getElementById("portal")
  );
};

export default LoadingScreen;
