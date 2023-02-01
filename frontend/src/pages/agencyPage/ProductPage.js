import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Box,
  TextField,
  Modal,
  Fade,
  Paper,
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

import { ProductListHead, ProductListToolbar } from '../../sections/@agency/product';
// mock
// 
import { fCurrency } from '../../utils/formatNumber';
// ----------------------------------------------------------------------

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 3,
};

const TABLE_HEAD = [
  { id: '_id', label: 'id', alignRight: false },
  { id: 'code', label: 'Mã sản phẩm', alignRight: false },
  { id: 'name', label: 'Tên sản phẩm', alignRight: false },
  { id: 'price', label: 'Giá sản phẩm', alignRight: false },
  { id: 'quanity', label: 'Số lượng', alignRight: false },
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

export default function ProductPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('code');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [PRODUCTLIST, setProductList] = useState([]);

  const [factory, setFactory] = useState([]);

  const [createOpenEdit, setOpenEdit] = useState();
  const [rowData, setRowData] = useState({ idAgency: sessionStorage.getItem('id'), code: '', quantity: '', idFactory: '' });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/agency/storage/${sessionStorage.getItem('id')}`);
        setProductList(res.data);
      } catch (err) {
        alert(err.message);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getFactory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/factory`);
        setFactory(res.data);
      } catch (err) {
        alert(err.message);
      }
    };
    getFactory();
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

  const handleClickReturn = async () => {
    try {
      await axios.post(`http://localhost:8000/agency/submit-atf`, rowData);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTLIST.length) : 0;

  const filteredUsers = applySortFilter(PRODUCTLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Product | ProductionMove </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản lý sản phẩm
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
                    const { _id, code, quantity, name, price } = row;
                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                        <TableCell />

                        <TableCell align='left'>{_id}</TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{fCurrency(price)}</TableCell>

                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align='left'><Button onClick={(e) => {
                          setRowData(rowData => ({
                            ...rowData,
                            code: row.code,
                          }));
                          setOpenEdit(true);
                        }}>Trả về CSSX</Button></TableCell>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={createOpenEdit}
        onClose={() => setOpenEdit(false)}
        closeAfterTransition
      >
        <Fade in={createOpenEdit}>
          <Box sx={styleModal}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Nhập thông tin vận chuyển
            </Typography>
            <FormControl required variant='standard' fullWidth sx={{ margin: '15px 0' }}>
              <InputLabel id="demo-simple-select-label">Cơ sở sản xuất</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Factory"
                onChange={(e) => {
                  setRowData(rowData => ({
                    ...rowData,
                    idFactory: e.target.value,
                  }))
                }}
                required
              >
                {(factory).map((row) => {
                  const { _id, name } = row;
                  return (
                    <MenuItem key={_id} value={_id}>{name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              sx={{ margin: '15px 0' }}
              label="Mã sản phẩm"
              variant="standard"
              fullWidth
              type="text"
              value={rowData.code}
              disabled
            />
            <TextField
              sx={{ margin: '15px 0' }}
              label="Số lượng"
              variant="standard"
              fullWidth
              type="number"
              onChange={(e) => {
                setRowData(rowData => ({
                  ...rowData,
                  quantity: e.target.value,
                }))
              }}
              required
            />

            <Button
              sx={{ marginTop: '10px' }}
              variant="contained"
              fullWidth
              type="submit"
              onClick={handleClickReturn}
            >
              Trả lại
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
