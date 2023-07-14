import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Entry from "./Pages/Entry/entry.page";
import PrivateRoute from "./Components/Private-Route/PrivateRouter.component";
import DefaultLayout from "./Layout/DefaultLayout";
import Dashboard from "./Pages/Dashboard/dashboard.page";
import AddTicket from "./Pages/New-ticket/AddTicket.page";
import TicketList from "./Pages/Ticket-List/TicketListing.page";
import Ticket from "./Pages/Ticket/Ticket.page";
import {Registration} from "./Pages/Registration/Registration.page";


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Entry />
          </Route>
          <Route exact path="/registration">
            <Registration />
          </Route>
          {/* <DefaultLayout> */}
          <PrivateRoute exact path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute path="/add-ticket">
            <AddTicket />
          </PrivateRoute>
          <PrivateRoute exact path="/tickets">
            <TicketList />
          </PrivateRoute>
          <PrivateRoute path="/ticket/:tId">
            <Ticket />
          </PrivateRoute>
          {/* </DefaultLayout> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
