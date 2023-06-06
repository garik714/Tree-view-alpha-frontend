import React, { useState } from 'react';
import { TextField } from '@mui/material';
import IconCreater  from '../../common/iconCreater/IconCreater';
import { FolderModalComponentProps } from './FolderModalComponent';
import { TreeViewContentTypes } from '../../treeViewMenu/TreeViewMenu';
import styles from './FolderModalComponent.module.css';

const FolderModalContent = ({
    icons,
    folderData,
    handleClose,
    handleSave,
    handleChangeContent,
    handleUploadIcon,
    getIcons,
}: FolderModalComponentProps) => {
    const [folderNameValidationMessage, setFolderNameValidationMessage] = useState('');
    const [iconValidationMessage, setIconValidationMessage] = useState('');

    const handleValidationErrors = (data: TreeViewContentTypes) => {
        if (!data.text) {
            setFolderNameValidationMessage('The field is required !');

            return;
        } else {
            setFolderNameValidationMessage('');
        }

        if (!data.icon) {
            setIconValidationMessage('You must select an icon !');

            return;
        } else {
            setIconValidationMessage('');
        }

        return true;
    };

    const handleSaveChanges = () => {
        const hasError = !handleValidationErrors(folderData);

        if (hasError && handleUploadIcon) {
            return
        }

        handleSave();
    };

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modalBody}>
                <div className={styles.fieldsToFill}>
                    <TextField
                        id="text"
                        label="Folder name"
                        variant="standard"
                        value={(folderData && folderData.text) ? folderData.text : ''}
                        onChange={(evt) => {handleChangeContent(evt.target.value, 'text')}}
                    />
                    {
                        folderNameValidationMessage && (
                            <p className={styles.errorMessage}>
                                {folderNameValidationMessage}
                            </p>
                        )
                    }
                </div>
                {
                    handleUploadIcon && icons && getIcons && (
                        <IconCreater
                            icon={folderData.icon}
                            handleChangeContent={handleChangeContent}
                            handleUploadIcon={handleUploadIcon}
                            icons={icons}
                            validationMessage={iconValidationMessage}
                            getIcons={getIcons}
                        />
                    )
                }
            </div>
            <div className={styles.buttonsContent}>
                <button className={styles.closeBtn}
                        onClick={handleClose}
                >
                    Close
                </button>
                <button className={styles.saveBtn}
                        onClick={handleSaveChanges}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default FolderModalContent;
