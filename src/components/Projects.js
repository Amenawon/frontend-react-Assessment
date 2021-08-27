import CustomTable from "./CustomTable.js";
import Loader from "./Loader.js";
import React, { useEffect, useState } from "react";
import HttpService from "../services/httpService";

function Projects() {
  const [appState, setAppState] = useState({
    loading: false,
    projects: []
  });
  const [appRows, setRows] = useState([]);

  useEffect(() => {
    setAppState({ loading: true });
    let httpService = new HttpService();
    httpService.getData().then((response) => {
      const projects = response;
      setAppState({ loading: false, projects: projects });
      const rows = projects.map((project) => ({
        project: project.project,
        description: project.description,
        startDate: formatDate(project["start date"]),
        category: project.category,
        responsible: project.responsible,
        savingsAmt: project["savings amount"],
        complexity: project.complexity,
        currency: project.currency
      }));
      setRows(rows);
    });
  }, [setAppState, setRows]);

  function formatDate(stringDate) {
    const date = new Date(stringDate);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    return `${d < 10 ? `0${d}` : d}.${m < 10 ? `0${m}` : m}.${y}`;
  }
  const headerCells = [
    { id: "project", numeric: false, disablePadding: true, label: "Project" },
    {
      id: "description",
      numeric: true,
      disablePadding: false,
      label: "Description"
    },
    {
      id: "startDate",
      numeric: true,
      disablePadding: false,
      label: "Start Date"
    },
    { id: "category", numeric: true, disablePadding: false, label: "Category" },
    {
      id: "responsible",
      numeric: true,
      disablePadding: false,
      label: "Responsible"
    },
    {
      id: "savingsAmt",
      numeric: true,
      disablePadding: false,
      label: "Savings Amount"
    },
    {
      id: "complexity",
      numeric: true,
      disablePadding: false,
      label: "Complexity"
    },
    { id: "currency", numeric: true, disablePadding: false, label: "Currency" }
  ];
  const filterColumns = ["description"];
  const orderBy = "startDate";
  return (
    <div className="Projects">
      {appState.loading ? (
        <Loader></Loader>
      ) : (
        <CustomTable
          rows={appRows}
          headerCells={headerCells}
          filterColumns={filterColumns}
          orderBy={orderBy}
        ></CustomTable>
      )}
    </div>
  );
}

export default Projects;
