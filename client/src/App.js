
import React, { useState, createContext } from "react";
import { v4 as uuidv4 } from 'uuid';

import DisplayRecord from "./components/DisplayRecord";
import Header from "./components/Header";
import MainComponent from "./components/MainComponent";
import Footer from "./components/Footer"
import Settings from "./components/Settings";

export const AppContext = createContext();

function App() {
  const [toggleMainComponent, setToggleMainComponent] = useState(true);
  const [toggleSettings, setToggleSettings] = useState(false)
  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filterValues, setFilterValues] = useState([{
    id: uuidv4(),
    innerFilters: [{
      innerID: uuidv4(),
      selectedFilterTable: '',
      selectedColumn: '',
      operator: '',
      inputValue: ''
    }],
    condition: ['AND']
  }])
  const [outerConditionState, setOuterConditionState] = useState(['AND']);
  const [records, setRecords] = useState([]);
  const [saveQuery, setSaveQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState('ASC');
  const [sortedColumn, setSortedColumn] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <AppContext.Provider
        value={{
          toggleMainComponent, setToggleMainComponent, // toggle home
          toggleSettings, setToggleSettings, //toggle settings
          selectedTable, setSelectedTable, // main table
          selectedColumns, setSelectedColumns, // main columns, checkboxes 
          filterValues, setFilterValues, // Inner Filter Values
          outerConditionState, setOuterConditionState, //outer condition clause AND OR
          records, setRecords, //display records in tables
          saveQuery, setSaveQuery,
          order, setOrder, // ASC or DESC
          sortedColumn, setSortedColumn, // selected Column to sort
          limit, setLimit, // set limit
          errorMessage, setErrorMessage,
          loading, setLoading
        }}
      >
        <div>
          <Header />

          {toggleMainComponent &&
            <div className="Home">
              <MainComponent />
              <DisplayRecord />
            </div>
          }


          {toggleSettings &&
            <div className="Settings">
              <Settings />
            </div>
          }
        </div>


        <Footer />

      </AppContext.Provider >
    </div>

  );
}

export default App;
