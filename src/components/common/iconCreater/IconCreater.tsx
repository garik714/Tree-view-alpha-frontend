import React from 'react';
import SelectWithIcon from '../selectWithIcon/SelectWithIcon';
import FileUploader from '../fileUploader/FileUploader';
import styles from './iconCreater.module.css';

export interface IconsType {
    id: string;
    name: string;
    source: string;
}

export interface CreateIconsType {
    id?: string;
    name: string;
    source: File | string;
}

interface IconCreaterProps {
    icon: Partial<IconsType | undefined>;
    handleChangeContent: (file:  File | null | IconsType, key: string) => void;
    handleUploadIcon: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    getIcons: () => void;
    icons: IconsType[];
    validationMessage?: string;
}

function IconCreater({ icon, icons, handleUploadIcon, handleChangeContent, validationMessage, getIcons }: IconCreaterProps) {
    return (
        <div className={styles.fileIconWrapper}>
            <div className={styles.fileIconContainer}>
                <div>
                    <p>Select icon</p>
                    <SelectWithIcon
                        handleOptionClick={(file) => {handleChangeContent(file, 'icon')}}
                        selectedOption={icon}
                        options={icons}
                        getOptions={getIcons}
                    />
                </div>
                <div className={styles.ORContainer}>
                    <p>OR</p>
                </div>
                <div>
                    <p>Upload your icon</p>
                    <FileUploader
                        title={'Upload icon'}
                        handleFileChange={handleUploadIcon}
                        acceptType={"image/png, image/jpeg image/svg"}
                    />
                </div>
            </div>
            {
                validationMessage && (
                    <p className={styles.errorMessage}>
                      {validationMessage}
                    </p>
                )
            }
        </div>
    )
}

export default IconCreater;
