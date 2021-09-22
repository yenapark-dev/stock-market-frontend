import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { fetchStocksWithDate } from "../services/fmp";
import Chart from "../components/Chart";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/App.css";

// After a user clicks the search on the history page
const DateHistory = ({ match }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowData, setRowData] = useState([]);

    const columns = [
        { headerName: "Date", field: "date", sortable: true },
        { headerName: "Open", field: "open", sortable: true },
        { headerName: "High", field: "high", sortable: true },
        { headerName: "Low", field: "low", sortable: true },
        { headerName: "Close", field: "close", sortable: true },
        { headerName: "Volume", field: "volume", sortable: true },
    ];

    useEffect(() => {
        const fetchStocksList = async () => {
            try {
                const result = await fetchStocksWithDate(match.params);
                if (result["Error Message"]) {
                    setError(result);
                } else {
                    setRowData(result);
                }
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStocksList();
    }, [match.params]);

    if (isLoading)
        return (
            <div className="spinner-border-container">
                <Spinner animation="border" role="status" size="xl">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );

    if (rowData.length === 0) {
        return (
            <div className="alert alert-danger" role="alert">
                There is no data.
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {JSON.stringify(error)}
            </div>
        );
    }

    return (
        <div className="search-date">
            <h7>Showing stocks for <b>{match.params.symbol}</b></h7>
            <div className="ag-theme-balham"
                style={{ height: "500px", width: "700px" }}>
                <AgGridReact
                    columnDefs={columns}
                    rowData={rowData}
                    pagination={true}
                />
                <Chart
                    data={rowData}
                />
            </div>
        </div>
    );
};

export default DateHistory;
