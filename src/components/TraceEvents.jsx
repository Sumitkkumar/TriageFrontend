import React, { useState } from "react";
import ModalOverlay from "./ModalOverlay";
import axios from "axios";
import { PAYLOAD_DATA } from "../utils/API_URLs";

const TraceEvents = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [jsonData, setJsonData] = useState(null);

  const handleUrlClick = async (url) => {
    setSelectedUrl(url);
    setModalIsOpen(true);
    try {
      const response = await axios.post(PAYLOAD_DATA, {
        payloadUrl: url,
      });
      console.log(response.data);
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUrl("");
  };
  return (
    <>
      <table className="orderContentTable">
        <thead>
          <tr>
            <th>Tag</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) =>
            Object.entries(item).map(([tag, url], idx) => (
              <tr key={index + "-" + idx}>
                <td>{tag}</td>
                <td>
                  <a href={url} onClick={() => handleUrlClick(url)}>
                    {url}
                    <ModalOverlay
                      isOpen={modalIsOpen}
                      closeModal={closeModal}
                      url={selectedUrl}
                      data={jsonData}
                    />
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default TraceEvents;
