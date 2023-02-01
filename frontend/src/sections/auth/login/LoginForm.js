import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    try {
      const res = await axios.post('http://localhost:8000/user/login', { username, password });
      if (res.data.login) {
        setUsername('');
        setPassword('');
        console.log(res.data);
        
        sessionStorage.setItem('role', res.data.role);
        sessionStorage.setItem('login', true);
        sessionStorage.setItem('username', res.data.username);
        sessionStorage.setItem('id', res.data.id);
        sessionStorage.setItem('accessToken', res.data.accessToken);
        //  
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate(`/${res.data.role}`);
        }

        window.location.reload();
      } else {
         alert(res.data.msg);
        setPassword('');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
        <Stack spacing={3}>
          <TextField
            name="email"
            autoComplete='true'
            label="Email address"
            onChange={e => setUsername(e.target.value)}
          />

          <TextField
            name="password"
            label="Password"
            onChange={e => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Checkbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Login
        </LoadingButton>
      
    </>
  );
}
