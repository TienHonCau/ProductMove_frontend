import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Modal,
  Stack,
  Paper,
  Button,
  Popover,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField
} from '@mui/material';
import Fade from '@mui/material/Fade';
// import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
// components

import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections

import { TransListHead, TransListToolbar } from '../../sections/@guarantee/transport';
// mock
// 
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
  { id: 'id', label: 'Mã đơn', alignRight: false },
  { id: 'code', label: 'Mã sản phẩm', alignRight: false },
  { id: 'quantity', label: 'Số lượng', alignRight: false },
  { id: 'nameAgency', label: 'Nhận từ', alignRight: false },
  { id: 'description', label: 'Lỗi', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: true },
  { id: 'date', label: 'Ngày bảo hành', alignRight: false },
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

export default function InsurancePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [createOpenEdit, setOpenEdit] = useState(false);

  const [createOpenEdit2, setOpenEdit2] = useState(false);

  const [BILLLIST, setBillList] = useState([]);

  const [factory, setFactory] = useState([]);

  const [rowData, setRowData] = useState({ _id: '',idGuarantee: sessionStorage.getItem('id'), idOrderGuarantee: '' });

  const [rowData1, setRowData1] = useState({ idGuarantee: sessionStorage.getItem('id'),idOrderGuarantee: '', code: '', idFactory: '' });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/guarantee/insurancing/${sessionStorage.getItem('id')}`);
        setBillList(res.data);
      } catch (err) {
        alert(err.message);
      }
    };
    getData();
  }, []);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
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

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const mapColor = (status) => {
    return (status === "Đang vận chuyển") ? 'warning' : (status === "Giao hàng thành công") ? 'success' : 'default';
  }

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

  const handleReturnAgency = async () => {
    try {
      await axios.post(`http://localhost:8000/guarantee/submit-gta`, rowData);
      window.location.reload();
    }
    catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  }
  const handleReturnFactory = async () => {
    try {
      await axios.post(`http://localhost:8000/guarantee/submit-gtf`, rowData1);
      window.location.reload();
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - BILLLIST.length) : 0;

  const filteredUsers = applySortFilter(BILLLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Insurance | ProductionMove </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lịch sử vận chuyển
          </Typography>
        </Stack>
        <Card>
          <TransListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TransListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={BILLLIST.length}
                  onRequestSort={handleRequestSort}

                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, code, quantity, nameAgency, status, date , description} = row;
                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" >
                        <TableCell padding="checkbox" />

                        <TableCell align='left'>{_id}</TableCell>
                        <TableCell align="left">{code}</TableCell>
                        <TableCell align="left">{quantity}</TableCell>
                        <TableCell align="left">{nameAgency}</TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="center"><Label color={mapColor(status)}>{status}</Label></TableCell>
                        <TableCell align="left" >{date}</TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => {
                            setRowData(rowData => ({
                              ...rowData,
                              idOrderGuarantee: row._id,
                              code: row.code,
                    
                            }));
                            setRowData1(rowData1 => ({
                              ...rowData1,
                              idOrderGuarantee: row._id,
                              code: row.code,
                    
                            }));
                            handleOpenMenu(e);

                          }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right" />

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
            count={BILLLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => { setOpenEdit(true) }}>
          <Iconify icon={'material-symbols:keyboard-return'} sx={{ mr: 2 }} />
          Trả lại đại lý
        </MenuItem>
        <MenuItem onClick={() => { setOpenEdit2(true) }}>
          <Iconify icon={'ph:key-return-light'} sx={{ mr: 2 }} />
          Trả về CSSX
        </MenuItem>
      </Popover>
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
              Đơn hàng
            </Typography>
            <TextField
              sx={{ margin: '15px 0' }}
              label="Mã đơn hàng "
              variant="standard"
              value={rowData.idOrderGuarantee}
              fullWidth
              type="text"
              disabled

            />

            <Button
              sx={{ marginTop: '10px' }}
              variant="contained"
              fullWidth
              type="submit"
              onClick={handleReturnAgency}
            >
              Trả lại
            </Button>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={createOpenEdit2}
        onClose={() => setOpenEdit2(false)}
        closeAfterTransition
      >
        <Fade in={createOpenEdit2}>
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
                  setRowData1(rowData1 => ({
                    ...rowData1,
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
              value={rowData1.code}
              disabled
            />

            <Button
              sx={{ marginTop: '10px' }}
              variant="contained"
              fullWidth
              type="submit"
              onClick={handleReturnFactory}
            >
              Trả lại
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}