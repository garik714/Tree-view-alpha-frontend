import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styles from './errorPopup.module.css';

interface ErrorPopupProps {
    errorOpen: boolean;
    onClose: () => void;
    errorMessage: string;
}

function ErrorPopup({ errorOpen, onClose, errorMessage }: ErrorPopupProps) {
    return (
        <Snackbar
            key={errorMessage}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            open={errorOpen}
            onClose={onClose}
            autoHideDuration={3000}
        >
            <SnackbarContent
                className={styles.error}
                message={
                    <div>
                        <span style={{ marginRight: "8px" }}>
                           <ErrorIcon fontSize="large" color="error" />
                        </span>
                       <span> {errorMessage} </span>
                    </div>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        onClick={onClose}
                    >
                        <CloseIcon color="error" />
                    </IconButton>
                ]}
            />
        </Snackbar>
    )
}

export default ErrorPopup;
