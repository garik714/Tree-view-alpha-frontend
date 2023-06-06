import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FolderModalComponent from '../../modals/folderModal/FolderModalComponent';
import ContextMenuComponent from '../../modals/contextMenuModal/ContextMenuComponent';
import { ContentApi } from '../../../api/ContentApi';
import { TreeViewContentTypes } from '../../treeViewMenu/TreeViewMenu';
import { IconsType } from '../../common/iconCreater/IconCreater';
import styles from './rootContent.module.css';

export interface RootContentTypes {
    droppable: boolean;
    hasChild: boolean;
    isRoot: boolean;
    icon?: IconsType;
    iconId: string;
    id: string;
    parent: string;
    parentObject?: TreeViewContentTypes;
    text: string;
    value: string;
}

function RootContent() {
    const navigate = useNavigate();
    const menuRef = useRef() as React.RefObject<HTMLDivElement>;

    const [rootContentData, setRootContentData] = useState<TreeViewContentTypes[]>([]);
    const [rootIconId, setRootIconId] = useState('');
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);

    useEffect(() => {
        (async () => {
            await getRootContent();
        })();
    }, []);

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

    const getRootContent = async () => {
        return ContentApi.getRootContent()
        .then(res => {
            const { data } = res.data;
            const rootIconId = res.data.rootIcon;
            const newRootContentData = [...data];

            setRootContentData(newRootContentData);
            setRootIconId(rootIconId);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const createContent = async (data: RootContentTypes) => {
        const newData: RootContentTypes = {
            ...data,
            hasChild: false,
            iconId: rootIconId,
        };

        delete newData.icon;

        return ContentApi.createContent(newData)
        .then(res => {
            const { data } = res;
            const newContentData = [...rootContentData, data];

            setRootContentData(newContentData);
            setShowFolderModal(false);
        })
        .catch(err => {
            if(err) throw err;
        });
    };

    const updateContent = async (data: TreeViewContentTypes) => {
        const newData = {...data};
        newData.iconId = newData.icon ? newData.icon.id : '';

        return ContentApi.updateContent(newData)
        .then(res => {
            const newContentData = [...rootContentData];
            const updatedData = res.data;
            const updatedDataFoundIndex = newContentData.findIndex(el => el.id === updatedData.id);

            if (updatedDataFoundIndex === -1) {
                return;
            }

            newContentData[updatedDataFoundIndex] = updatedData;

            setRootContentData(newContentData);
            setShowFolderModal(false);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const handleDeleteRootFolder = async () => {
        return ContentApi.deleteRootContentById(selectedData.id)
        .then(res => {
            const newTreeData = [...rootContentData];
            const foundIndex = newTreeData.findIndex(el => el.id === selectedData.id);

            if (foundIndex === -1) {
                 return;
            }

            newTreeData.splice(foundIndex, 1);
            setRootContentData(newTreeData);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const handleCreateRootFolder = () => {
        setShowFolderModal(true);
        setSelectedData({
            parent: '',
            droppable: true,
            isRoot: true,
            text: '',
        });
    };

    const handleChangeContent = (value: string, key: string) => {
        const newData = {
            ...selectedData,
            [key]: value,
        };

        setSelectedData(newData);
    };

    const handleSaveContent = async () => {
        if (!selectedData.id) {
            await createContent(selectedData);
        } else {
            await updateContent(selectedData);
        }
    };

    const handleClickRootFolder = (rootId: string) => {
        navigate(`/content/${rootId}`);
    };

    const onOpenContextMenu = (evt: React.MouseEvent<HTMLDivElement>, item: TreeViewContentTypes) => {
        evt.preventDefault();
        setAnchorPoint({ x: evt.pageX, y: evt.pageY });
        setShowContextMenu(true);
        setSelectedData(item);
    };

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.createItemContainer}>
                <div className={styles.createFolderContainer}
                     onClick={handleCreateRootFolder}
                >
                    <button>Create root folder</button>
                </div>
            </div>
            {
                rootContentData.length ? (
                    <div className={styles.contentBody}>
                        {
                            rootContentData.map((item: TreeViewContentTypes) => (
                                <div key={item.id}
                                     className={styles.rootContentItem}
                                     onClick={() => handleClickRootFolder(item.id)}
                                     onContextMenu={(evt) => {onOpenContextMenu(evt, item)}}
                                >
                                    {
                                        item.icon && (
                                            <img src={item.icon.source}
                                                 alt={'Root folder icon'}
                                            />
                                        )
                                    }
                                    <p>{item.text}</p>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
            {showContextMenu && (
                <div ref={menuRef}>
                    <ContextMenuComponent
                        top={anchorPoint.y}
                        left={anchorPoint.x}
                        droppable={false}
                        sequence={selectedData.sequence}
                        handleEdit={() => setShowFolderModal(true)}
                        handleDelete={handleDeleteRootFolder}
                        handleItemClick={() => setShowContextMenu(false)}
                    />
                </div>
            )}
            {
                showFolderModal && (
                    <div className={styles.createModalContainer}>
                        <FolderModalComponent
                            folderData={selectedData}
                            handleChangeContent={handleChangeContent}
                            handleSave={handleSaveContent}
                            handleClose={() => setShowFolderModal(false)}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default RootContent;
