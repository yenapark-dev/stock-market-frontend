import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import SearchSymbol from "../components/SearchSymbol";
import { useHistory } from "react-router-dom";
import { fetchStocks } from "../services/fmp";
import { Dropdown, Row, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/App.css";

const Stocks = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [inputQuery, setInputQuery] = useState("");
    const [rowData, setRowData] = useState([]);
    const [sector, setSector] = useState(null);
    const history = useHistory();

    const columns = [
        { headerName: "Symbol", field: "symbol", sortable: true },
        { headerName: "Name", field: "companyName", sortable: true },
        { headerName: "Sector", field: "sector", sortable: true },
        { headerName: "Price", field: "price", sortable: true },
    ];

    useEffect(() => {
        const fetchStocksList = async () => {
            try {
                const result = await fetchStocks();

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
    }, []);

    useEffect(() => {
        let filteredResults = [];
        filteredResults =
            data &&
            data.filter((stock) => {
                return (
                    stock.symbol.includes(inputQuery.toUpperCase()) ||
                    stock.companyName
                        .toUpperCase()
                        .includes(inputQuery.toUpperCase())
                );
            });

        if (sector) {
            filteredResults = filteredResults.filter(
                (symbol) => symbol.sector === sector
            );
        }

        setRowData(filteredResults);
    }, [inputQuery, data, sector]);

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

    let sectorList = [];
    rowData.map((stock) => sectorList.push(stock.sector));
    const sectors = [...new Set(sectorList)];

    return (
        <div>
            {/* Search by symbol, company name, sector */}
            <Row>
                <div className="search-symbol">
                    <SearchSymbol
                        onChange={setInputQuery}
                        value={inputQuery}
                    ></SearchSymbol>
                </div>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        {sector || "Sector..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onSelect={() => setSector("")}>
                            --Any Sector--
                        </Dropdown.Item>
                        {sectors.map((sector) => (
                            <Dropdown.Item
                                key={sector}
                                onSelect={setSector}
                                eventKey={sector}
                            >
                                {sector}
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

export default Stocks;
