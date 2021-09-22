import "../css/App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap/";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "../pages/home";
import Stocks from "../pages/stocks";
import Quote from "../pages/quote";
import History from "../pages/history";
import PriceHistory from "../pages/priceHistory";
import DateHistory from "../pages/dateHistory";

function NavBar() {
    return (
        <Router>
            <Navbar bg="#FBFDEF" expand="md" style={{ fontFamily: "Courier New" }}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink exact to="/" activeClassName="active">
                            <h1>Home</h1>
                        </NavLink>
                        <NavLink exact to="/stocks" activeClassName="active">
                            <h1>Stocks</h1>
                        </NavLink>
                        <NavLink exact to="/quote" activeClassName="active">
                            <h1>Quote</h1>
                        </NavLink>
                        <NavLink exact to="/history" activeClassName="active">
                            <h1>History</h1>
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path="/stocks">
                    <Stocks />
                </Route>
                <Route exact path="/quote">
                    <Quote />
                </Route>
                <Route path="/history/:symbol/:date" component={DateHistory} />
                <Route path="/history/:symbol" component={PriceHistory} />
                <Route path="/history">
                    <History />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

export default NavBar;
