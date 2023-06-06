import React from 'react';
import { Paper, MenuList, MenuItem, Stack } from '@mui/material';

export interface ProjectModalComponentProps {
    top?: number;
    left?: number;
    droppable: boolean;
    sequence: number;
    handleItemClick: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
    handleCreateFile?: () => void;
    handleCreateFolder?: () => void;
}

function ContextMenuComponent({
    top,
    left,
    droppable,
    sequence,
    handleItemClick,
    handleEdit,
    handleDelete,
    handleCreateFile,
    handleCreateFolder
}: ProjectModalComponentProps) {
    const onEdit = () => {
        handleEdit();
        handleItemClick();
    };

    const onDelete = () => {
        handleDelete();
        handleItemClick();
    };

    const onCreateFile = () => {
        if (handleCreateFile) {
            handleCreateFile();
        }

        handleItemClick();
    };

    const onCreateFolder = () => {
        if (handleCreateFolder) {
            handleCreateFolder();
        }

        handleItemClick();
    };

    return (
        <Stack direction="row" spacing={2} style={{position: "absolute", zIndex: '9', left, top}}>
            <Paper>
                <MenuList>
                    {
                        droppable && (
                            <div>
                                {
                                    sequence <= 8 && (
                                        <MenuItem onClick={onCreateFile}>New file</MenuItem>
                                    )
                                }
                                {
                                    sequence <= 7 && (
                                        <MenuItem onClick={onCreateFolder}>New folder</MenuItem>
                                    )
                                }
                            </div>
                        )
                    }
                    <MenuItem onClick={onEdit}>Edit</MenuItem>
                    <MenuItem onClick={onDelete}>Delete</MenuItem>
                </MenuList>
            </Paper>
        </Stack>
    );
}

export default ContextMenuComponent;


