import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useHistory } from "react-router-dom";
import { fetchStocks, fetchStocksWithPrice } from "../services/fmp";
import { Dropdown, Button, Row, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const History = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [symbol, setSymbol] = useState("");
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
                const result = await fetchStocksWithPrice(symbol);
                if (result["Error Message"]) {
                    setError(result);
                } else {
                    setData(result);
                }
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStocksList();
    }, [symbol]);

    function useSymbolData() {
        const [loading, setLoading] = useState(true);
        const [stocksAll, setSymbolData] = useState([]);
        const [error, setError] = useState(null);

        useEffect(() => {
            (async () => {
                try {
                    setSymbolData(await fetchStocks());
                    setLoading(false);
                } catch (err) {
                    setError(error);
                    setLoading(false);
                }
            })();
        }, []);
        return stocksAll;
    }

    let stockDataList = [];
    useSymbolData().map((stock) => stockDataList.push(stock.symbol));

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
        <div>
            <Row>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" >
                        {symbol || "Symbol..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        style={{ overflowY: "scroll", maxHeight: "500px" }}
                    >
                        <Dropdown.Item onSelect={() => setSymbol("")}>
                            --Any Symbol--
                        </Dropdown.Item>
                        {stockDataList.map((symbol) => (
                            <Dropdown.Item
                                key={symbol}
                                onSelect={setSymbol}
                                eventKey={symbol}
                            >
                                {symbol}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <div className="search-date">
                    <h7>Search date from</h7>
                </div>
                <DatePicker selected={from} onChange={date => setFrom(date)} />
                <Button 
                    onClick={() => {
                        if (symbol === "") {
                            history.push(`/history`)
                        }
                        else {
                            history.push(`/history/${symbol}/${from}`)
                        }
                    }}>
                    Search </Button>
            </Row>

            <div
                className="ag-theme-balham"
            >
                <AgGridReact
                    columnDefs={columns}
                    rowData={rowData}
                    pagination={true}
                />
            </div>
        </div>
    );
};

export default History;
