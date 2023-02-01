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

import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
// sections

import { TransListHead, TransListToolbar } from '../../sections/@factory/transport';
// mock
// 
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '_id', label: 'Mã đơn', alignRight: true },
    { id: 'nameCustomer', label: 'Khách hàng', alignRight: true },
    { id: 'code', label: 'Mã sản phẩm', alignRight: true },
    { id: 'quantity', label: 'Số lượng', alignRight: true },
    { id: 'nameGuarantee', label: 'Bảo hành tại', alignRight: true },
    { id: 'createdAt', label: 'Ngày bảo hành', alignRight: true },
    { id: 'status', label: 'Trạng thái', alignRight: false },
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

export default function ProductInsurancePage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');


    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [BILLLIST, setBillList] = useState([]);


    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/delivery/atg/${sessionStorage.getItem('id')}`);
                setBillList(res.data);
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
    const mapColor = (status) => {
        return (status === "Đang bảo hành") ? 'warning' : (status === "Khách đã nhận") ? 'success' : (status === "Lỗi-Không sửa được") ? 'error' : 'default';
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
    const handleReturn = async (idBill) => {
        try {
            const body = {};
            body.idOrderGuarantee = idBill;
            await axios.post(`http://localhost:8000/agency/submit-atc`, body);
            window.location.reload();
        } catch (err) {
            alert(err.message);
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
                        Sản phẩm cần bảo hành
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
                                        const { _id, code, quantity, nameCustomer, nameGuarantee, status, date } = row;
                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                                                <TableCell padding="checkbox" />
                                                <TableCell align='left'>{_id}</TableCell>
                                                <TableCell align='left'>{nameCustomer}</TableCell>
                                                <TableCell align="left">{code}</TableCell>
                                                <TableCell align="left">{quantity}</TableCell>
                                                <TableCell align="left">{nameGuarantee}</TableCell>
                                                <TableCell align="left" >{date}</TableCell>
                                                {(status === 'Đang vận chuyển' || status === 'Đang bảo hành' || status === 'Khách đã nhận' || status === 'Lỗi-Không sửa được') &&
                                                    (<TableCell align="center"><Label color={mapColor(status)}>{status}</Label></TableCell>)}
                                                {(status !== 'Đang vận chuyển' && status !== 'Đang bảo hành' && status !== 'Khách đã nhận' && status !== 'Lỗi-Không sửa được') &&
                                                    (<TableCell align="center"><Button onClick={() => { handleReturn(_id); }} sx={{ fontSize: 12, p: 0.5 }} variant="contained">Giao cho khách</Button></TableCell>)}

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

        </>
    );
}
