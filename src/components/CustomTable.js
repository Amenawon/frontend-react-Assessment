import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headerCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

function CustomTable({ rows, headerCells, filterColumns, orderBy }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [tableOrderBy, setOrderBy] = React.useState(orderBy);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState("");
  const [tableRows, setTableRows] = React.useState(rows);

  useEffect(() => {
    console.log(rows, "rows");
    setTableRows(rows);
  }, [rows]);
  console.log(tableRows, "tablerows");
  const requestSearch = (searchedVal, filterColumns) => {
    let filteredRows = [];
    filterColumns.map((column) => {
      let tempFilteredRows = rows.filter((row) => {
        return row[column].toLowerCase().includes(searchedVal.toLowerCase());
      });
      tempFilteredRows.forEach((row) => {
        filteredRows.push(row);
      });
      return filteredRows;
    });
    setTableRows(filteredRows);
    console.log(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched, filterColumns);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = tableOrderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function descendingComparator(a, b, tableOrderBy) {
    if (b[tableOrderBy] < a[tableOrderBy]) {
      return -1;
    }
    if (b[tableOrderBy] > a[tableOrderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, tableOrderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, tableOrderBy)
      : (a, b) => -descendingComparator(a, b, tableOrderBy);
  }

  return (
    <div className="">
      <Paper className={classes.paper}>
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal, filterColumns)}
          onCancelSearch={() => cancelSearch()}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={tableOrderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableRows.length}
              headerCells={headerCells}
            />
            <TableBody>
              {stableSort(tableRows, getComparator(order, tableOrderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const cellValues = Object.values(row);
                  return (
                    <TableRow key={index}>
                      {cellValues.map((cell, index) => {
                        return (
                          <TableCell key={index} align="right">
                            {cell}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
export default CustomTable;
