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
    TextField,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';
import Fade from '@mui/material/Fade';

// import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
// components


import Scrollbar from '../../components/scrollbar';
// sections

import { ProductListHead, ProductListToolbar } from '../../sections/@agency/product';
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
    { id: '_id', label: 'id', alignRight: false },
    { id: 'code', label: 'Mã sản phẩm', alignRight: false },
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

export default function SellPage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('code');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [createOpenEdit, setOpenEdit] = useState(false);
    const [PRODUCTLIST, setProductList] = useState([]);
    const [rowData, setRowData] = useState({ _id: '', idAgency: '', code: '', quantity: '', quantitySell: '', nameCustomer: '', address: '', sdt: '' });


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


    const handleClickSell = async () => {
        try {
            await axios.post('http://localhost:8000/agency/sell-product', rowData);
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
                <title> Sales | ProductionMove </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Bán sản phẩm
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
                                        const { _id, idFactory, code, quantity, createdAt, updatedAt, _v } = row;
                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                                                <TableCell />

                                                <TableCell align='left'>{_id}</TableCell>

                                                <TableCell align="left">{code}</TableCell>


                                                <TableCell align="left">{quantity}</TableCell>
                                                <TableCell align="right">
                                                    <Button onClick={(e) => {
                                                        setOpenEdit(true);
                                                        setRowData(rowData => ({
                                                            ...rowData,
                                                            _id: row._id,
                                                            idAgency: sessionStorage.getItem('id'),
                                                            code: row.code,
                                                            quantity: row.quantity,
                                                        }));
                                                    }}>
                                                        Bán
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
                            Nhập thông tin đơn hàng
                        </Typography>

                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Tên khách hàng"
                            variant="standard"
                            fullWidth
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    nameCustomer: e.target.value,
                                }))
                            }}
                            required
                        />
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Địa chỉ"
                            variant="standard"
                            fullWidth
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    address: e.target.value,
                                }))
                            }}
                            required
                        />
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Số điện thoại"
                            variant="standard"
                            fullWidth
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    sdt: e.target.value,
                                }))
                            }}
                            required
                        />
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
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    quantitySell: e.target.value,
                                }))
                            }}
                            required
                        />
                        <Button
                            sx={{ marginTop: '10px' }}
                            variant="contained"
                            fullWidth
                            type="submit"
                            onClick={handleClickSell}
                        >
                            Giao hàng
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
