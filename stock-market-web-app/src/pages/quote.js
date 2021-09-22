import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useHistory } from "react-router-dom";
import { fetchStocks, fetchStocksForQuote } from "../services/fmp";
import { Dropdown, Row, Spinner } from "react-bootstrap";

const Quote = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [symbol, setSymbol] = useState("");
    const history = useHistory();

    const columns = [
        { headerName: "Name", field: "name", sortable: true },
        { headerName: "Price", field: "price", sortable: true },
        { headerName: "Open", field: "open", sortable: true },
        { headerName: "Day Low", field: "dayLow", sortable: true },
        { headerName: "Day High", field: "dayHigh", sortable: true },
        { headerName: "Latest time", field: "timestamp", sortable: true },
    ];

    useEffect(() => {
        const fetchStocksList = async () => {
            try {
                const result = await fetchStocksForQuote(symbol);

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
    useSymbolData().map((stock) => (
        stockDataList.push(stock.symbol)
    ))


    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {JSON.stringify(error)}
            </div>
        );
    }

    if (isLoading)
        return (
            <div className="spinner-border" role="status">
                <Spinner animation="border" role="status" size="xl">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );



    return (
        <div>
            {/* Search by symbol, company name, sector */}
            <Row>
                <Dropdown style={{ display: "flex", justifyContent: "stretch" }}>
                    <Dropdown.Toggle id="dropdown-basic">
                        {symbol || "Symbol..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ overflowY: 'scroll', maxHeight: '500px' }}>
                        <Dropdown.Item onSelect={() => setSymbol("")}>
                            --Any Symbol--
                        </Dropdown.Item>
                        {
                            stockDataList.map((symbol) => (
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
            </Row>

            <div
                className="ag-theme-balham"
            >
                <AgGridReact
                    columnDefs={columns}
                    rowData={rowData}
                    pagination={true}
                    onRowClicked={(event) => {
                        history.push(`/history/${event.data.symbol}`);
                    }}
                />
            </div>
        </div>
    );
};

export default Quote;
