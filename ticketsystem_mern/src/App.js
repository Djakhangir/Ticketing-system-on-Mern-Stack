import React from 'react'
import "./App.css";
// import Entry from './Pages/Entry/entry.page';
import DefaultLayout from './Layout/DefaultLayout';
// import Dashboard from './Pages/Dashboard/dashboard.page'
// import AddTicket from './Pages/New-ticket/AddTicket.page';
// import TicketList from './Pages/Ticket-List/TicketListing.page';
import Ticket from './Pages/Ticket/Ticket.page';

function App() {
  return (
    <div className="App">
      {/* <Entry/> */}
      <DefaultLayout>
        {/* <Dashboard/> */}
        {/* <AddTicket/> */}
        {/* <TicketList/> */}
        <Ticket/>
      </DefaultLayout>
    </div>
  )
}

export default App;
