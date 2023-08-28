import React from "react";
import axios from "axios";
import { useState } from "react";
import "./css/GetOrder.css";
import { RxCross2 } from "react-icons/rx";
import { ImSortAlphaDesc, ImSortAlphaAsc } from "react-icons/im";

const API_BASE_URL = "http://localhost:8081/api/getInventory";

const Inventory = () => {
  const [UPC, setUPC] = useState("");
  const [date, setDate] = useState();
  const [requestData, setRequestData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [showMoreData, setShowMoreData] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [selectedDataIndex, setSelectedDataIndex] = useState(null);
  const [sortInAsc, setSortInAsc] = useState(true);
  const [sortOutAsc, setSortOutAsc] = useState(true);
  const [sortQuantityAsc, setSortQuantityAsc] = useState(true);
  const [toggleTableData, setToggleTableData] = useState(false);

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

  const handleSort = (column) => {
    setToggleTableData(true);
    if (column === "in_timestamp") {
      setSortedData(
        [...requestData].sort((a, b) =>
          sortInAsc
            ? new Date(a[column]) - new Date(b[column])
            : new Date(b[column]) - new Date(a[column])
        )
      );
      setSortInAsc(!sortInAsc);
    } else if (column === "out_timestamp") {
      setSortedData(
        [...requestData].sort((a, b) =>
          sortOutAsc
            ? new Date(a[column]) - new Date(b[column])
            : new Date(b[column]) - new Date(a[column])
        )
      );
      setSortOutAsc(!sortOutAsc);
    } else if (column === "quantity") {
      setSortedData(
        [...requestData].sort((a, b) =>
          sortQuantityAsc
            ? Number(a[column]) - Number(b[column])
            : Number(b[column]) - Number(a[column])
        )
      );
      setSortQuantityAsc(!sortQuantityAsc);
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
    const data = await fetchData(UPC, date);

    if (data != null) {
      setRequestData(data);
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
        <div className="tableContainer">
          {tableVisible && (
            <>
              <h2 className="pageSubHeadings">Table</h2>
              <table className="orderContentTable">
                <thead>
                  <tr>
                    <th>dataflowName</th>
                    <th>UPC</th>
                    <th>ConversationId</th>
                    <th>
                      <div className="th--wrapper">
                        <p>Quantity</p>
                        {sortInAsc ? (
                          <ImSortAlphaAsc
                            className="sortIcon"
                            onClick={() => handleSort("quantity")}
                          />
                        ) : (
                          <ImSortAlphaDesc
                            className="sortIcon"
                            onClick={() => handleSort("quantity")}
                          />
                        )}
                      </div>
                    </th>
                    <th>Parent ConversationId</th>
                    <th>
                      <div className="th--wrapper">
                        <p>in_timestamp</p>
                        {sortInAsc ? (
                          <ImSortAlphaAsc
                            className="sortIcon"
                            onClick={() => handleSort("in_timestamp")}
                          />
                        ) : (
                          <ImSortAlphaDesc
                            className="sortIcon"
                            onClick={() => handleSort("in_timestamp")}
                          />
                        )}
                      </div>
                    </th>
                    <th>
                      <div className="th--wrapper">
                        <p>out_timestamp</p>
                        {sortOutAsc ? (
                          <ImSortAlphaAsc
                            className="sortIcon"
                            onClick={() => handleSort("out_timestamp")}
                          />
                        ) : (
                          <ImSortAlphaDesc
                            className="sortIcon"
                            onClick={() => handleSort("out_timestamp")}
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
                          <td>{UPC}</td>
                          <td>{row.ConversationId}</td>
                          <td>{row.quantity}</td>
                          <td>
                            {row["Parent ConversationId"]
                              ? row["Parent ConversationId"]
                              : "null"}
                          </td>
                          <td>{row.in_timestamp}</td>
                          <td>{row.out_timestamp}</td>
                        </tr>
                      ))
                    ) : (
                      requestData.map((row, key) => (
                        <tr key={key} onClick={() => displayMoreData(key)}>
                          <td>{row.dataflowName}</td>
                          <td>{UPC}</td>
                          <td>{row.ConversationId}</td>
                          <td>{row.quantity}</td>
                          <td>
                            {row["Parent ConversationId"]
                              ? row["Parent ConversationId"]
                              : "null"}
                          </td>
                          <td>{row.in_timestamp}</td>
                          <td>{row.out_timestamp}</td>
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
