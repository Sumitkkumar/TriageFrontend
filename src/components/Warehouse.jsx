import React from "react";
import { useState } from "react";
import warehouseJSONData from "./warehouseData.json";
import { RxCross2 } from "react-icons/rx";

const Warehouse = () => {
  const [dataflowName, setDataflowName] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [showMoreData, setShowMoreData] = useState(false);


  const handleSubmit = (event) => {
      event.preventDefault();
      setShowMoreData(true);
  }

  const hideMoreData = () => {
    setShowMoreData(false);
  };


  return (
    <section className="mainContainer">
      <div className="innerContainer">
        <h1 className="pageTitle">Warehouse</h1>
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={dataflowName}
              placeholder="Enter the dataflow name"
              onChange={(e) => setDataflowName(e.target.value)}
            />
            <input
              type="text"
              value={conversationId}
              placeholder="Enter the conversationId"
              onChange={(e) => setConversationId(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          <>
            {showMoreData && (
              <div className="keyValueContainer">
                <span className="pageSubHeadings">
                    Warehouse Response
                </span>
                <p style={{marginBottom:'1.5rem'}}>
                  {warehouseJSONData["wareHouse Response"]}
                </p>
                <span className="pageSubHeadings">
                    Warehouse Input
                </span>
                <p>{warehouseJSONData["wareHouse Input"]}</p>
                <span className="close">
                  <RxCross2 onClick={hideMoreData} />
                </span>
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  );
};

export default Warehouse;
