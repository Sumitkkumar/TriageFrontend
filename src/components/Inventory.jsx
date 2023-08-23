import React from "react";
import axios from "axios";
import FlowDiagram from "./FlowDiagram";
import { useState } from "react";
import "./css/GetOrder.css";
import { RxCross2 } from "react-icons/rx";

const API_BASE_URL = "http://localhost:8080/api/inventory/data";


const Inventory = () => {
  const [UPC, setUPC] = useState("");
  const [date, setDate] = useState();
  const [requestData, setRequestData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [dataflowVisible, setDataflowVisible] = useState(false);
  const [showMoreData, setShowMoreData] = useState(false);
  const [selectedDataIndex, setSelectedDataIndex] = useState(null);
  const [warehouseToRapiData, setWarehouseToRapiData] = useState("");

  const fetchData = async (upc, date) => {
    try {
      const response = await axios.post(API_BASE_URL, {
        upc: upc,
        issueDate: date,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchOrderData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/order/disaa001");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchAdditionalData = async (dataflowName, conversationId) => {
    const additionalDataUrl =
      "http://localhost:8080/api/order/warehouse-to-rapi";

    try {
      const response = await axios.post(additionalDataUrl, {
        dataflowName: dataflowName,
        conversationId: conversationId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching additional data:", error);
      return null;
    }
  };

  const displayMoreData = async (key) => {
    setShowMoreData(true);
    setSelectedDataIndex(key);
    const dataflowName = orderData[key].dataflowName;
    const conversationId = orderData[key].conversationId;
    let additionalData = await fetchAdditionalData(
      dataflowName,
      conversationId
    );
    setWarehouseToRapiData(additionalData);
  };

  const hideMoreData = () => {
    setShowMoreData(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await fetchData(UPC, date);
    const orderData = await fetchOrderData();

    if (data != null) {
      setOrderData(orderData);
      setRequestData(data);
      setDataflowVisible(true);
      setTableVisible(true);
    } else {
      setRequestData(null);
    }
  };

  return (
    <section className="mainContainer">
      <div className="innerContainer">
        <h1 className="pageTitle">Inventory Status</h1>
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={UPC}
              placeholder="Enter the UPC"
              onChange={(e) => setUPC(e.target.value)}
            />
            <input
              type="date"
              placeholder="Enter the Date"
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="dataflowContainer">
          {dataflowVisible && requestData ? (
            <>
              <h2 className="pageSubHeadings">Data Flow</h2>
              <FlowDiagram jsonData = {requestData}/>
            </>
          ) : null}
        </div>
        <div className="tableContainer">
          {tableVisible && (
            <>
              <h2 className="pageSubHeadings">Table</h2>
              <table className="orderContentTable">
                <thead>
                  <tr >
                    <th>dataflowName</th>
                    <th>ConversationId</th>
                    <th>Quantity</th>
                    <th>Parent ConversationId</th>
                    <th>Out_timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {requestData != null ? (
                    requestData.map((row, key) => (
                      <tr key={key} onClick={() => displayMoreData(key)}>
                        <td>{row.dataflowName}</td>
                        <td>{row.ConversationId}</td>
                        <td>{row.Quantity}</td>
                        <td>
                          {row.Parent_ConversationId
                            ? row.Parent_ConversationId
                            : "null"}
                        </td>
                        <td>
                          {row.Out_timestamp ? row.Out_timestamp : "null"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <p style={{ color: "red", fontWeight: 700 }}>
                      No data to be displayed.
                    </p>
                  )}
                </tbody>
              </table>
              <>
                {showMoreData && (
                  <div className="keyValueContainer">
                    <span className="pageSubHeadings">
                      {requestData[selectedDataIndex].dataflowName}
                    </span>
                    <h4>wareHouseToRapi</h4>
                    <p>{warehouseToRapiData}</p>
                    <span className="close">
                      <RxCross2 onClick={hideMoreData} />
                    </span>
                  </div>
                )}
              </>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Inventory;
