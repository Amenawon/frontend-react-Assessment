import './App.css';
import Table from './components/Table.js';
import Loader from './components/Loader.js';
import React, { useEffect, useState } from 'react';
import HttpService from './services/httpService';

function App() {

  const [appState, setAppState] = useState({
    loading: false,
    projects: [],
  });

  useEffect(() => {
    setAppState({ loading: true });
    let httpService = new HttpService();
    httpService.getData().then((response) => {
      const projects = response;
      console.log(projects)
      setAppState({ loading: false, projects: projects });
    });
  }, [setAppState]);


  return (
    <div className="App">
    {appState.loading ? 
    <Loader></Loader> :
    <Table></Table>
    }
    </div>
  );
}

export default App;
