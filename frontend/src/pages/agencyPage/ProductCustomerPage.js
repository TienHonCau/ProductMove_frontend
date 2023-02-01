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
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    TextField
} from '@mui/material';
import Fade from '@mui/material/Fade';
// import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import Label from '../../components/label/Label';
// sections

import { TransListHead, TransListToolbar } from '../../sections/@factory/transport';

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
    { id: 'id', label: 'Mã đơn', alignRight: true },
    { id: 'code', label: 'Mã sản phẩm', alignRight: true },
    { id: 'quantity', label: 'Số lượng', alignRight: true },
    { id: 'nameCustomer', label: 'Khách hàng', alignRight: true },
    { id: 'date', label: 'Hạn bảo hành', alignRight: true },
    { id: 'status', label: 'Trạng thái', alignRigt: false },
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

export default function ProductCustomerPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [createOpenEdit, setOpenEdit] = useState(false);

    const [createOpenEdit2, setOpenEdit2] = useState(false);

    const [BILLLIST, setBillList] = useState([]);

    const [rowData, setRowData] = useState({ idAgency: sessionStorage.getItem('id'), idDelivery: '', quantity: '', description: '', idGuarantee: '' });
    
    const [guarantee, setGuarantee] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/agency/product-customers/${sessionStorage.getItem('id')}`);
                setBillList(res.data);
            } catch (err) {
                alert(err.message);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const getGuarantee = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/guarantee`);
                setGuarantee(res.data);
            } catch (err) {
                alert(err.message);
            }
        };
        getGuarantee();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const mapColor = (status) => {
        return (status === "Đang vận chuyển") ? 'warning' : (status === "Giao hàng thành công") ? 'success' : 'default';
    }

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setOpen(null);
        setOpenEdit2(null);
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

    const handleInsurance = async () => {
        try {
            await axios.post(`http://localhost:8000/agency/order-guarantee`, rowData);
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
                <title> Customer | ProductionMove </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Sản phẩm của khách
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
                                        const { _id, code, nameCustomer, quantity, date, isExpired } = row;
                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} role="checkbox" >
                                                <TableCell padding="checkbox" />
                                                <TableCell align='left'>{_id}</TableCell>
                                                <TableCell align="left">{code}</TableCell>
                                                <TableCell align="left">{quantity}</TableCell>
                                                <TableCell align="left">{nameCustomer}</TableCell>
                                                <TableCell align="left" >{date}</TableCell>
                                                {isExpired === true &&
                                                    (<TableCell align="center"><Label>Hết hạn bảo hành</Label></TableCell>)}
                                                {isExpired === false &&
                                                    (<TableCell align="center"><Button onClick={(e) => {
                                                        setRowData(rowData => ({
                                                            ...rowData,
                                                            idDelivery: _id,
                                                        }));
                                                        setOpenEdit(true);
                                                    }} variant='outlined'>Bảo hành</Button></TableCell>)}
                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={(e) => {
                                                        setRowData(rowData => ({
                                                            ...rowData,
                                                            idDelivery: _id,
                                                            quantity: row.quantity,
                                                        }));
                                                        console.log(rowData);
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
                <MenuItem onClick={(e) => { setOpenEdit2(true) }}>
                    <Iconify icon={'bi:arrow-return-left'} sx={{ mr: 2 }} />
                    Triệu hồi
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
                            Bảo hành
                        </Typography>
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Mã đơn hàng "
                            variant="standard"
                            value={rowData.idDelivery}
                            fullWidth
                            type="text"
                            disabled

                        />
                        <FormControl required variant='standard' fullWidth sx={{ margin: '15px 0' }}>
                            <InputLabel id="demo-simple-select-label">Trung tâm bảo hành</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                onChange={(e) => {
                                    setRowData(rowData => ({
                                        ...rowData,
                                        idGuarantee: e.target.value,
                                    }))
                                }}
                                required
                            >
                                {(guarantee).map((row1) => {
                                    const { _id, name } = row1;
                                    return (
                                        <MenuItem key={_id} value={_id}>{name}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Số lượng"
                            variant="standard"
                            fullWidth
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    quantity: e.target.value,
                                }))
                            }}
                            required
                        />
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Mô tả "
                            variant="standard"
                            fullWidth
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    description: e.target.value,
                                }))
                            }}
                            required

                        />

                        <Button
                            sx={{ marginTop: '10px' }}
                            variant="contained"
                            fullWidth
                            type="submit"
                            onClick={handleInsurance}
                        >
                            Giao hàng
                        </Button>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={createOpenEdit2}
                onClose={() => {
                    setOpenEdit(false);
                    handleCloseMenu();
                }}
                closeAfterTransition
            >
                <Fade in={createOpenEdit2}>
                    <Box sx={styleModal}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Triệu hồi
                        </Typography>
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Mã đơn hàng "
                            variant="standard"
                            value={rowData.idDelivery}
                            fullWidth
                            type="text"
                            disabled

                        />
                        <FormControl required variant='standard' fullWidth sx={{ margin: '15px 0' }}>
                            <InputLabel id="demo-simple-select-label">Trung tâm bảo hành</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                onChange={(e) => {
                                    setRowData(rowData => ({
                                        ...rowData,
                                        idGuarantee: e.target.value,
                                    }))
                                }}
                                required
                            >
                                {(guarantee).map((row1) => {
                                    const { _id, name } = row1;
                                    return (
                                        <MenuItem key={_id} value={_id}>{name}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Số lượng"
                            variant="standard"
                            fullWidth
                            type="text"
                            value={rowData.quantity}
                            disabled
                        />
                        <TextField
                            sx={{ margin: '15px 0' }}
                            label="Mô tả "
                            variant="standard"
                            fullWidth
                            type="text"
                            onChange={(e) => {
                                setRowData(rowData => ({
                                    ...rowData,
                                    description: e.target.value,
                                }))
                            }}
                            

                        />

                        <Button
                            sx={{ marginTop: '10px' }}
                            variant="contained"
                            fullWidth
                            type="submit"
                            onClick={handleInsurance}
                        >
                            Gửi tới trung tâm bảo hành
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
