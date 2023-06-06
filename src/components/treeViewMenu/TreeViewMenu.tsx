import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import {
    Tree,
    getBackendOptions,
    MultiBackend,
    NodeModel,
    DropOptions,
    RenderParams
} from '@minoru/react-dnd-treeview';
import FileModalComponent from '../modals/fileModal/FileModalComponent';
import FolderModalComponent from '../modals/folderModal/FolderModalComponent';
import ContextMenuComponent from '../modals/contextMenuModal/ContextMenuComponent';
import { IconsType } from '../common/iconCreater/IconCreater';
import ArrowDown from '../../assets/images/icons/arrowDown.png';
import styles from './treeViewMenu.module.css';

interface TreeViewMenuProps {
    rootId: string,
    treeData: TreeViewContentTypes[],
    selectedData: TreeViewContentTypes,
    icons: IconsType[],
    showFileModal: boolean,
    showFolderModal: boolean,
    handleDrop: (newTree: NodeModel<TreeViewContentTypes>[], { dropTargetId, dragSource }: DropOptions<TreeViewContentTypes>) => void;
    handleCreateRootElement: (type: string) => void;
    handleUploadIcon: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateElement: (node: TreeViewContentTypes, type: string) => void;
    handleChangeContent: (value: string | File, key: string) => void;
    handleEditContent: (droppable: boolean) => void;
    handleDeleteContent: (id: string) => void;
    handleSaveContent: () => void;
    getIcons: () => void;
    handleFileClick: (node: TreeViewContentTypes) => void;
    handleOpenContextMenu: (node: TreeViewContentTypes) => void;
    handleCloseModal: (type: string) => void;
}

export interface TreeViewContentTypes {
    droppable: boolean;
    hasChild: boolean;
    isRoot: boolean;
    icon: Partial<IconsType | undefined>;
    iconId?: string;
    id: string;
    parent: string;
    parentObject?: TreeViewContentTypes
    text: string;
    value: string;
}

function TreeViewMenu({
    rootId,
    treeData,
    selectedData,
    icons,
    showFileModal,
    showFolderModal,
    handleDrop,
    handleUploadIcon,
    handleCreateRootElement,
    handleCreateElement,
    handleChangeContent,
    handleEditContent,
    handleDeleteContent,
    handleSaveContent,
    handleCloseModal,
    handleOpenContextMenu,
    handleFileClick,
    getIcons,
} : TreeViewMenuProps) {
    const menuRef = useRef() as React.RefObject<HTMLDivElement>;

    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowContextMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const onOpenContextMenu = (evt: React.MouseEvent<HTMLDivElement>, node: TreeViewContentTypes) => {
        evt.preventDefault();
        setAnchorPoint({ ...anchorPoint, y: evt.pageY });
        setShowContextMenu(true);
        handleOpenContextMenu(node);
    };

    return (
        <div className={styles.rootContainer}>
            <div className={styles.createItemContainer}>
                <div className={styles.createFileContainer}
                     onClick={() => handleCreateRootElement('file')}
                >
                    <button>+ Create file</button>
                </div>
                <div className={styles.createFolderContainer}
                     onClick={() => handleCreateRootElement('folder')}
                >
                    <button>+ Create folder</button>
                </div>
            </div>
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <Tree
                    tree={treeData}
                    rootId={rootId}
                    onDrop={handleDrop}
                    render={(node: any, { depth, isOpen, onToggle }: RenderParams) => (
                        <div style={{ marginLeft: depth * 40 }} className={styles.treeItem}>
                            {node.hasChild && (
                                <>
                                    {
                                        isOpen ? (
                                            <div className={`${styles.toggleMenuContainer} ${styles.cursorPointer}`} onClick={onToggle}>
                                                <img
                                                    className={`${styles.menuTriangle}`}
                                                    src={ArrowDown}
                                                    alt={'ArrowRight'}
                                                />
                                            </div>
                                        ) : (
                                            <div className={`${styles.toggleMenuContainer} ${styles.cursorPointer}`} onClick={onToggle}>
                                                <img
                                                    className={`${styles.menuTriangle} ${styles.rightTriangle}`}
                                                    src={ArrowDown}
                                                    alt={'ArrowDown'}
                                                    onClick={onToggle}
                                                />
                                            </div>
                                        )
                                    }
                                </>
                            )}
                            <div
                                className={styles.cursorPointer}
                                onDoubleClick={() => {
                                    if (node.droppable) {
                                        onToggle();
                                    } else {
                                        handleFileClick(node);
                                    }
                                }}
                                onClick={() => {
                                    if (!node.droppable) {
                                        handleFileClick(node);
                                    }
                                }}
                                onContextMenu={(evt) => {onOpenContextMenu(evt, node)}}>
                                <img className={styles.nodeIcon} src={node.icon?.source} alt="icon" />
                                {node.text}
                            </div>
                            {(showContextMenu && selectedData.id === node.id) && (
                                <div ref={menuRef}>
                                    <ContextMenuComponent
                                        top={30}
                                        left={anchorPoint.x + 100}
                                        droppable={node.droppable}
                                        sequence={node.sequence}
                                        handleEdit={() => handleEditContent(node.droppable)}
                                        handleDelete={() => handleDeleteContent(node.id)}
                                        handleCreateFile={() => handleCreateElement(node, 'file')}
                                        handleCreateFolder={() => handleCreateElement(node, 'folder')}
                                        handleItemClick={() => setShowContextMenu(false)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                />
            </DndProvider>
            {
                showFileModal && (
                    <div className={styles.createModalContainer}>
                        <FileModalComponent
                            fileData={selectedData}
                            handleUploadIcon={handleUploadIcon}
                            handleChangeContent={handleChangeContent}
                            handleSave={handleSaveContent}
                            handleClose={() => handleCloseModal('file')}
                            icons={icons}
                            getIcons={getIcons}
                        />
                    </div>
                )
            }
            {
                showFolderModal && (
                    <div className={styles.createModalContainer}>
                        <FolderModalComponent
                            folderData={selectedData}
                            handleUploadIcon={handleUploadIcon}
                            handleChangeContent={handleChangeContent}
                            handleSave={handleSaveContent}
                            handleClose={() => handleCloseModal('folder')}
                            icons={icons}
                            getIcons={getIcons}
                        />
                    </div>
                )
            }
        </div>
    );
}

export default TreeViewMenu;
