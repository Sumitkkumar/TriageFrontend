import React from "react";
import "./css/GetOrder.css";
import { useState } from "react";
import FlowDiagram from "./FlowDiagram";
import "./css/KeyValue.css";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

const API_BASE_URL = "http://localhost:8080/api/order/";

const GetOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [dataflowVisible, setDataflowVisible] = useState(false);
  const [showMoreData, setShowMoreData] = useState(false);
  const [selectedDataIndex, setSelectedDataIndex] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [warehouseToRapiData, setWarehouseToRapiData] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
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
    const dataflowName = tableData[key].dataflowName;
    const conversationId = tableData[key].conversationId;
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

    const validOrderId = "disaa001";

    if (orderId.match(validOrderId)) {
      const data = await fetchData(API_BASE_URL + orderId);
      if (data) {
        setTableData(data);
        setRequestData(data);
      }
    } else {
      setTableData([]);
      setRequestData([]);
    }
    setTableVisible(true);
    setDataflowVisible(true);
  };

  return (
    <section className="mainContainer">
      <div className="innerContainer">
        <h1 className="pageTitle">Get Order</h1>
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={orderId}
              placeholder="Enter your order id"
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="dataflowContainer">
          {dataflowVisible && tableData ? (
            <>
              <h2 className="pageSubHeadings">Data Flow</h2>
              <FlowDiagram jsonData={requestData} />
            </>
          ) : null}
        </div>

        <div className="tableContainer">
          {tableVisible && (
            <>
              <h2 className="pageSubHeadings">Table</h2>
              <table className="orderContentTable">
                <thead>
                  <tr>
                    <th>dataflowName</th>
                    <th>triggered</th>
                    <th>rapiToWareHouse</th>
                    <th>wareHouseToRapi</th>
                    <th>conversationId</th>
                    <th>failed</th>
                    <th>
                      <div className="timestamp--wrapper">
                        <p>inTimestamp</p>
                        {sortAscending ? (
                          <AiOutlineSortAscending
                            className="sortIcon"
                            onClick={() => setSortAscending(!sortAscending)}
                          />
                        ) : (
                          <AiOutlineSortDescending
                            className="sortIcon"
                            onClick={() => setSortAscending(!sortAscending)}
                          />
                        )}
                      </div>
                    </th>
                    <th>
                      <div className="timestamp--wrapper">
                        <p>outTimestamp</p>
                        {sortAscending ? (
                          <AiOutlineSortAscending
                            className="sortIcon"
                            onClick={() => setSortAscending(!sortAscending)}
                          />
                        ) : (
                          <AiOutlineSortDescending
                            className="sortIcon"
                            onClick={() => setSortAscending(!sortAscending)}
                          />
                        )}
                      </div>
                    </th>
                    {/* <div className="timestamp--wrapper">
                      <th>outTimestamp</th>
                      {sortAscending ? (
                        <AiOutlineSortAscending
                          className="sortIcon"
                          onClick={() => setSortAscending(!sortAscending)}
                        />
                      ) : (
                        <AiOutlineSortDescending
                          className="sortIcon"
                          onClick={() => setSortAscending(!sortAscending)}
                        />
                      )}
                    </div> */}
                  </tr>
                </thead>
                <tbody>
                  {tableData != null ? (
                    [...tableData]
                      .sort((a, b) => {
                        const aDate = new Date(a.inTimestamp);
                        const bDate = new Date(b.inTimestamp);
                        return sortAscending ? aDate - bDate : bDate - aDate;
                      })
                      .map((row, key) => (
                        <tr key={key} onClick={() => displayMoreData(key)}>
                          <td>{row.dataflowName}</td>
                          <td>{row.triggered}</td>
                          <td>{row.rapiToWareHouse}</td>
                          <td>
                            {row.wareHouseToRapi === "Success" ||
                            row.wareHouseToRapi === "No" ? (
                              row.wareHouseToRapi
                            ) : (
                              <p className="showMoreBtn">Show More</p>
                            )}
                          </td>
                          <td>{row.conversationId}</td>
                          <td>{row.failed}</td>
                          <td>{row.inTimestamp}</td>
                          <td>{row.outTimestamp}</td>
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

export default GetOrder;
