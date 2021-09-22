import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { fetchStocksWithPrice } from "../services/fmp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Spinner, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Chart from "../components/Chart";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/App.css";

// After a user clicks a row on the stock page
const PriceHistory = ({ match }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [from, setFrom] = useState(new Date());
    const history = useHistory();

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
                const result = await fetchStocksWithPrice(match.params.symbol);
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
    }, [match.params.symbol]);

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {JSON.stringify(error)}
            </div>
        );
    }

    if (isLoading)
        return (
            <div className="spinner-border-container">
                <Spinner animation="border" role="status" size="xl">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );

    return (
        <div className="price-history-container">
            <div className="search-date">
                <h7>Search date from</h7>
            </div>
            <div>
                <DatePicker
                    selected={from}
                    onChange={(date) => setFrom(date)}
                />
                <Button
                    onClick={() => {
                        history.push(`/history/${match.params.symbol}/${from}`);
                    }}
                >
                    Search
                </Button>
                <div className="search-date">
                    <h7>Showing stocks for <b>{match.params.symbol}</b></h7>
                </div>
                <Container
                    className="ag-theme-balham"
                >
                    <AgGridReact
                        columnDefs={columns}
                        rowData={rowData}
                        pagination={true}
                    />
                </Container>
            </div>
            <p></p>
            <Chart data={rowData} />
        </div>
    );
};

export default PriceHistory;
