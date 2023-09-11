import React from "react";
import { useState } from "react";
import "../css/GetOrder.css";
import { postData } from "../utils/helpers/postData";
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

  const [sortedBalanceData, setSortedBalanceData] = useState([]);
  const [sortedSfccData, setSortedSfccData] = useState([]);
  const [sortedAdjustmentData, setSortedAdjustmentData] = useState([]);

  const [requestData, setRequestData] = useState([]);
  const [traceEventsData, setTraceEventsData] = useState([]);
  const [traceEventDataFlowName, setTraceEventDataFlowName] = useState('');

  const [sortInAsc, setSortInAsc] = useState(true);
  const [sortInSfccAsc, setSortInSfccAsc] = useState(true);
  const [sortInAdjustmentAsc, SetSortInAdjustmentAsc] = useState(true);

  const [sortOutAsc, setSortOutAsc] = useState(true);
  const [sortOutSfccAsc, setSortOutSfccAsc] = useState(true);
  const [sortOutAdjustmentAsc, SetSortOutAdjustmentAsc] = useState(true);

  const [sortQuantityAsc, setSortQuantityAsc] = useState(true);
  const [sortSfccAsc, setSortSfccAsc] = useState(true);
  const [sortAdjustmentAsc, SetSortAdjustmentAsc] = useState(true);
  const [toggleTableData, setToggleTableData] = useState(false);

  const [inventoryBalance, setInventoryBalance] = useState([]);
  const [inventorySFCC, setInventorySFCC] = useState([]);
  const [inventoryAdjustment, setInventoryAdjustment] = useState([]);

  const handleSort = (column, type) => {
    setToggleTableData(true);
    if (column === "inTimestamp") {
      if( type === "balance") {
        setSortedBalanceData(
          [...inventoryBalance].sort((a, b) =>
            sortInAsc
              ? new Date(a[column]) - new Date(b[column])
              : new Date(b[column]) - new Date(a[column])
          )
        );
        setSortInAsc(!sortInAsc);
      } else if (type === "sfcc") {
        setSortedSfccData(
          [...inventorySFCC].sort((a, b) =>
            sortInSfccAsc
              ? new Date(a[column]) - new Date(b[column])
              : new Date(b[column]) - new Date(a[column])
          )
        );
        setSortInSfccAsc(!sortInSfccAsc);
      } else if ( type === "adjustment") {
        setSortedAdjustmentData(
          [...inventoryAdjustment].sort((a, b) =>
            sortInAdjustmentAsc
              ? new Date(a[column]) - new Date(b[column])
              : new Date(b[column]) - new Date(a[column])
          )
        );
        SetSortInAdjustmentAsc(!sortInAdjustmentAsc);
      }
    } else if (column === "outTimestamp") {
      if( type === "balance") {
        setSortedBalanceData(
          [...inventoryBalance].sort((a, b) =>
            sortOutAsc
              ? new Date(a[column]) - new Date(b[column])
              : new Date(b[column]) - new Date(a[column])
          )
        );
        setSortOutAsc(!sortOutAsc);
      } else if (type === "sfcc") {
        setSortedSfccData(
          [...inventorySFCC].sort((a, b) =>
            sortOutSfccAsc
              ? new Date(a[column]) - new Date(b[column])
              : new Date(b[column]) - new Date(a[column])
          )
        );
        setSortOutSfccAsc(!sortOutSfccAsc);
      } else if ( type === "adjustment") {
        setSortedAdjustmentData(
          [...inventoryAdjustment].sort((a, b) =>
            sortOutAdjustmentAsc
              ? new Date(a[column]) - new Date(b[column])
              : new Date(b[column]) - new Date(a[column])
          )
        );
        SetSortOutAdjustmentAsc(!sortOutAdjustmentAsc);
      }
    } else if (column === "quantity") {
      if( type === "balance") {
        setSortedBalanceData(
          [...inventoryBalance].sort((a, b) =>
            sortQuantityAsc
              ? Number(a[column]) - Number(b[column])
              : Number(b[column]) - Number(a[column])
          )
        );
        setSortQuantityAsc(!sortQuantityAsc);
      } else if (type === "sfcc") {
        setSortedSfccData(
          [...inventorySFCC].sort((a, b) =>
            sortSfccAsc
              ? Number(a[column]) - Number(b[column])
              : Number(b[column]) - Number(a[column])
          )
        );
        setSortSfccAsc(!sortSfccAsc);
      } else if ( type === "adjustment") {
        setSortedAdjustmentData(
          [...inventoryAdjustment].sort((a, b) =>
            sortAdjustmentAsc
              ? Number(a[column]) - Number(b[column])
              : Number(b[column]) - Number(a[column])
          )
        );
        SetSortAdjustmentAsc(!sortAdjustmentAsc);
      }
    }
  };

  const displayTraceEventsData = async (key, type) => {
    setShowTraceData(true);
    setSelectedDataIndex(key);
    try {
      let jobName;
      let conversationId;
      if (type === 'balance') {
        jobName = inventoryBalance[key].dataflowName;
        conversationId = inventoryBalance[key].conversationId;
        setTraceEventDataFlowName('INVENTORY-BALANCE-MSK-OUT-OMS');
      } else if (type === 'sfcc') {
        jobName = inventorySFCC[key].dataflowName;
        conversationId = inventorySFCC[key].conversationId;
        setTraceEventDataFlowName('INVENTORY-OUT-OMS-SFCC');
      } else if (type === 'adjustment') {
        jobName = inventoryAdjustment[key].dataflowName;
        conversationId = inventoryAdjustment[key].conversationId;
        setTraceEventDataFlowName('INVENTORY-ADJ-MSK-OMS');
      }
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
    const balanceData = [];
    const adjustmentData = [];
    const sfccData = [];

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
      flattenedData.forEach((data, index) => {
        if (data.dataflowName === "INVENTORY-BALANCE-MSK-OUT-OMS") {
          balanceData.push(data);
        } else if ( data.dataflowName === "INVENTORY-OUT-OMS-SFCC") {
          sfccData.push(data)
        } else if ( data.dataflowName === "INVENTORY-ADJ-MSK-OMS") {
          adjustmentData.push(data);
        }
      })
      setInventoryBalance(balanceData);
      setInventorySFCC(sfccData);
      setInventoryAdjustment(adjustmentData);
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
                    <h2 className="pageSubHeadings">OMS to SFCC</h2>
                    <table className="orderContentTable">
                      <thead>
                        <tr>
                          <th>Dataflow Name</th>
                          <th>UPC</th>
                          <th>Conversation Id</th>
                          <th>
                            <div className="th--wrapper">
                              <p>Quantity</p>
                              {sortSfccAsc ? (
                                <ImSortAlphaAsc
                                  className="sortIcon"
                                  onClick={() => handleSort("quantity", "sfcc")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("quantity", "sfcc")}
                                />
                              )}
                            </div>
                          </th>
                          <th>Parent Conversation Id</th>
                          <th>
                            <div className="th--wrapper">
                              <p>In Timestamp</p>
                              {sortInSfccAsc ? (
                                <ImSortAlphaAsc
                                  className="sortIcon"
                                  onClick={() => handleSort("inTimestamp", "sfcc")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("inTimestamp", "sfcc")}
                                />
                              )}
                            </div>
                          </th>
                          <th>
                            <div className="th--wrapper">
                              <p>Out Timestamp</p>
                              {sortOutSfccAsc ? (
                                <ImSortAlphaAsc
                                  className="sortIcon"
                                  onClick={() => handleSort("outTimestamp", "sfcc")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("outTimestamp", "sfcc")}
                                />
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventorySFCC != null ? (
                          sortedSfccData.length > 0 ? (
                            sortedSfccData.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key, 'sfcc')}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
                                <td>{row.inTimestamp}</td>
                                <td>{row.outTimestamp}</td>
                              </tr>
                            ))
                          ) : (
                            inventorySFCC.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key, 'sfcc')}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
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
                  </>
                )}
              </div>
              <br />
              <div className="tableContainer">
                {tableVisible && (
                  <>
                    <h2 className="pageSubHeadings">Warehouse to OMS inventory balance</h2>
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
                                  onClick={() => handleSort("quantity", "balance")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("quantity", "balance")}
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
                                  onClick={() => handleSort("inTimestamp", "balance")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("inTimestamp", "balance")}
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
                                  onClick={() => handleSort("outTimestamp", "balance")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("outTimestamp", "balance")}
                                />
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryBalance != null ? (
                          sortedBalanceData.length > 0 ? (
                            sortedBalanceData.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key, 'balance')}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
                                <td>{row.inTimestamp}</td>
                                <td>{row.outTimestamp}</td>
                              </tr>
                            ))
                          ) : (
                            inventoryBalance.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key, 'balance')}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
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
                  </>
                )}
              </div>
              <br />
              <div className="tableContainer">
                {tableVisible && (
                  <>
                    <h2 className="pageSubHeadings">Warehouse to OMS inventory adjustments</h2>
                    <table className="orderContentTable">
                      <thead>
                        <tr>
                          <th>Dataflow Name</th>
                          <th>UPC</th>
                          <th>Conversation Id</th>
                          <th>
                            <div className="th--wrapper">
                              <p>Quantity</p>
                              {sortAdjustmentAsc ? (
                                <ImSortAlphaAsc
                                  className="sortIcon"
                                  onClick={() => handleSort("quantity", "adjustment")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("quantity", "adjustment")}
                                />
                              )}
                            </div>
                          </th>
                          <th>Parent Conversation Id</th>
                          <th>
                            <div className="th--wrapper">
                              <p>In Timestamp</p>
                              {sortInAdjustmentAsc ? (
                                <ImSortAlphaAsc
                                  className="sortIcon"
                                  onClick={() => handleSort("inTimestamp", "adjustment")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("inTimestamp", "adjustment")}
                                />
                              )}
                            </div>
                          </th>
                          <th>
                            <div className="th--wrapper">
                              <p>Out Timestamp</p>
                              {sortOutAdjustmentAsc ? (
                                <ImSortAlphaAsc
                                  className="sortIcon"
                                  onClick={() => handleSort("outTimestamp", "adjustment")}
                                />
                              ) : (
                                <ImSortAlphaDesc
                                  className="sortIcon"
                                  onClick={() => handleSort("outTimestamp", "adjustment")}
                                />
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryAdjustment != null ? (
                          sortedAdjustmentData.length > 0 ? (
                            sortedAdjustmentData.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key, 'adjustment')}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
                                <td>{row.inTimestamp}</td>
                                <td>{row.outTimestamp}</td>
                              </tr>
                            ))
                          ) : (
                            inventoryAdjustment.map((row, key) => (
                              <tr
                                key={key}
                                onClick={() => displayTraceEventsData(key, 'adjustment')}
                              >
                                <td>{row.dataflowName.toUpperCase()}</td>
                                <td>{UPC}</td>
                                <td>{row.conversationId}</td>
                                <td>{row.quantity}</td>
                                <td>{row.parentConversationId}</td>
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
                  </>
                )}
              </div>
              <br />
              <>
                {showTraceData && requestData[selectedDataIndex] ? (
                  <div>
                    <h2 className="pageSubHeadings">
                      {traceEventDataFlowName}
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
