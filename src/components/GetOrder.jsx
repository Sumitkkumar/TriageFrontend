import React from "react";
import "./css/GetOrder.css";
import { useState } from "react";
import FlowDiagram from "./FlowDiagram";
import "./css/KeyValue.css";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { ImSortAlphaDesc, ImSortAlphaAsc } from "react-icons/im";

const API_BASE_URL = "http://localhost:8080/api/getOrder/";

const GetOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [tableVisible, setTableVisible] = useState(false);
  const [dataflowVisible, setDataflowVisible] = useState(false);
  const [showMoreData, setShowMoreData] = useState(false);
  const [selectedDataIndex, setSelectedDataIndex] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [warehouseToRapiData, setWarehouseToRapiData] = useState("");
  const [sortInAsc, setSortInAsc] = useState(true);
  const [sortOutAsc, setSortOutAsc] = useState(true);
  const [toggleTableData, setToggleTableData] = useState(false);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const handleSort = (column) => {
    setToggleTableData(true);
    if (column === "inTimestamp") {
      setSortedData(
        [...requestData].sort((a, b) =>
          sortInAsc
            ? new Date(a[column]) - new Date(b[column])
            : new Date(b[column]) - new Date(a[column])
        )
      );
      setSortInAsc(!sortInAsc);
    } else if (column === "outTimestamp") {
      setSortedData(
        [...requestData].sort((a, b) =>
          sortOutAsc
            ? new Date(a[column]) - new Date(b[column])
            : new Date(b[column]) - new Date(a[column])
        )
      );
      setSortOutAsc(!sortOutAsc);
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
        setRequestData(data);
      }
    } else {
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
          {dataflowVisible && requestData ? (
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
                      <div className="th--wrapper">
                        <p>inTimestamp</p>
                        {sortInAsc ? (
                          <ImSortAlphaAsc
                            className="sortIcon"
                            onClick={() => handleSort("inTimestamp")}
                          />
                        ) : (
                          <ImSortAlphaDesc
                            className="sortIcon"
                            onClick={() => handleSort("inTimestamp")}
                          />
                        )}
                      </div>
                    </th>
                    <th>
                      <div className="th--wrapper">
                        <p>outTimestamp</p>
                        {sortOutAsc ? (
                          <ImSortAlphaAsc
                            className="sortIcon"
                            onClick={() => handleSort("outTimestamp")}
                          />
                        ) : (
                          <ImSortAlphaDesc
                            className="sortIcon"
                            onClick={() => handleSort("outTimestamp")}
                          />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requestData != null ? (
                    toggleTableData ? (
                      sortedData.map((row, key) => (
                        <tr key={key} onClick={() => displayMoreData(key)}>
                          <td>{row.dataflowName}</td>
                          <td>{row.triggered}</td>
                          <td>{row.rapiToWareHouse}</td>
                          <td>{row.wareHouseToRapi}</td>
                          <td>{row.conversationId}</td>
                          <td>{row.failed}</td>
                          <td>{row.inTimestamp}</td>
                          <td>{row.outTimestamp}</td>
                        </tr>
                      ))
                    ) : (
                      requestData.map((row, key) => (
                        <tr key={key} onClick={() => displayMoreData(key)}>
                          <td>{row.dataflowName}</td>
                          <td>{row.triggered}</td>
                          <td>{row.rapiToWareHouse}</td>
                          <td>{row.wareHouseToRapi}</td>
                          <td>{row.conversationId}</td>
                          <td>{row.failed}</td>
                          <td>{row.inTimestamp}</td>
                          <td>{row.outTimestamp}</td>
                        </tr>
                      ))
                    )
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
