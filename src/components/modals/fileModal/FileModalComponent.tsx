import React from 'react';
import { Modal, Box } from '@mui/material';
import FileModalContent from './FileModalContent';
import { IconsType } from '../../common/iconCreater/IconCreater';
import { TreeViewContentTypes } from '../../treeViewMenu/TreeViewMenu';
import styles from './FileModalComponent.module.css';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 464,
    maxHeight: '50vh',
    minHeight: 350,
    overflowY: 'auto',
    boxShadow: 24,
    pt: 2,
    pb: 3,
    px: 3,
};

export interface FileModalComponentProps {
    icons: IconsType[],
    fileData: TreeViewContentTypes;
    handleChangeContent: (value: string | any, key: string) => void;
    handleUploadIcon: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    getIcons: () => void;
    handleSave: () => void;
    handleClose: () => void;
}

function FileModalComponent({
    fileData,
    icons,
    handleUploadIcon,
    getIcons,
    handleChangeContent,
    handleSave,
    handleClose,
}: FileModalComponentProps) {
    return (
        <Modal
            open={ true }
            onClose={ handleClose }
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box component="div" sx={style} className={styles.modalComponent}>
                <FileModalContent
                    fileData={fileData}
                    icons={icons}
                    getIcons={getIcons}
                    handleUploadIcon={handleUploadIcon}
                    handleChangeContent={handleChangeContent}
                    handleSave={handleSave}
                    handleClose={handleClose}
                />
            </Box>
        </Modal>
    )
}

export default FileModalComponent;
