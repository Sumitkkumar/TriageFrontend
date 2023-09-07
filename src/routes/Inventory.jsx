import React from "react";
import { useState } from "react";
import "../css/GetOrder.css";
import { postData } from "../utils/helpers/postData";
import { convertTimestampToEST } from "../utils/helpers/convertTimestampToEST";
import TraceEvents from "../components/TraceEvents";
import { INVENTORY_DATA, TRACE_EVENTS_DATA } from "../utils/API_URLs";
import { ImSortAlphaDesc, ImSortAlphaAsc } from "react-icons/im";
import LoadingScreen from "../components/LoadingScreen";

const Inventory = () => {
  const [UPC, setUPC] = useState("");
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
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
    const data = await postData(INVENTORY_DATA, {
      upc: UPC,
      issueDate: date,
    });

    const flattenedData = [];

    for (const dataflowName in data) {
      if (data.hasOwnProperty(dataflowName)) {
        for (const item of data[dataflowName]) {
          const newKeyValuePair = {
            dataflowName: dataflowName,
            ...item,
          };
          flattenedData.push(newKeyValuePair);
        }
      }
    }

    if (data != null) {
      setRequestData(flattenedData);
      setTableVisible(true);
      setLoading(false);
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
        <div className="content__wrapper">
          {loading ? (
            <LoadingScreen loading={loading} />
          ) : (
            <>
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
                              {sortQuantityAsc ? (
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
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
                                <td>{convertTimestampToEST(row.inTimestamp)}</td>
                                <td>{convertTimestampToEST(row.outTimestamp)}</td>
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
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
                                <td>{convertTimestampToEST(row.inTimestamp)}</td>
                                <td>{convertTimestampToEST(row.outTimestamp)}</td>
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Inventory;
