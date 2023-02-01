import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
// components

import Scrollbar from '../../components/scrollbar';
// sections

import { ProductListHead, ProductListToolbar } from '../../sections/@guarantee/product';

const TABLE_HEAD = [
  { id: 'id', label: 'Mã đơn', alignRight: false },
  { id: 'code', label: 'Mã sản phẩm', alignRight: false },
  { id: 'quanity', label: 'Số lượng', alignRight: false },
  { id: 'from', label: 'Nhận từ', alignRight: false },
  { id: 'createdAt', label: 'Ngày giao', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.code.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ReceivePage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('code');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [PRODUCTLIST, setProductList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/delivery/atg-delivering/${sessionStorage.getItem('id')}`);
        setProductList(res.data);
      } catch (err) {
        alert(err.message);
      }
    };
    getData();
  }, []);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const handleImport = async (idD) => {
    try {
      const res = await axios.post(`http://localhost:8000/guarantee/submit-atg`, { idOrderGuarantee: idD }
      );
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTLIST.length) : 0;

  const filteredUsers = applySortFilter(PRODUCTLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Receive | ProductionMove </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Nhận sản phẩm
          </Typography>

        </Stack>

        <Card>
          <ProductListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={PRODUCTLIST.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, code, quantity, nameAgency, date } = row;
                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                        <TableCell />

                        <TableCell align='left'>{_id}</TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="left">{nameAgency}</TableCell>

                        <TableCell align="left">{date}</TableCell>

                        <TableCell align="right">
                          <Button onClick={() => {
                            handleImport(row._id);
                          }}>
                            Tiếp nhận
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={PRODUCTLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
