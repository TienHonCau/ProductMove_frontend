import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

import axios from 'axios';

const CreateProduct = ({ open, columns, onClose, onSubmit }) => {
  const [errorLogin, setErrorlogin] = useState();
  const [logBoxstyle, setLogboxStyle] = useState();
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
      const user = {};
      user.name = values.name;
      user.username  =values.username;
      user.password = values.password;
      user.role  =values.role;
      user.address = values.address;
      user.sdt = values.sdt;
      axios.post("http://localhost:8000/factory/create", user);
      window.location.reload(); 
      onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Thêm sản phẩm mới</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <Box component="span" style={logBoxstyle} sx={{ display: { xs: 'block', sm: 'block' } }}>{errorLogin}</Box>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateProduct;