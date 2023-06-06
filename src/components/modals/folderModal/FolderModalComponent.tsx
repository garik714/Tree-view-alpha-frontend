import React from 'react';
import { Modal, Box } from '@mui/material';
import FolderModalContent from './FolderModalContent';
import { IconsType } from '../../common/iconCreater/IconCreater';
import { TreeViewContentTypes } from '../../treeViewMenu/TreeViewMenu';
import styles from './FolderModalComponent.module.css';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 464,
    maxHeight: '50vh',
    overflowY: 'auto',
    boxShadow: 24,
    pt: 2,
    pb: 3,
    px: 3,
};

export interface FolderModalComponentProps {
    hasIcon?: boolean;
    folderData: TreeViewContentTypes;
    icons?: IconsType[];
    handleClose: () => void;
    handleSave: () => void;
    handleChangeContent: (value: string | any, key: string) => void;
    handleUploadIcon?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    getIcons?: () => void;
}

function FolderModalComponent({
    folderData,
    icons,
    handleClose,
    handleSave,
    handleChangeContent,
    handleUploadIcon,
    getIcons,
}: FolderModalComponentProps) {
    return (
        <Modal
            open={ true }
            onClose={ handleClose }
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box component="div" sx={style} className={styles.modalComponent}>
                <FolderModalContent
                    icons={icons}
                    folderData={folderData}
                    getIcons={getIcons}
                    handleClose={handleClose}
                    handleSave={handleSave}
                    handleChangeContent={handleChangeContent}
                    handleUploadIcon={handleUploadIcon}
                />
            </Box>
        </Modal>
    )
}

export default FolderModalComponent;
