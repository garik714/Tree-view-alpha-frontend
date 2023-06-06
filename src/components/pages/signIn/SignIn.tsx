import React, { useState, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityOffTwoToneIcon from '@material-ui/icons/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import { setAuthentication, setToken } from '../../../redux/slice/authSlice';
import ErrorPopup from '../../common/popups/errorPopup/ErrorPopup';
import { AuthApi } from '../../../api/AuthApi';
import { saveToken } from '../../../helpers/auth';
import { validateEmail } from '../../../helpers/utils';
import styles from './signIn.module.css';

const theme = createTheme();
const requiredMessage = 'The field is required !';

export interface SignInDataTypes {
    username: string;
    password: string;
}

function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userCredentials, setUserCredentials] = useState<SignInDataTypes>({
        username: '',
        password: '',
    });
    const [hidePassword, setHidePassword] = useState(true);
    const [error, setError] = useState('');
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');

    const handleSubmit = (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { username, password } = userCredentials;
        const hasError = !handleValidationErrors(userCredentials);

        if (hasError) {
            return
        }

        const newUserCredentials = {
            username,
            password,
        };

        signIn(newUserCredentials);
    };

    const signIn = (data: SignInDataTypes) => {
        AuthApi.signin(data)
        .then(res => {
            const { data } = res.data;
            dispatch(setToken(JSON.stringify(data)));
            dispatch(setAuthentication());
            saveToken(data);

            navigate('/');
        })
        .catch(err => {
            const { status } = err.response.data;

            if (status === 603) {
                setUsernameValidationMessage('Invalid username or password !');
            }
        });
    };

    const handleValidationErrors = (data: SignInDataTypes) => {
        const { username, password } = data;

        if (!username.length) {
            setUsernameValidationMessage(requiredMessage);

            return
        } else {
            setUsernameValidationMessage('');
        }

        if (!validateEmail(username)) {
            setUsernameValidationMessage('Username must be an e-mail !');

            return
        } else {
            setUsernameValidationMessage('');
        }

        if (!password.length) {
            setPasswordValidationMessage(requiredMessage);

            return
        } else {
            setPasswordValidationMessage('');
        }

        return true;
    };

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const newUserCredentials = {
            ...userCredentials,
            [name]: evt.target.value,
        };
        setUserCredentials(newUserCredentials);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                      marginTop: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" mb={5}>
                       Sign in
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={userCredentials.username}
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                onChange={(evt) => handleChange(evt,"username")}
                                error={!!usernameValidationMessage}
                                helperText={usernameValidationMessage}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={userCredentials.password}
                                name="password"
                                label="Password"
                                type={hidePassword ? "password" : "input"}
                                id="password"
                                autoComplete="current-password"
                                onChange={(evt) => handleChange(evt,"password")}
                                error={!!passwordValidationMessage}
                                helperText={passwordValidationMessage}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            {
                                                hidePassword ? (
                                                    <InputAdornment position="end">
                                                        <VisibilityOffTwoToneIcon
                                                            fontSize="medium"
                                                            className={styles.passwordEye}
                                                            onClick={() => setHidePassword(!hidePassword)}
                                                        />
                                                    </InputAdornment>
                                                ) : (
                                                    <InputAdornment position="end">
                                                        <VisibilityTwoToneIcon
                                                            fontSize="medium"
                                                            className={styles.passwordEye}
                                                            onClick={() => setHidePassword(!hidePassword)}
                                                        />
                                                    </InputAdornment>
                                                )
                                            }
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary" />}*/}
                        {/*    label="Remember me"*/}
                        {/*/>*/}
                    </Grid>
                    <Button
                        disableRipple
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                    >
                      Sign In
                    </Button>
                    <Grid container>
                        {/*<Grid item xs>*/}
                        {/*  <Link href="#" variant="body2">*/}
                        {/*    Forgot password?*/}
                        {/*  </Link>*/}
                        {/*</Grid>*/}
                        <Grid item>
                            <Link to='/signup'>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
                {error && (
                    <ErrorPopup
                        errorOpen={true}
                        onClose={() => setError('')}
                        errorMessage={error}
                    />
                )}
            </Container>
        </ThemeProvider>
    );
}

export default SignIn;
