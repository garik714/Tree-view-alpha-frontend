import React, { ChangeEvent } from 'react';
import styles from './fileUploader.module.css';

interface FileUploaderProps {
    handleFileChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    acceptType?: string;
    title: string;
}

function FileUploader({ handleFileChange, acceptType, title }: FileUploaderProps) {
    return (
        <div className={styles.cvUploader}>
            <label className={styles.customFileUpload}>
                <input type="file"
                       onChange={handleFileChange}
                       accept={acceptType}
                />
                {title}
            </label>
        </div>
    )
}

export default FileUploader;
