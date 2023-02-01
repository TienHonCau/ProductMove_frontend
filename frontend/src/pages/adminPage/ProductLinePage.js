import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Grid,
  Table,
  Modal,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  Divider,
  TableCell,
  Container,
  Typography,
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
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 3,
};
const TABLE_HEAD = [
  { id: '_id', label: 'id', alignRight: false },
  { id: 'productLine', label: 'Tên dòng sản phẩm', alignRight: false },
  { id: 'madeIn', label: 'Xuất xứ', alignRight: false },
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

export default function ProductLinePage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [createPanelOpen, setCreatePanelOpen] = useState(false);

  const [USERLIST, setUserlist] = useState([]);

  const [productLines, setProductLine] = useState({ _id: '', productLine: '', description: '', image: '' })

  const [add, setAdd] = useState({ productLine: '', madeIn: '', description: '', image: '' })
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/product/productlines');
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

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:8000/product/productline-create", add);
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
            Dòng sản phẩm
          </Typography>
          <Button variant="contained" onClick={() => setCreatePanelOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm
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
                    const { _id, productLine, madeIn } = row;
                    return (
                      <TableRow hover key={_id} >
                        <TableCell />

                        <TableCell align='left'>{_id}</TableCell>

                        <TableCell align="left">{productLine}</TableCell>

                        <TableCell align="left" >{madeIn}</TableCell>

                        <TableCell align="right">
                          <Button onClick={(e) => {
                            handleOpenMenu(e);
                            setProductLine(productLines => ({
                              ...productLines,
                              _id: row._id,
                              productLine: row.productLine,
                              description: row.description,
                              image: row.image,
                              createdAt: row.createdAt
                            }));
                          }}>
                            Xem chi tiết
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
            count={USERLIST.length}
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
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
      >
        <Paper sx={styleModal}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5.5} lg={3.5}>
              <img src={`${productLines.image}`}
                alt='hihi' />
            </Grid>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Grid item xs={12} md={6} lg={8}>
              <Typography variant="string" component="h3">
                Tên:
              </Typography>
              <Typography variant="string" component="p">
                {productLines.productLine}
              </Typography>
              <Typography variant="string" component="h3">
                Mô tả:
              </Typography>
              <Typography variant="string" component="p">
                {productLines.description}
              </Typography>
            </Grid>
          </Grid>
          <Button
            style={{ position: "absolute", top: "10px", right: "10px" }}
            variant='contained'
            color='error'
            onClick={() => setOpen(false)}
          >
            X
          </Button>
        </Paper>
      </Modal>
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
              Thêm dòng sản phẩm
            </Typography>
            <ValidatorForm onSubmit={handleAdd}>
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Tên"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setAdd(add => ({
                    ...add,
                    productLine: e.target.value,
                  }))
                }}
                required
              />
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Xuất xứ"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setAdd(add => ({
                    ...add,
                    madeIn: e.target.value,
                  }))
                }}
                required
              />
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Mô tả"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setAdd(add => ({
                    ...add,
                    description: e.target.value,
                  }))
                }}
                required
              />
              <TextValidator
                sx={{ marginTop: '10px' }}
                fullWidth
                label="Link ảnh"
                variant="standard"
                color="secondary"
                onChange={(e) => {
                  setAdd(add => ({
                    ...add,
                    image: e.target.value,
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
