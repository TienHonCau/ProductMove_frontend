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
  Select,
  InputLabel,
  Popover,
  TableRow,
  FormControl,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Fade from '@mui/material/Fade';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import axios from 'axios';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@admin/user';
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
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'role', label: 'Vai trò', alignRight: false },
  { id: 'date', label: 'Ngày tạo', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [createPanelOpen, setCreatePanelOpen] = useState(false);

  const [createOpenEdit, setOpenEdit] = useState(false);

  const [USERLIST, setUserlist] = useState([]);

  const [rowData, setRowData] = useState({ _id: '', name: '', username: '', password: '', role: '' });

  const [user, setUser] = useState({ _id: '', name: '', username: '', password: '', role: '', address: '', sdt: '' });

  const [id, setId] = useState('');


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/user');
        setUserlist(res.data);
      } catch (err) {
        alert(err.message);
      }
    };
    getData();
  }, []);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/user/create", user);
      window.location.reload();
    }
    catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/user/update/${id}`, rowData
      );
      if (res.data.update) {
        window.location.reload();
        alert(res.data.msg);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/user/delete/${id}`);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | ProductionMove </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tài khoản
          </Typography>
          <Button variant="contained" onClick={() => setCreatePanelOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
            Cấp tài khoản
          </Button>

        </Stack>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name, username, role, date } = row;
                    return (
                      <TableRow hover key={_id} >
                        <TableCell />

                        <TableCell align='left'>{name}</TableCell>

                        <TableCell align="left">{username}</TableCell>


                        <TableCell align="left">{role}</TableCell>

                        <TableCell align="left" >{date}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => {
                            handleOpenMenu(e);
                            setId(row._id);
                            setRowData(rowData => ({
                              ...rowData,
                              _id: row._id,
                              name: row.name,
                              username: row.username,
                              password: row.password,
                              role: row.role
                            }));
                          }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
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
            count={USERLIST.length}
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
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>

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
                Sửa tài khoản
              </Typography>
              <ValidatorForm onSubmit={handleUpdate}>
                <TextValidator
                  sx={{ marginTop: '10px' }}
                  fullWidth
                  value={rowData._id}
                  label="ID"
                  variant="standard"
                  color="secondary"
                  disabled
                />
                <TextValidator
                  sx={{ marginTop: '10px' }}
                  fullWidth
                  value={rowData.name}
                  label="Tên"
                  variant="standard"
                  color="secondary"
                  disabled
                />
                <TextValidator
                  sx={{ marginTop: '10px' }}
                  fullWidth
                  value={rowData.username}
                  label="Username"
                  variant="standard"
                  color="secondary"
                  disabled
                />
                <TextValidator
                  sx={{ marginTop: '10px' }}
                  fullWidth
                  label="Vai trò"
                  value={rowData.role}
                  variant="standard"
                  color="secondary"
                  disabled
                />
                <TextValidator
                  sx={{ marginTop: '10px' }}
                  fullWidth
                  label="Mật khẩu"
                  variant="standard"
                  color="secondary"
                  onChange={(e) => {
                    setRowData(rowData => ({
                      ...rowData,
                      password: e.target.value,
                    }))
                  }} required />
                <Button
                  sx={{ marginTop: '10px' }}
                  variant="contained"
                  fullWidth
                  type="submit"
                >
                  Chỉnh sửa
                </Button>
              </ValidatorForm>
            </Box>
          </Fade>
        </Modal>
      </Popover>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={createPanelOpen}
        onClose={() => setCreatePanelOpen(false)}
        closeAfterTransition
      >
        <Fade in={createPanelOpen}>
          <Box sx={styleModal}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Thêm tài khoản
            </Typography>
            <ValidatorForm onSubmit={handleCreate}>
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Tên"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setUser(user => ({
                    ...user,
                    name: e.target.value,
                  }))
                }}
                required
              />
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Username"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setUser(user => ({
                    ...user,
                    username: e.target.value,
                  }))
                }}
                required
              />
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Mật khẩu"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setUser(user => ({
                    ...user,
                    password: e.target.value,
                  }))
                }}
                required
              />
              <FormControl required variant='standard' fullWidth sx={{ margin: '15px 0' }}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="role"
                  onChange={(e) => {
                    setUser(user => ({
                      ...user,
                      role: e.target.value,
                    }))
                  }}
                  required
                >
                  <MenuItem key='1' value={'admin'}>Quản trị viên</MenuItem>
                  <MenuItem key='2' value={'factory'}>Cơ sở sản xuất</MenuItem>
                  <MenuItem key='3' value={'agency'}>Đại lý</MenuItem>
                  <MenuItem key='4' value={'guarantee'}>Trung tâm bảo hành</MenuItem>
                </Select>
              </FormControl>
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Địa chỉ"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setUser(user => ({
                    ...user,
                    address: e.target.value,
                  }))
                }}
                required
              />
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Số điện thoại"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setUser(user => ({
                    ...user,
                    sdt: e.target.value,
                  }))
                }}
                required
              />

              <Button
                sx={{ marginTop: '10px' }}
                variant="contained"
                fullWidth
                type="submit"
              >
                Thêm
              </Button>
            </ValidatorForm>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
