import React from "react";
import { useState } from "react";
import "./css/GetOrder.css";
import { postData } from "../utils/helpers/postData";
import TraceEvents from "./TraceEvents";
import { INVENTORY_DATA, TRACE_EVENTS_DATA } from "../utils/API_URLs";
import { ImSortAlphaDesc, ImSortAlphaAsc } from "react-icons/im";

const Inventory = () => {
  const [UPC, setUPC] = useState("");
  const [date, setDate] = useState();
  const [tableVisible, setTableVisible] = useState(false);
  const [showTraceData, setShowTraceData] = useState(false);
  const [selectedDataIndex, setSelectedDataIndex] = useState(null);

  const [sortedData, setSortedData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [traceEventsData, setTraceEventsData] = useState([]);
  
  const [sortInAsc, setSortInAsc] = useState(true);
  const [sortOutAsc, setSortOutAsc] = useState(true);
  const [sortQuantityAsc, setSortQuantityAsc] = useState(true);
  const [toggleTableData, setToggleTableData] = useState(false);

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

  const displayTraceEventsData = async (key) => {
    setShowTraceData(true);
    setSelectedDataIndex(key);
    try {
      const jobName = requestData[key].dataflowName;
      const conversationId = requestData[key].ConversationId;
      const data = await postData(TRACE_EVENTS_DATA, {
        jobName: jobName,
        conversationId: conversationId
      });
      setTraceEventsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await postData(INVENTORY_DATA, {
      upc: UPC,
      issueDate: date
    });

    if (data != null) {
      setRequestData(data);
      setTableVisible(true);
    } else {
      setRequestData([]);
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
                    <th>Dataflow Name</th>
                    <th>UPC</th>
                    <th>Conversation Id</th>
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
                    <th>Parent Conversation Id</th>
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
                        <p>Out Timestamp</p>
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
                        <tr
                          key={key}
                          onClick={() => displayTraceEventsData(key)}
                        >
                          <td>{row.dataflowName.toUpperCase()}</td>
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
                        <tr
                          key={key}
                          onClick={() => displayTraceEventsData(key)}
                        >
                          <td>{row.dataflowName.toUpperCase()}</td>
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
            </>
          )}
        </div>
        <>
          {showTraceData && requestData[selectedDataIndex] ? (
            <div>
              <h2 className="pageSubHeadings">
                {requestData[selectedDataIndex].dataflowName}
              </h2>
              <h4>TraceEventsData</h4>
              <TraceEvents data={traceEventsData} />
            </div>
          ) : null}
        </>
      </div>
    </section>
  );
};

export default Inventory;
