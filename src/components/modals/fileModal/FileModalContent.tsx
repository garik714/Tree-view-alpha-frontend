import React, { useState, ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import IconCreater from '../../common/iconCreater/IconCreater';
import FileUploader from '../../common/fileUploader/FileUploader';
import { FileModalComponentProps } from './FileModalComponent';
import { TreeViewContentTypes } from '../../treeViewMenu/TreeViewMenu';
import DeleteIcon from '../../../assets/images/icons/delete-button.svg';
import styles from './FileModalComponent.module.css';
import {isValidHttpUrl} from "../../../helpers/utils";

const FileModalContent = ({
    fileData,
    icons,
    handleChangeContent,
    handleUploadIcon,
    handleSave,
    handleClose,
    getIcons,
}: FileModalComponentProps) => {
    const [file, setFile] = useState<any>(null);
    const [fileAddedMethod, setFileAddedMethod] = useState('fileLink');
    const [fileNameValidationMessage, setFileNameValidationMessage] = useState('');
    const [contentValidationMessage, setContentValidationMessage] = useState('');
    const [iconValidationMessage, setIconValidationMessage] = useState('');

    const handleFileChange = (file: File | null) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            handleChangeContent(file, 'value');
        }

        setFile(file);
    };

    const handleChangeMethod = (evt: ChangeEvent<HTMLSelectElement>) => {
        setFileAddedMethod(evt.target.value);
        setFile(null);
        handleChangeContent(null, 'value');
    };

    const handleValidationErrors = (data: TreeViewContentTypes) => {
        if (!data.text) {
            setFileNameValidationMessage('The field is required !');

            return;
        } else {
            setFileNameValidationMessage('');
        }

        if (fileAddedMethod === 'fileLink' && !data.value) {
            setContentValidationMessage('You must add content or url for it !');

            return;
        } else if (fileAddedMethod === 'fileLink' && !isValidHttpUrl(data.value)) {
            setContentValidationMessage('Link is not correct !');

            return;
        } else if (fileAddedMethod === 'uploadFile' && !file) {
            setContentValidationMessage('You must add content or url for it !');

            return;
        } else {
            setContentValidationMessage('');
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
        const hasError = !handleValidationErrors(fileData);

        if (hasError) {
            return
        }

        handleSave();
    };

    return (
        <>
            <div className={styles.fieldsToFill}>
                <TextField
                    id="text"
                    label="File name"
                    variant="standard"
                    value={(fileData && fileData.text) ? fileData.text : ''}
                    onChange={(evt) => {handleChangeContent(evt.target.value, 'text')}}
                />
                {
                    fileNameValidationMessage && (
                        <p className={styles.errorMessage}>
                            {fileNameValidationMessage}
                        </p>
                    )
                }
            </div>
            <div className={styles.fileWrapper}>
                <div className={styles.addFileContainer}>
                    <div className={styles.selectMethodContainer}>
                        <select name="add_file" id="add_file"
                                onChange={handleChangeMethod}
                                defaultValue={'fileLink'}
                        >
                            <option value="uploadFile">Upload file</option>
                            <option value="fileLink">Add file link</option>
                        </select>
                    </div>
                    {
                        fileAddedMethod === 'uploadFile' ? (
                            <div className={styles.fileUploaderWrapper}>
                                <div className={styles.fileUploaderContainer}>
                                    <FileUploader
                                        title={'Upload file'}
                                        handleFileChange={(evt) => handleFileChange(evt.target.files ? evt.target.files[0] : null)}
                                    />
                                </div>
                                {
                                    file ? (
                                        <div className={styles.fileContainer}>
                                            <p  className={styles.fileName}>{file.name}</p>
                                            <img src={DeleteIcon}
                                                 alt={DeleteIcon}
                                                 onClick={() => handleFileChange(null)}
                                            />
                                        </div>
                                    ) : null
                                }
                            </div>
                        ) : (
                            <div className={styles.fileLinkContainer}>
                                <TextField
                                    id="text"
                                    label="File link"
                                    variant="standard"
                                    value={(fileData && fileData.value) ? fileData.value : ''}
                                    onChange={(evt) => {handleChangeContent(evt.target.value, 'value')}}
                                />
                            </div>
                        )
                    }
                </div>
                {
                    contentValidationMessage && (
                        <p className={styles.errorMessage}>
                            {contentValidationMessage}
                        </p>
                    )
                }
            </div>
            <IconCreater
                icon={fileData.icon}
                handleChangeContent={handleChangeContent}
                handleUploadIcon={handleUploadIcon}
                icons={icons}
                validationMessage={iconValidationMessage}
                getIcons={getIcons}
            />
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
        </>
    )
}

export default FileModalContent;
