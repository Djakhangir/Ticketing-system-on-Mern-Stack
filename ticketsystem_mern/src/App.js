import React from 'react'
import "./App.css";
import Entry from './Pages/Entry/entry.page';
import DefaultLayout from './Layout/DefaultLayout';
import Dashboard from './Pages/Dashboard/dashboard.page'

function App() {
  return (
    <div className="App">
      {/* <Entry/> */}
      <DefaultLayout>
        <Dashboard/>
      </DefaultLayout>
    </div>
  )
}

export default App;
