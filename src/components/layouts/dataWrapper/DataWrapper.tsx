import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NodeModel } from '@minoru/react-dnd-treeview';
import TreeViewMenu, { TreeViewContentTypes } from '../../treeViewMenu/TreeViewMenu';
import { IconsType } from '../../common/iconCreater/IconCreater';
import { ContentApi } from '../../../api/ContentApi';
import { IconsApi } from '../../../api/IconsApi';
import styles from './dataWrapper.module.css';

export interface DataWrapperTypes {
    id: string;
    droppable: boolean;
    hasChild: boolean;
    isRoot: boolean;
    icon?: IconsType;
    iconId: string;
    parent: string;
    parentObject?: TreeViewContentTypes
    text: string;
    value: string;
}

function DataWrapper() {
    const allData: TreeViewContentTypes[] = [];
    const routeParams = useParams();

    const [rootId, setRootId] = useState<string>('');
    const [treeData, setTreeData] = useState<TreeViewContentTypes[]>([]);
    const [contentToShow, setContentToShow] = useState<string>('');
    const [iconPage, setIconPage] = useState<string>('0');
    const [iconLastPage, setIconLastPage] = useState<string>('0');
    const [allIcons, setAllIcons] = useState<IconsType[]>([]);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [showFileModal, setShowFileModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);

    useEffect(() => {
        (async () => {
            const rootId = routeParams.id ? routeParams.id : '';
            setRootId(rootId);
            await getContent(routeParams.id);
            await getUserIcons();
        })();
    }, []);

    const getContent = async (rootContentId?: string) => {
        return ContentApi.getContentByRootId(rootContentId)
        .then(res => {
            const { children } = res.data.data;
            const newTreeData = handleTreeData(children);

            setTreeData(newTreeData);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const handleTreeData = (data: TreeViewContentTypes[]) => {
        data.forEach((el: any) => {
            allData.push(el);

            if (el.hasChild ) {
                handleTreeData(el.children);
            } else {
                return
            }
        })

        return allData;
    };

    const handleDeleteContent = async (id: string) => {
        return ContentApi.deleteContent(id)
        .then(res => {
            const parent = res.data;
            const newTreeData = [...treeData];
            const foundParentIndex = newTreeData.findIndex(el => el.id === parent.id);
            const foundIndex = newTreeData.findIndex(el => el.id === id);

            if (foundParentIndex !== -1) {
                newTreeData[foundParentIndex] = parent;
            }

            if (foundIndex !== -1) {
                newTreeData.splice(foundIndex, 1);
            }

            setTreeData(newTreeData);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const createContent = async (data: DataWrapperTypes) => {
        const newData = {
            ...data,
            hasChild: false,
            isRoot: false,
        };

        newData.iconId = newData.icon ? newData.icon.id : '';
        delete newData.icon;

        return ContentApi.createContent(newData)
        .then(res => {
            const { data } = res;
            const { parentObject } = data;
            const newTreeData = [...treeData, data];

            const foundIndex = newTreeData.findIndex(el => el.id === parentObject.id);

            if (foundIndex !== -1 ) {
                newTreeData[foundIndex] = parentObject;
            }

            setTreeData(newTreeData);
            setShowFolderModal(false);
            setShowFileModal(false);
        })
        .catch(err => {
            if(err) throw err;
        });
    };

    const updateContent = async (data: TreeViewContentTypes) => {
        const newData = {...data};
        newData.iconId = newData.icon ? newData.icon.id : '';

        delete newData.icon;
        delete newData.parentObject;

        return ContentApi.updateContent(newData)
        .then(res => {
            const newTreeData = [...treeData];
            const updatedData = res.data;
            const {parentObject} = updatedData;
            const updatedDataFoundIndex = newTreeData.findIndex(el => el.id === updatedData.id);
            const foundParentIndex = newTreeData.findIndex(el => el.id === parentObject.id);

            if (updatedDataFoundIndex !== -1) {
                newTreeData[updatedDataFoundIndex] = updatedData;
            }

            if (foundParentIndex !== -1 ) {
                newTreeData[foundParentIndex] = parentObject;
            }

            setTreeData(newTreeData);
            setShowFolderModal(false);
            setShowFileModal(false);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const dragnDrop = async (data: TreeViewContentTypes) => {
        const newData = {...data};
        newData.iconId = newData.icon ? newData.icon.id : '';

        return ContentApi.dragnDrop(newData)
        .then(res => {
            const newTreeData = [...treeData];
            const obj1 = res.data[0];
            const obj2 = res.data[1];
            const obj3 = res.data[2];

            const foundIndex1 = newTreeData.findIndex(el => el.id === obj1.id);
            const foundIndex2 = newTreeData.findIndex(el => el.id === obj2.id);
            const foundIndex3 = newTreeData.findIndex(el => el.id === obj3.id);

            if (foundIndex1 !== -1) {
                newTreeData[foundIndex1] = obj1;
            }

            if (foundIndex2 !== -1) {
                newTreeData[foundIndex2] = obj2;
            }

            if (foundIndex3 !== -1) {
                newTreeData[foundIndex3] = obj3;
            }

            setTreeData(newTreeData);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const handleUploadIcon = async (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!evt.target.files) {
            return;
        }

        const file = evt.target.files[0];
        const data = {
            name: file.name,
            source: file,
        };

        return IconsApi.createIcon(data)
        .then(res => {
            const newIcon = res.data;
            const updatedIcons = [newIcon,...allIcons];
            const newSelectedData = {...selectedData};
            newSelectedData.icon = newIcon;

            setAllIcons(updatedIcons);
            setSelectedData(newSelectedData);
        })
        .catch(err => {
            if(err) throw err;
        });
    };

    const getUserIcons = async () => {
        if (iconPage !=='0' && iconLastPage === iconPage) {
            return;
        }

        return IconsApi.getIcons(`${+iconPage + 1}`)
        .then(res => {
            const {data} = res.data;
            const currentPage = res.data.meta.current_page;
            const lastPage = res.data.meta.last_page;
            const newIcons = [...allIcons, ...data];

            setAllIcons(newIcons);
            setIconPage(currentPage);
            setIconLastPage(lastPage);
        })
        .catch(err =>{
            if(err) throw err;
        });
    };

    const handleCreateRootElement = (type: string) => {
        if (type === 'file') {
            setShowFileModal(true);
            setSelectedData({
                id: '',
                parent: rootId,
                text: '',
                droppable: false,
                isRoot: false,
                hasChild: false,
                icon: null
            });
        }

        if (type === 'folder') {
            setShowFolderModal(true);
            setSelectedData({
                id: '',
                parent: rootId,
                text: '',
                droppable: true,
                isRoot: false,
                hasChild: false,
                icon: null,
            });
        }
    };

    const handleCreateElement = (node: TreeViewContentTypes, type: string) => {
        if (type === 'file') {
            setShowFileModal(true);
            setSelectedData({
                id: '',
                parent: node.id,
                text: '',
                droppable: false,
                isRoot: false,
                hasChild: false,
                icon: null,
            });
        }

        if (type === 'folder') {
            setShowFolderModal(true);
            setSelectedData({
                id: '',
                parent: node.id,
                text: '',
                droppable: true,
                isRoot: false,
                hasChild: false,
                icon: null,
            });
        }
    };

    const handleChangeContent = (value: string | File, key: string) => {
        const newData = {
            ...selectedData,
            [key]: value,
        };

        setSelectedData(newData);
    };

    const handleEditContent = (droppable: boolean) => {
        if (droppable) {
            setShowFolderModal(true);
        } else {
            setShowFileModal(true);
        }
    };

    const handleSaveContent = async () => {
        if (!selectedData.id) {
            await createContent(selectedData);
        } else {
            await updateContent(selectedData);
        }
    };

    const handleDrop = async (newTree: NodeModel<TreeViewContentTypes>[], { dropTargetId, dragSource }: any) => {
        const newDragSource = {
            ...dragSource,
            parent: dropTargetId,
            oldParent: dragSource.parent,
        };
        delete newDragSource.ref;
        await dragnDrop(newDragSource);
    };

    //TODO fixed iframe
    const showFileContent = (node: TreeViewContentTypes) => {
        console.log(node.value) // fixme m
        setContentToShow(node.value);
    };

    const handleCloseModal = (type: string) => {
        if (type === 'file') {
            setShowFileModal(false);
        }

        if (type === 'folder') {
            setShowFolderModal(false);
        }
    };

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.menuContainer}>
                <TreeViewMenu
                    rootId={rootId}
                    treeData={treeData}
                    selectedData={selectedData}
                    icons={allIcons}
                    handleFileClick={showFileContent}
                    showFileModal={showFileModal}
                    showFolderModal={showFolderModal}
                    handleDrop={handleDrop}
                    handleUploadIcon={handleUploadIcon}
                    getIcons={getUserIcons}
                    handleCreateRootElement={handleCreateRootElement}
                    handleCreateElement={handleCreateElement}
                    handleChangeContent={handleChangeContent}
                    handleEditContent={handleEditContent}
                    handleDeleteContent={handleDeleteContent}
                    handleSaveContent={handleSaveContent}
                    handleOpenContextMenu={(node) => {setSelectedData(node)}}
                    handleCloseModal={handleCloseModal}
                />
            </div>
            {
                contentToShow && (
                    <div className={styles.contentContainer}>
                        <iframe
                            className={styles.iFrameContent}
                            src={contentToShow}
                            title="Iframe Example"
                        ></iframe>
                    </div>
                )
            }

        </div>
    )
}

export default DataWrapper;
