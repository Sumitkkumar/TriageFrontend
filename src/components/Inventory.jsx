import React from "react";
import axios from "axios";
import { useState } from "react";
import "./css/GetOrder.css";

const API_BASE_URL = "http://localhost:8080/api/inventory/data";

const Inventory = () => {
  const [UPC, setUPC] = useState("");
  const [date, setDate] = useState();
  const [requestData, setRequestData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await fetchData(UPC, date);
    if (data != null) {
      setRequestData(data);
    } else {
      setRequestData([]);
    }
    setTableVisible(true);
    console.log(data);
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
                    <th>ConversationId</th>
                    <th>Quantity</th>
                    <th>Parent ConversationId</th>
                    <th>Out_timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {requestData != null ? (
                    requestData.map((row, key) => (
                      <tr key={key}>
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Inventory;
