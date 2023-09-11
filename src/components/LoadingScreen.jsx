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
        <div className="loading__wrapper">
          <MoonLoader
            color={colors.purple300}
            loading
            size={100}
            speedMultiplier={0.25}
          />
          <h1 className="loading__text">Loading...</h1>
        </div>
      </div>
    ),
    document.getElementById("portal")
  );
};

export default LoadingScreen;
