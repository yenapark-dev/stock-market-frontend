import React from "react";
import logo from "../img/logo.png";

export default function Home() {
    return (
        <div>
            <header className="App-header">

                <img className="home-logo" src={logo} alt="logo" />
                <div>
                    <p style={{ fontSize: "18px", fontFamily: "Courier New"}}>
                        <b>Welcome to the Stock Market Portal!</b> <br/><br/>
                        Click on <b>Stocks</b> to view all the available companies. <br/>
                        <b>Quote</b> to get the latest price information by stock symbol. <br />
                        Choose <b>History</b> to sample from the most recent one hundred
                        days of information for a particular stock. <br/><br/><br/>
                        <b>API: https://financialmodelingprep.com</b>
                </p>
                </div>
            </header>
        </div>
    );
}
