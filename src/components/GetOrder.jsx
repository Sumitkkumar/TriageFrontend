import React, { useEffect } from 'react'
import "./css/GetOrder.css"
import { useState } from 'react';
import FlowDiagram from './FlowDiagram';
import './css/KeyValue.css'
import axios from 'axios';
import {RxCross2} from 'react-icons/rx'

const API_URL = "http://localhost:8080/api/order/disaa001"

const GetOrder = () => {

  const [orderId, setOrderId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [dataflowVisible, setDataflowVisible] = useState(false);
  const [showMoreData,setShowMoreData] = useState(false);
  const [selectedDataIndex, setSelectedDataIndex] = useState(null);
  const [requestData, setRequestData] = useState("");
  const [requestDataError, setRequestDataError] = useState("");
  
  useEffect(() => {
    axios.get(API_URL)
         .then((response) => {
              console.log(response.data);
              setRequestData(response.data);
          })
          .catch((error) => {
              setRequestDataError(error)
              console.log(error); 
          })
  }, []);

  const displayMoreData = (key) => {
      setShowMoreData(true);
      setSelectedDataIndex(key);
  }

  const hideMoreData = () => {
      setShowMoreData(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const validOrderId = "disaa001"

    if(orderId.match(validOrderId)) {
      setTableData(requestData);
    } else {
      setTableData(null);
    }
    setTableVisible(true);
    setDataflowVisible(true);
  };

  return (
    <section className='mainContainer'>
        <div className='innerContainer'>
          <h1 className='pageTitle'>Get Order</h1>
          <div className='formContainer'>
            <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  value={orderId}
                  placeholder='Enter your order id' 
                  onChange={(e) => setOrderId(e.target.value)} />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className="dataflowContainer">
              {
                dataflowVisible && tableData  ?
                <>
                    <h2 className='pageSubHeadings'>Data Flow</h2>
                    <FlowDiagram/>
                </> : null
              }
                
          </div>
          
          <div className='tableContainer'>
            
            {
              tableVisible && 
              <>
                  <h2 className="pageSubHeadings">Table</h2> 
                  <table className='orderContentTable'>
                  <thead>
                    <tr>
                      <th>dataflowName</th>
                      <th>triggered</th>
                      <th>rapiToWareHouse</th>
                      <th>wareHouseToRapi</th>
                      <th>conversationId</th>
                      <th>failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData != null  ? tableData.map((row, key) => (
                      <tr key={key} onClick={() => displayMoreData(key)}>
                        <td>{row.dataflowName}</td>
                        <td>{row.triggered}</td>
                        <td>{row.rapiToWareHouse}</td>
                        <td>
                          {(row.wareHouseToRapi === "Success" || row.wareHouseToRapi === "No") ?
                            row.wareHouseToRapi : <p className='showMoreBtn' >Show More</p>
                          }
                        </td>
                        <td>{row.conversationId}</td>
                        <td>{row.failed}</td>
                      </tr>
                    )) : <p style={{color: 'red', fontWeight: 700}}>No data to be displayed.</p> }
                  </tbody>
                </table>
                <>
                  {
                    showMoreData && 
                    <div className='keyValueContainer'>
                        <span className='pageSubHeadings'>{requestData[selectedDataIndex].dataflowName}</span>
                        <h4>wareHouseToRapi</h4>
                        <p>{requestData[selectedDataIndex].wareHouseToRapi}</p>
                        <span className='close'> 
                            <RxCross2 onClick={hideMoreData}/>
                        </span>
                    </div>
                  }        
                </>
              </>
            }
          </div>
        </div>
    </section>
  )
}

export default GetOrder