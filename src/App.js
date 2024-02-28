import logo from './logo.svg';

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { ModuleRegistry } from '@ag-grid-community/core';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';

ModuleRegistry.registerModules([ExcelExportModule]);


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rowData,setRowData] = useState([
    {blockNumber:'',hash:'',to:"",value:"",gas:"",gasPrice:"",gasUsed:"",functionName:""}
   ]);
  
   const [columnDefs,setColumnsDef] = useState( [
    {field:'blockNumber',sortable:true,filter:true},
    {field:"hash",sortable:true,filter:true},
    {field:"to",sortable:true,filter:true},
    {field:"value",sortable:true,filter:true},
    {field:"gas",sortable:true,filter:true},
    {field:"gasPrice",sortable:true,filter:true},
    {field:"gasUsed",sortable:true,filter:true},
    {field:"functionName",sortable:true,filter:true}
   ]);
   const fetchData = async ()=>{
    const response = await fetch("https://api.etherscan.io/api?module=account&action=txlist&address=0x6Fb447Ae94F5180254D436A693907a1f57696900&startblock=16689267&endblock=18982605&sort=asc&apikey=S28V2CPN21XSE6WNAMPYH13MTRHVUH8C8H")
    const data = await response.json()
    if(data){
      console.log("Data come",data)
      setRowData(data.result)
      setIsLoggedIn(true)
    }else{
      console.log("Not com statement ",isLoggedIn)
    }
   }
  //  console.log("Data In")
  useEffect(()=>{
    fetchData()
  },[])
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };
  const exportDataAsCsv = () => {
    if (gridApi) {
      console.log("Function In",gridApi.exportDataAsExcel())
      gridApi.exportDataAsCsv();
    }
  };
  const hideColumn = (columnName) => {
    if (columnApi) {
      columnApi.setColumnVisible(columnName, false);
    }
  };

  const handleOptionChange = (e)=>{
        //  console.log(e.target.value)
         hideColumn(e.target.value)
  }
  return (
     <>
     <div>
      <button onClick={()=>exportDataAsCsv()}>Export</button>
        <select onChange={handleOptionChange}>
        {columnDefs.map((item)=>{
            return(<option>{item.field}</option>)
        })}
        </select>
      <div className="ag-theme-alpine" style={{ height: '500px' }}>
     {isLoggedIn ? (
        <AgGridReact 
        rowData = {rowData}
        columnDefs = {columnDefs}
        onGridReady={onGridReady}
       />
      ):(<div><p>The Data is Loading.. Please wait</p></div>)}
    </div>
    </div>
     </>
    

  
  );
}

export default App;
