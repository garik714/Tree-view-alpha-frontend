import React, { useState, MouseEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import ErrorPopup from '../../common/popups/errorPopup/ErrorPopup';
import { validateEmail } from '../../../helpers/utils';
import { AuthApi } from '../../../api/AuthApi';
import styles from './signUp.module.css';

const theme = createTheme();
const requiredMessage = 'The field is required !';

export interface SignUpDataTypes {
    name: string;
    surname: string;
    username: string;
    password: string;
    password_confirmation: string;
}

function SignUp() {
    const navigate = useNavigate();

    const [userCredentials, setUserCredentials] = useState<SignUpDataTypes>({
        name: '',
        surname: '',
        username: '',
        password: '',
        password_confirmation: '',
    });
    const [hidePassword, setHidePassword] = useState(true);
    const [error, setError] = useState('');
    const [nameValidationMessage, setNameValidationMessage] = useState('');
    const [surnameValidationMessage, setSurnameValidationMessage] = useState('');
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
    const [confirmePasswordValidationMessage, setConfirmPasswordValidationMessage] = useState('');

    const handleSubmit = (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { name, surname, username, password, password_confirmation } = userCredentials;
        const hasError = !handleValidationErrors(userCredentials);

        if (hasError) {
            return
        }

        const newUserCredentials = {
            name,
            surname,
            username,
            password,
            password_confirmation,
        };

        AuthApi.register(newUserCredentials)
        .then(res => {
            navigate('/signin');
        })
        .catch(err => {
            const { message } = err.response.data.errors;
            const { status } = err.response.data;

            if (message === 'validation.unique' || status === 422) {
                setUsernameValidationMessage('This user name is already taken');
            }
        });
    };

    const handleValidationErrors = (data: SignUpDataTypes) => {
        const { name, surname, username, password, password_confirmation } = data;

        if (!name.length) {
            setNameValidationMessage(requiredMessage);

            return
        } else {
            setNameValidationMessage('');
        }

        if (!surname.length) {
            setSurnameValidationMessage(requiredMessage);

            return
        } else {
            setSurnameValidationMessage('');
        }

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

        if (!password_confirmation.length) {
            setConfirmPasswordValidationMessage(requiredMessage);

            return
        } else {
            setConfirmPasswordValidationMessage('');
        }

        if (password_confirmation !== password) {
            setConfirmPasswordValidationMessage(`Passwords didn't match !`);

            return
        } else {
            setConfirmPasswordValidationMessage('');
        }

        return true;
    };

    const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
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
                    <Typography component="h1" variant="h5" mb={10}>
                        Sign up
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="given-name"
                                value={userCredentials.name}
                                name="name"
                                id="name"
                                label="Name"
                                autoFocus
                                onChange={(evt) => handleChange(evt,"name")}
                                error={!!nameValidationMessage}
                                helperText={nameValidationMessage}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                value={userCredentials.surname}
                                id="surname"
                                label="Surname"
                                name="surname"
                                autoComplete="surname"
                                onChange={(evt) => handleChange(evt,"surname")}
                                error={!!surnameValidationMessage}
                                helperText={surnameValidationMessage}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                value={userCredentials.username}
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                onChange={(evt) => handleChange(evt,"username")}
                                error={!!usernameValidationMessage}
                                helperText={usernameValidationMessage}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                value={userCredentials.password}
                                name="password"
                                label="Password"
                                type={hidePassword ? "password" : "input"}
                                id="password"
                                autoComplete="new-password"
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
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                value={userCredentials.password_confirmation}
                                name="confirmPassword"
                                label="Confirm Password"
                                type={hidePassword ? "password" : "input"}
                                id="confirmPassword"
                                autoComplete="new-confirmPassword"
                                onChange={(evt) => handleChange(evt,"password_confirmation")}
                                error={!!confirmePasswordValidationMessage}
                                helperText={confirmePasswordValidationMessage}
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
                    </Grid>
                    <Button
                        disableRipple
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/signin" >
                                Already have an account? Sign in
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

export default SignUp;
