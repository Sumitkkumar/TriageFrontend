import React from "react";
import "./css/GetOrder.css";
import { useState } from "react";
import FlowDiagram from "./FlowDiagram";
import "./css/KeyValue.css";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

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
              <FlowDiagram jsonData = {requestData}/>
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
                  </tr>
                </thead>
                <tbody>
                  {tableData != null ? (
                    tableData.map((row, key) => (
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


// {

  // "wareHouse Response": "{\"DocumentType\":\"0001\",\"OrderNo\":\"DECEVATS0999\",\"OrderHeaderKey\":\"202306271653214526116824\",\"EnterpriseCode\":\"DisneyEMEA\"}",

  // "wareHouse Input": "{\n   \"CustomerOrder\" : {\n      \"Customer\" : {\n         \"CustomerType\" : \"02\",\n         \"OrganizationCode\" : \"DisneyEMEA\",\n         \"Status\" : \"10\",\n         \"CustomerContactList\" : {\n            \"CustomerContact\" : [ {\n               \"DateOfBirth\" : \"\",\n               \"EmailID\" : \"qe101683543713015@d.com\",\n               \"FirstName\" : \"Donald\",\n               \"LastName\" : \"Duck\",\n               \"DayPhone\" : \"+493028099508\",\n               \"MobilePhone\" : \"\",\n               \"CustomerAdditionalAddressList\" : {\n                  \"CustomerAdditionalAddress\" : [ {\n                     \"IsBillTo\" : \"Y\",\n                     \"IsDefaultBillTo\" : \"Y\",\n                     \"PersonInfo\" : {\n                        \"AddressLine1\" : \"Pariser Platz 4A\",\n                        \"City\" : \"Berlin\",\n                        \"Country\" : \"DE\",\n                        \"DayPhone\" : \"+493028099508\",\n                        \"EMailID\" : \"qe101683543713015@d.com\",\n                        \"FirstName\" : \"Donald\",\n                        \"LastName\" : \"Duck\",\n                        \"MiddleName\" : \"\",\n                        \"MobilePhone\" : \"\",\n                        \"ZipCode\" : \"10117\"\n                     }\n                  }, {\n                     \"IsShipTo\" : \"Y\",\n                     \"PersonInfo\" : {\n                        \"AddressLine1\" : \"Pariser Platz 4A\",\n                        \"City\" : \"Berlin\",\n                        \"Country\" : \"DE\",\n                        \"DayPhone\" : \"+493028099508\",\n                        \"EMailID\" : \"qe101683543713015@d.com\",\n                        \"FirstName\" : \"Donald\",\n                        \"LastName\" : \"Duck\",\n                        \"MiddleName\" : \"\",\n                        \"MobilePhone\" : \"\",\n                        \"ZipCode\" : \"10117\"\n                     }\n                  } ]\n               }\n            } ]\n         }\n      },\n      \"Order\" : {\n         \"AllocationRuleID\" : \"EMEA_SR\",\n         \"CarrierServiceCode\" : \"GLOBALE\",\n         \"CustomerEMailID\" : \"qe101683543713015@d.com\",\n         \"DepartmentCode\" : \"Disney_DE\",\n         \"Division\" : \"de_DE\",\n         \"DocumentType\" : \"0001\",\n         \"EnterpriseCode\" : \"DisneyEMEA\",\n         \"EntryType\" : \"WEB\",\n         \"OrderDate\" : \"2023-05-08T11:03:56.472Z\",\n         \"OrderNo\" : \"DECEVATS0999\",\n         \"OrderType\" : \"GE\",\n         \"PaymentStatus\" : \"PAID\",\n         \"SellerOrganizationCode\" : \"DisneyDE\",\n         \"SourcingClassification\" : \"Disney_DE\",\n         \"OrderLines\" : {\n            \"OrderLine\" : [ {\n               \"CarrierServiceCode\" : \"STANDARD_EMEA\",\n               \"DeliveryMethod\" : \"SHP\",\n               \"DepartmentCode\" : \"Disney_DE\",\n               \"FulfillmentType\" : \"HD\",\n               \"GiftFlag\" : \"N\",\n               \"GiftWrap\" : \"N\",\n               \"KitCode\" : \"\",\n               \"LineType\" : \"HD\",\n               \"OrderedQty\" : 1,\n               \"PrimeLineNo\" : 1,\n               \"SubLineNo\" : 1,\n               \"Item\" : {\n                  \"ItemDesc\" : \"Hasbro - Spider-Man: Far From Home - Spider-Man Actionfigur mit Accessoire, 15 cm\",\n                  \"ItemID\" : \"461010600022\",\n                  \"ItemShortDesc\" : \"Hasbro - Spider-Man: Far From Home - Spider-Man Actionfigur mit Accessoire, 15 cm\",\n                  \"ProductClass\" : \"GOOD\",\n                  \"UnitOfMeasure\" : \"EACH\"\n               },\n               \"PersonInfoShipTo\" : {\n                  \"AddressLine1\" : \"Pariser Platz 4A\",\n                  \"City\" : \"Berlin\",\n                  \"Country\" : \"DE\",\n                  \"DayPhone\" : \"+493028099508\",\n                  \"EMailID\" : \"qe101683543713015@d.com\",\n                  \"FirstName\" : \"Donald\",\n                  \"LastName\" : \"Duck\",\n                  \"MiddleName\" : \"\",\n                  \"MobilePhone\" : \"\",\n                  \"ZipCode\" : \"10117\"\n               },\n               \"Instructions\" : {\n                  \"Instruction\" : [ ]\n               },\n               \"LinePriceInfo\" : {\n                  \"IsPriceLocked\" : \"Y\",\n                  \"ListPrice\" : 10.92,\n                  \"RetailPrice\" : 10.92,\n                  \"UnitPrice\" : 10.92\n               },\n               \"LineCharges\" : {\n                  \"LineCharge\" : [ {\n                     \"ChargeCategory\" : \"GLOBALE_LINE\",\n                     \"ChargeName\" : \"DUTIES_TAXES_FEES\",\n                     \"ChargePerUnit\" : 2.07,\n                     \"Extn\" : {\n                        \"LocalChargePerUnit\" : 2.08\n                     }\n                  } ]\n               },\n               \"OrderDates\" : {\n                  \"OrderDate\" : [ {\n                     \"DateTypeId\" : \"Disney_Promise_Date\",\n                     \"ExpectedDate\" : \"2023-05-09T18:03:57.000Z\"\n                  } ]\n               },\n               \"OrderLineReservations\" : {\n                  \"OrderLineReservation\" : [ ]\n               },\n               \"Notes\" : {\n                  \"Note\" : [ {\n                     \"NoteText\" : \"[{\\\"price\\\":12.99,\\\"units\\\":1,\\\"priceAdjustments\\\":[]}]\",\n                     \"ReasonCode\" : \"proratedPrices\"\n                  }, {\n                     \"NoteText\" : \"[{\\\"price\\\":13,\\\"units\\\":1,\\\"priceAdjustments\\\":[]}]\",\n                     \"ReasonCode\" : \"geProratedPrices\"\n                  } ]\n               },\n               \"CustomAttributes\" : {\n                  \"RetailPriceBaseGross\" : \"12.99\",\n                  \"RetailPriceDiscountValueBaseGross\" : \"0.00\",\n                  \"RetailPriceLocalGross\" : \"13.00\",\n                  \"UnitPriceLocalGross\" : \"13.00\",\n                  \"GuestLineTotalLocalGross\" : \"13.00\",\n                  \"ListPriceLocalGross\" : \"13.00\"\n               },\n               \"Extn\" : {\n                  \"CartItemId\" : \"1\"\n               }\n            } ]\n         },\n         \"Instructions\" : {\n         },\n         \"PersonInfoShipTo\" : {\n            \"AddressLine1\" : \"Pariser Platz 4A\",\n            \"City\" : \"Berlin\",\n            \"Country\" : \"DE\",\n            \"DayPhone\" : \"+493028099508\",\n            \"EMailID\" : \"qe101683543713015@d.com\",\n            \"FirstName\" : \"Donald\",\n            \"LastName\" : \"Duck\",\n            \"MiddleName\" : \"\",\n            \"MobilePhone\" : \"\",\n            \"ZipCode\" : \"10117\"\n         },\n         \"PersonInfoBillTo\" : {\n            \"AddressLine1\" : \"Pariser Platz 4A\",\n            \"City\" : \"Berlin\",\n            \"Country\" : \"DE\",\n            \"DayPhone\" : \"+493028099508\",\n            \"EMailID\" : \"qe101683543713015@d.com\",\n            \"FirstName\" : \"Donald\",\n            \"LastName\" : \"Duck\",\n            \"MiddleName\" : \"\",\n            \"MobilePhone\" : \"\",\n            \"ZipCode\" : \"10117\"\n         },\n         \"PriceInfo\" : {\n            \"Currency\" : \"EUR\"\n         },\n         \"HeaderCharges\" : {\n            \"HeaderCharge\" : [ {\n               \"ChargeAmount\" : 0.0,\n               \"ChargeCategory\" : \"GLOBALE_HEADER\",\n               \"ChargeName\" : \"DUTIES_TAXES_FEES\",\n               \"Extn\" : {\n                  \"LocalChargeAmount\" : 0.0\n               }\n            }, {\n               \"ChargeAmount\" : 3.28,\n               \"ChargeCategory\" : \"SHIPPING_EMEA\",\n               \"ChargeName\" : \"SHIPPING_CHARGE\",\n               \"Reference\" : \"STANDARD_EMEA\",\n               \"Extn\" : {\n                  \"LocalChargeAmount\" : 3.9\n               }\n            } ]\n         },\n         \"PaymentMethods\" : {\n            \"PaymentMethod\" : [ {\n               \"PaymentReference1\" : \"DECEVATS0999\",\n               \"PaymentReference2\" : \"Visa\",\n               \"PaymentType\" : \"Prepaid\",\n               \"PaymentDetailsList\" : {\n                  \"PaymentDetails\" : [ {\n                     \"ChargeType\" : \"CHARGE\",\n                     \"ProcessedAmount\" : 16.27,\n                     \"RequestAmount\" : 16.27\n                  } ]\n               }\n            } ]\n         },\n         \"CustomAttributes\" : {\n            \"GuestCurrencyLocal\" : \"EUR\",\n            \"GuestTotalAmountLocal\" : \"16.9\",\n            \"OrderSubsidyLocal\" : \"0.0\"\n         },\n         \"Extn\" : {\n            \"OrderReference\" : \"GE10107454127NL\",\n            \"FormattedPhoneNumber\" : \"493028099508\"\n         }\n      }\n   }\n}"A




  

    //     "result": {
    
    //         "dataflows": [
    
    //             {
    
    //                 "dataflowName": "ORDER-IN-SFCC-DS-ORDERS",
    
    //                 "triggered": "Yes",
    
    //                 "rapiToWareHouse": "Yes",
    
    //                 "wareHouseToRapi": "Success",
    
    //                 "conversationId": "8500260486952771",
    
    //                 "failed": false,
    
    //                 "position": "1"
    
    //             },
    
    //             {
    
    //                 "dataflowName": "ORDER-STATUS-UPDATE",
    
    //                 "triggered": "Yes",
    
    //                 "rapiToWareHouse": "Yes",
    
    //                 "wareHouseToRapi":"{\"oms\":\"\<Order CustomerEMailID\=\\\"qe101683543713015@d.com\\\"\\n    DepartmentCode\=\\\"Disney_DE\\\" DocumentType\=\\\"0001\\\"\\n    EnterpriseCode\=\\\"DisneyEMEA\\\" EntryType\=\\\"WEB\\\"\\n    EventNameAction\=\\\"orderStatusUpdateRelease\\\" MaxOrderStatus\=\\\"3200\\\"\\n    OrderDate\=\\\"2023-05-08T11:03:56+00:00\\\"\\n    OrderHeaderKey\=\\\"202306271653214526116824\\\" OrderNo\=\\\"DECEVATS0999\\\"\\n    OrderType\=\\\"GE\\\" PaymentStatus\=\\\"PAID\\\"\\n    SellerOrganizationCode\=\\\"DisneyDE\\\" SourcingClassification\=\\\"Disney_DE\\\" Status\=\\\"Released\\\"\>\\n    \<Extn OrderReference\=\\\"GE10107454127NL\\\" ReboundOrderNo\=\\\"\\\"/\>\\n    \<PriceInfo Currency\=\\\"EUR\\\"/\>\\n    \<References/\>\\n    \<OrderHoldTypes\>\\n        \<OrderHoldType HoldType\=\\\"Remorse_Hold\\\" Status\=\\\"1300\\\" StatusDescription\=\\\"Resolved\\\"/\>\\n    \</OrderHoldTypes\>\\n    \<OrderLines\>\\n        \<OrderLine CarrierServiceCode\=\\\"STANDARD_EMEA\\\"\\n            DeliveryMethod\=\\\"SHP\\\" FulfillmentType\=\\\"HD\\\" GiftFlag\=\\\"N\\\"\\n            GiftWrap\=\\\"N\\\" KitCode\=\\\"\\\" LineType\=\\\"HD\\\"\\n            OrderHeaderKey\=\\\"202306271653214526116824\\\"\\n            OrderLineKey\=\\\"202306271653214526116826\\\" OrderedQty\=\\\"1\\\"\\n            PrimeLineNo\=\\\"1\\\" ReturnReason\=\\\"\\\" SubLineNo\=\\\"1\\\"\>\\n            \<Extn CartItemId\=\\\"1\\\" ParentCartItemId\=\\\"\\\"/\>\\n            \<Item\\n                ItemDesc\=\\\"Hasbro - Spider-Man: Far From Home - Spider-Man Actionfigur mit Accessoire, 15 cm\\\"\\n                ItemID\=\\\"461010600022\\\" ManufacturerItem\=\\\"\\\"\\n                ProductClass\=\\\"GOOD\\\" UnitCost\=\\\"0.00\\\" UnitOfMeasure\=\\\"EACH\\\"/\>\\n            \<LinePriceInfo ListPrice\=\\\"10.92\\\" RetailPrice\=\\\"10.92\\\" UnitPrice\=\\\"10.92\\\"/\>\\n            \<OrderDates\>\\n                \<OrderDate DateTypeId\=\\\"Disney_Promise_Date\\\"\\n                    ExpectedDate\=\\\"2023-05-09T18:03:57+00:00\\\" OrderLineKey\=\\\"202306271653214526116826\\\"/\>\\n                \<OrderDate DateTypeId\=\\\"SBA_ORDER_SCHEDULED\\\"\\n                    ExpectedDate\=\\\"2023-06-27T16:54:13+00:00\\\" OrderLineKey\=\\\"202306271653214526116826\\\"/\>\\n                \<OrderDate DateTypeId\=\\\"SBA_ORDER_RELEASED\\\"\\n                    ExpectedDate\=\\\"2023-06-27T17:09:44+00:00\\\" OrderLineKey\=\\\"202306271653214526116826\\\"/\>\\n            \</OrderDates\>\\n            \<OrderLineReservations/\>\\n            \<Instructions NumberOfInstructions\=\\\"0\\\"/\>\\n            \<Notes NumberOfNotes\=\\\"2\\\"\>\\n                \<Note\\n                    NoteText\=\\\"[{\&quot;price\&quot;:12.99,\&quot;units\&quot;:1,\&quot;priceAdjustments\&quot;:[]}]\\\" ReasonCode\=\\\"proratedPrices\\\"/\>\\n                \<Note\\n                    NoteText\=\\\"[{\&quot;price\&quot;:13,\&quot;units\&quot;:1,\&quot;priceAdjustments\&quot;:[]}]\\\" ReasonCode\=\\\"geProratedPrices\\\"/\>\\n            \</Notes\>\\n            \<CustomAttributes GuestLineTotalLocalGross\=\\\"13.00\\\"\\n                ListPriceLocalGross\=\\\"13.00\\\"\\n                OriginalUnitPriceLocalGross\=\\\"13.00\\\"\\n                RetailPriceBaseGross\=\\\"12.99\\\"\\n                RetailPriceDiscountValueBaseGross\=\\\"0.00\\\"\\n                RetailPriceLocalGross\=\\\"13.00\\\" UnitPriceLocalGross\=\\\"13.00\\\"/\>\\n            \<ItemDetails ItemID\=\\\"461010600022\\\"\\n                OrganizationCode\=\\\"DisneyEMEA\\\" UnitOfMeasure\=\\\"EACH\\\"\>\\n                \<PrimaryInformation IsReturnable\=\\\"N\\\" KitCode\=\\\"\\\"\\n                    ManufacturerItem\=\\\"\\\" ManufacturerName\=\\\"\\\"/\>\\n            \</ItemDetails\>\\n            \<LineCharges\>\\n                \<LineCharge ChargeAmount\=\\\"2.07\\\"\\n                    ChargeCategory\=\\\"GLOBALE_LINE\\\"\\n                    ChargeName\=\\\"DUTIES_TAXES_FEES\\\"\\n                    ChargeNameKey\=\\\"2022031609514018157085\\\"\\n                    ChargePerLine\=\\\"0.00\\\" ChargePerUnit\=\\\"2.07\\\"\\n                    InvoicedChargeAmount\=\\\"0.00\\\"\\n                    InvoicedChargePerLine\=\\\"0.00\\\"\\n                    InvoicedChargePerUnit\=\\\"0.00\\\" IsBillable\=\\\"Y\\\"\\n                    IsDiscount\=\\\"N\\\" Reference\=\\\"\\\"\\n                    RemainingChargeAmount\=\\\"2.07\\\"\\n                    RemainingChargePerLine\=\\\"0.00\\\" RemainingChargePerUnit\=\\\"2.07\\\"\>\\n                    \<Extn LocalChargePerUnit\=\\\"2.08\\\"/\>\\n                \</LineCharge\>\\n            \</LineCharges\>\\n            \<LineTaxes/\>\\n            \<OrderStatuses\>\\n                \<OrderStatus OrderHeaderKey\=\\\"202306271653214526116824\\\"\\n                    OrderLineKey\=\\\"202306271653214526116826\\\"\\n                    ShipNode\=\\\"CEVA_EU\\\" Status\=\\\"3200\\\"\\n                    StatusDate\=\\\"2023-06-27T17:09:44+00:00\\\"\\n                    StatusDescription\=\\\"Released\\\" StatusQty\=\\\"1\\\" TotalQuantity\=\\\"1\\\"/\>\\n            \</OrderStatuses\>\\n        \</OrderLine\>\\n    \</OrderLines\>\\n    \<CustomAttributes GuestCurrencyLocal\=\\\"EUR\\\"\\n        GuestTotalAmountLocal\=\\\"16.90\\\" OrderSubsidyLocal\=\\\"0.00\\\"/\>\\n    \<ProductServiceAssocs/\>\\n    \<OrderLineRelationships/\>\\n    \<Notes NumberOfNotes\=\\\"0\\\"/\>\\n    \<PersonInfoShipTo AddressLine1\=\\\"Pariser Platz 4A\\\" AddressLine2\=\\\"\\\"\\n        AddressLine3\=\\\"\\\" AddressLine4\=\\\"\\\" AddressLine5\=\\\"\\\" AddressLine6\=\\\"\\\"\\n        City\=\\\"Berlin\\\" Company\=\\\"\\\" Country\=\\\"DE\\\" DayPhone\=\\\"+493028099508\\\"\\n        EMailID\=\\\"qe101683543713015@d.com\\\" EveningPhone\=\\\"\\\"\\n        FirstName\=\\\"Donald\\\" LastName\=\\\"Duck\\\" MiddleName\=\\\"\\\" MobilePhone\=\\\"\\\"\\n        State\=\\\"\\\" ZipCode\=\\\"10117\\\"/\>\\n    \<PersonInfoBillTo AddressLine1\=\\\"Pariser Platz 4A\\\" AddressLine2\=\\\"\\\"\\n        AddressLine3\=\\\"\\\" AddressLine4\=\\\"\\\" AddressLine5\=\\\"\\\" AddressLine6\=\\\"\\\"\\n        City\=\\\"Berlin\\\" Company\=\\\"\\\" Country\=\\\"DE\\\" DayFaxNo\=\\\"\\\"\\n        DayPhone\=\\\"+493028099508\\\" EMailID\=\\\"qe101683543713015@d.com\\\"\\n        EveningPhone\=\\\"\\\" FirstName\=\\\"Donald\\\" LastName\=\\\"Duck\\\" MiddleName\=\\\"\\\"\\n        MobilePhone\=\\\"\\\" State\=\\\"\\\" ZipCode\=\\\"10117\\\"/\>\\n    \<PaymentMethods\>\\n        \<PaymentMethod CreditCardExpDate\=\\\"\\\" CreditCardName\=\\\"\\\"\\n            CreditCardType\=\\\"\\\" MaxChargeLimit\=\\\"16.27\\\"\\n            PaymentReference1\=\\\"DECEVATS0999\\\" PaymentReference2\=\\\"Visa\\\"\\n            PaymentReference3\=\\\"\\\" PaymentType\=\\\"Prepaid\\\"\\n            RequestedAuthAmount\=\\\"0.00\\\" RequestedChargeAmount\=\\\"0.00\\\"\\n            RequestedRefundAmount\=\\\"0.00\\\" TotalAuthorized\=\\\"0.00\\\"\\n            TotalCharged\=\\\"16.27\\\" TotalRefundedAmount\=\\\"0.00\\\"/\>\\n    \</PaymentMethods\>\\n    \<HeaderCharges\>\\n        \<HeaderCharge ChargeAmount\=\\\"0.00\\\"\\n            ChargeCategory\=\\\"GLOBALE_HEADER\\\"\\n            ChargeName\=\\\"DUTIES_TAXES_FEES\\\"\\n            ChargeNameKey\=\\\"2022031609504118157069\\\"\\n            InvoicedChargeAmount\=\\\"0.00\\\" IsBillable\=\\\"Y\\\" IsDiscount\=\\\"N\\\"\\n            Reference\=\\\"\\\" RemainingChargeAmount\=\\\"0.00\\\"\>\\n            \<Extn LocalChargeAmount\=\\\"0.00\\\"/\>\\n        \</HeaderCharge\>\\n        \<HeaderCharge ChargeAmount\=\\\"3.28\\\" ChargeCategory\=\\\"SHIPPING_EMEA\\\"\\n            ChargeName\=\\\"SHIPPING_CHARGE\\\"\\n            ChargeNameKey\=\\\"202012161040029495948\\\"\\n            InvoicedChargeAmount\=\\\"0.00\\\" IsBillable\=\\\"Y\\\" IsDiscount\=\\\"N\\\"\\n            Reference\=\\\"STANDARD_EMEA\\\" RemainingChargeAmount\=\\\"3.28\\\"\>\\n            \<Extn LocalChargeAmount\=\\\"3.90\\\"/\>\\n        \</HeaderCharge\>\\n    \</HeaderCharges\>\\n    \<HeaderTaxes/\>\\n\</Order\>\",\"target\":\"REBOUND\"}",
    
    //                 "conversationId": "8500689475904576",
    
    //                 "failed": false,
    
    //                 "position": "2"
    
    //             },
    
    //             {
    
    //                 "dataflowName": "RELEASE-UPDATE-OMS",
    
    //                 "triggered": "Yes",
    
    //                 "rapiToWareHouse": "Yes",
    
    //                 "wareHouseToRapi": "Success",
    
    //                 "conversationId": "8500435250661774",
    
    //                 "failed": false,
    
    //                 "position": "3"
    
    //             },
    
    //             {
    
    //                 "dataflowName": "RELEASE-OUT-OMS-CEVA",
    
    //                 "triggered": "Yes",
    
    //                 "rapiToWareHouse": "No",
    
    //                 "wareHouseToRapi": "No",
    
    //                 "conversationId": "8500435250661774",
    
    //                 "failed": true,
    
    //                 "position": "4"
    
    //             }
    
    //         ]
    
    //     }
    
    // }