import React, { useState } from "react";
import axios from "axios";
import { PAYLOAD_DATA } from "../utils/API_URLs";
import "./css/Modal.css";
import Modal from "./Modal";

const TraceEvents = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [jsonData, setJsonData] = useState(null);

  const handleUrlClick = async (url) => {
    setSelectedUrl(url);
    setIsModalOpen(true);
    try {
      const response = await axios.post(PAYLOAD_DATA, {
        payloadUrl: url,
      });
      console.log(response.data);
      setJsonData(response.data);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    }
    window.scrollTo({
      top: 0,
      behavior: "auto", // This adds a smooth scroll animation
    });
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
                  <a href="#" onClick={() => handleUrlClick(url)}>
                    {url}
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          data={jsonData}
        />
      }
    </>
  );
};

export default TraceEvents;
