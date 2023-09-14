import React from "react";
import { useState } from "react";
import "../css/GetOrder.css";
import FlowDiagram from "../components/FlowDiagram";
import { postData } from "../utils/helpers/postData";
import TraceEvents from "../components/TraceEvents";
import { ImSortAlphaDesc, ImSortAlphaAsc } from "react-icons/im";
import { ORDER_DATA_URL, TRACE_EVENTS_DATA } from "../utils/API_URLs";
import LoadingScreen from "../components/LoadingScreen";
import ApiErrorModal from "../components/ApiErrorModal";

const GetOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedDataIndex, setSelectedDataIndex] = useState(null);

  const [requestData, setRequestData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [showTraceData, setShowTraceData] = useState(false);
  const [traceEventsData, setTraceEventsData] = useState([]);

  const [sortInAsc, setSortInAsc] = useState(true);
  const [sortOutAsc, setSortOutAsc] = useState(true);
  const [toggleTableData, setToggleTableData] = useState(false);

  const [error, setError] = useState(null);
  const [blankOrderError, setBlankOrderError] = useState("");

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
      setLoading(true);
      const data = await postData(TRACE_EVENTS_DATA, {
        jobName: jobName,
        conversationId: conversationId,
      });
      setTraceEventsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setShowContent(false);
    if (!orderId.trim()) {
      setBlankOrderError("*Required field");
      setLoading(false);
      return;
    }
    setBlankOrderError("");
    try {
      const data = await postData(ORDER_DATA_URL, { orderId: orderId });
      if (data != null) {
        setRequestData(data.result.dataflows);
        setLoading(false);
        setShowContent(true);
      } else {
        setRequestData([]);
        setLoading(false);
      }
    } catch (error) {
      setError({
        status: error.status,
        message: error.message,
      });
      setLoading(false);
    }
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
            <button type="submit" disabled={loading}>
              Submit
            </button>
          </form>
          {blankOrderError && <p style={{ color: "red" }}>{blankOrderError}</p>}
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
                    <h2 className="pageSubHeadings">Data Flow</h2>
                    <FlowDiagram data={requestData} />
                  </>
                ) : null}
              </div>

              {/* TABLE CONTAINER */}

              <div className="tableContainer">
                {showContent && (
                  <>
                    <h2 className="pageSubHeadings">Table</h2>
                    <table className="orderContentTable">
                      <thead>
                        <tr>
                          <th>Dataflow Name</th>
                          <th>Triggered</th>
                          <th>Rapi To WareHouse</th>
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
                                onClick={() => displayTraceEventsData(key)}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{row.triggered}</td>
                                <td>{row.rapiToWareHouse}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.failed.toString()}</td>
                                <td>{row.inTimestamp}</td>
                                <td>{row.outTimestamp}</td>
                              </tr>
                            ))
                          ) : (
                            requestData.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key)}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{row.triggered}</td>
                                <td>{row.rapiToWareHouse}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.failed.toString()}</td>
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

                    {/* ADDITIONAL TABLE CONTAINER */}
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
            </>
          )}
        </div>
      </div>
      {error && (
        <ApiErrorModal
          status={error.status}
          message={error.message}
          content={orderId}
          onClose={() => setError(null)}
        />
      )}
    </section>
  );
};

export default GetOrder;
