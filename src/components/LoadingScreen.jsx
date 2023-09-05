import React from "react";
import ReactDOM from "react-dom";
import "../css/Modal.css";
import MoonLoader from "react-spinners/MoonLoader";
import * as colors from "../utils/colors";

const LoadingScreen = ({ loading }) => {
  return ReactDOM.createPortal(
    loading && (
      <div className="modal">
        <div className="overlay"></div>
        <MoonLoader
          color={colors.purple300}
          loading
          size={100}
          speedMultiplier={0.25}
        />
      </div>
    ),
    document.getElementById("portal")
  );
};

export default LoadingScreen;
