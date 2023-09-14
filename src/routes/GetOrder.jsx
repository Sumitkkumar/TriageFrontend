import React from "react";
import { useState, useRef } from "react";
import "../css/GetOrder.css";
import FlowDiagram from "../components/FlowDiagram";
import { postData } from "../utils/helpers/postData";
import { convertTimestampToEST } from "../utils/helpers/convertTimestampToEST";
import TraceEvents from "../components/TraceEvents";
import { ImSortAlphaDesc, ImSortAlphaAsc } from "react-icons/im";
import { ORDER_DATA_URL, TRACE_EVENTS_DATA } from "../utils/API_URLs";
import LoadingScreen from "../components/LoadingScreen";

const GetOrder = () => {
  const orderIdRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTrace, setLoadingTrace] = useState(false);

  const [selectedDataIndex, setSelectedDataIndex] = useState(null);

  const [requestData, setRequestData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [showTraceData, setShowTraceData] = useState(false);
  const [traceEventsData, setTraceEventsData] = useState([]);

  const [sortInAsc, setSortInAsc] = useState(true);
  const [sortOutAsc, setSortOutAsc] = useState(true);
  const [toggleTableData, setToggleTableData] = useState(false);

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

  const displayTraceEventsData = async (key) => {
    setShowTraceData(true);
    setSelectedDataIndex(key);
    try {
      const jobName = requestData[key].dataflowName;
      const conversationId = requestData[key].conversationId;
      setLoadingTrace(true);
      const data = await postData(TRACE_EVENTS_DATA, {
        jobName: jobName,
        conversationId: conversationId,
      });
      setTraceEventsData(data);
      setLoadingTrace(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const resetStates = () => {
    setShowContent(false);
    setLoading(false);
    setLoadingTrace(false);
    setSelectedDataIndex(null);
    setRequestData([]);
    setSortedData([]);
    setShowTraceData(false);
    setTraceEventsData([]);
    setSortInAsc(true);
    setSortOutAsc(true);
    setToggleTableData(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetStates();
    setLoading(true);
    console.log("ORDER ID VALUE: " + orderIdRef.current.value);
    const data = await postData(ORDER_DATA_URL, {
      orderId: orderIdRef.current.value,
    });
    if (data != null) {
      setRequestData(data.result.dataflows);
      setLoading(false);
      setShowContent(true);
    } else {
      setRequestData([]);
    }
  };

  return (
    <section className="mainContainer">
      <div className="innerContainer">
        <h1 className="pageTitle">Get Order Details</h1>
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              ref={orderIdRef}
              placeholder="Enter your order id"
            />
            <button type="submit" disabled={loading}>
              Submit
            </button>
          </form>
        </div>

        <div className="content__wrapper">
          {loading ? (
            <LoadingScreen loading={loading} />
          ) : (
            <>
              {/* DATAFLOW CONTAINER */}

              <div className="dataflowContainer">
                {showContent && requestData ? (
                  <>
                    <h2 className="pageSubHeadings">Order Flow</h2>
                    <FlowDiagram data={requestData} />
                  </>
                ) : null}
              </div>

              {/* TABLE CONTAINER */}

              <div className="tableContainer">
                {showContent && (
                  <>
                    <table className="orderContentTable">
                      <thead>
                        <tr>
                          <th>Dataflow Name</th>
                          <th>Triggered</th>
                          <th>Conversation Id</th>
                          <th>Failed</th>
                          <th>
                            <div className="th--wrapper">
                              <p>In Timestamp</p>
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
                              <p>Out Timestamp</p>
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
                              <tr
                                key={key}
                                onClick={() => {
                                  displayTraceEventsData(key);
                                  // setSelectedDataIndex(key);
                                }}
                                className={row.failed ? "failedRow" : ""}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{row.triggered}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.failed.toString()}</td>
                                <td>
                                  {convertTimestampToEST(row.inTimestamp)}
                                </td>
                                <td>
                                  {convertTimestampToEST(row.outTimestamp)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            requestData.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => {
                                  displayTraceEventsData(key);
                                  // setSelectedDataIndex(key);
                                }}
                                className={row.failed ? "failedRow" : ""}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{row.triggered}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.failed.toString()}</td>
                                <td>
                                  {convertTimestampToEST(row.inTimestamp)}
                                </td>
                                <td>
                                  {convertTimestampToEST(row.outTimestamp)}
                                </td>
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

                    {/* ADDITIONAL TABLE CONTAINER */}
                  </>
                )}
              </div>
              {loadingTrace ? (
                <LoadingScreen loading={loadingTrace} />
              ) : (
                <div className={showTraceData ? "traceEventsContainer" : ""}>
                  {showTraceData && requestData[selectedDataIndex] ? (
                    <div>
                      <h2 className="pageSubHeadings">
                        {requestData[selectedDataIndex].dataflowName}
                      </h2>
                      <h4>TraceEventsData</h4>
                      <TraceEvents data={traceEventsData} />
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GetOrder;
