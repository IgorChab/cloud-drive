import React, { useState } from 'react';
import './RightSidebar.css'
import BackgroundLetterAvatars from "../Avatar/Avatar";
import { AiOutlineFileImage, AiOutlineFilePdf, AiOutlineFileUnknown, AiFillCloseCircle} from "react-icons/ai";
import { MdOutlineLogout } from 'react-icons/md'
import { File } from '../../interfaces/user.interface'
import PinnedFolder from "../PinnedFolder/PinnedFolder";
import { useDrop } from 'react-dnd'
import { useTypedSelector, useAppDispatch } from '../../hooks/redux';
import { logout, addPinnedFolder, closeAllFolders } from '../../features/user/userSlice';
import { openFolder, filterFilesByType, removeFilters } from '../../features/user/userSlice'
import AuthService from '../../app/services/authService'
import {Chip} from '@material-ui/core'

const RightSidebar = () => {

    const dispatch = useAppDispatch()

    const user = useTypedSelector(state => state.appInfo.user)
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const pinnedFolders = useTypedSelector(state => state.appInfo.pinnedFolders)

    const [{ isOver }, dropRef] = useDrop({
        accept: 'file',
        drop: (item: File) => { if (item.type === 'dir') dispatch(addPinnedFolder(item)) },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })

    const handleLogout = () => {
        dispatch(logout());
        AuthService.logout(user!._id)
    }

    const handleDoubleClick = (folder: any) => {
        if (currentFolder?._id !== folder._id) {
            dispatch(closeAllFolders())
            dispatch(openFolder(folder))
        }
    }

    const [activeCategory, setActiveCategory] = useState<'media' | 'documents' | 'others' | null>(null)

    const handleFilterFiles = (type: 'media' | 'documents' | 'others') => {
        dispatch(filterFilesByType(type))
        setActiveCategory(type)
    }

    const handleRemoveFilter = () => {
        setActiveCategory(null)
        dispatch(removeFilters())
    }

    return (
        <div className='p-[30px_15px]'>
            <div className="flex items-center justify-between font-medium text-[20px] text-black/[85] leading-7">
                <div className='flex items-center gap-3'>
                    <BackgroundLetterAvatars fullName={user!.firstName +' '+ user!.lastName} />
                    <div>
                        <p>Hi, {user?.firstName}</p>
                        <p className='font-normal text-sm text-black/[45%]'>Profile Settings</p>
                    </div>
                </div>
                <div className='flex items-center flex-col cursor-pointer' onClick={handleLogout}>
                    <MdOutlineLogout size={24} className='text-black/[45%]' />
                    <p className='font-normal text-sm text-black/[45%]'>Logout</p>
                </div>
            </div>
            <div className="flex flex-col gap-[15px] font-normal text-black/[45] text-sm mt-5">
                <div className='flex items-center justify-between'>
                    <p className="font-medium text-[#595959] py-2">Type File</p>
                    {activeCategory && 
                        <Chip
                            label='Remove filter'
                            color="secondary"
                            variant="outlined"
                            onDelete={handleRemoveFilter}
                        />
                    }
                </div>
                <div className="typeFileItem">
                    <div className='typeFileItemInner'>
                        <AiOutlineFileImage color={activeCategory === 'media'? '#1890FF' : undefined}/>
                        <p>Photo & Video</p>
                    </div>
                    <p className="seeAll" onClick={() => handleFilterFiles('media')}>See all</p>
                </div>
                <div className="typeFileItem">
                    <div className='typeFileItemInner'>
                        <AiOutlineFilePdf color={activeCategory === 'documents'? '#1890FF' : undefined}/>
                        <p>Documents</p>
                    </div>
                    <p className="seeAll" onClick={() => handleFilterFiles('documents')}>See all</p>
                </div>
                <div className="typeFileItem">
                    <div className='typeFileItemInner'>
                        <AiOutlineFileUnknown color={activeCategory === 'others'? '#1890FF' : undefined}/>
                        <p>Others</p>
                    </div>
                    <p className="seeAll" onClick={() => handleFilterFiles('others')}>See all</p>
                </div>
            </div>
            <div className="mt-[30px]">
                <p className="font-medium text-[#595959] text-sm">Pinned Folders</p>
                <div className="h-full" ref={dropRef}>
                    {pinnedFolders.map(folder => (
                        <div
                            onDoubleClick={() => handleDoubleClick(folder)}
                            className='select-none'
                            key={folder._id}
                        >
                            <PinnedFolder id={folder._id} items={folder.childs.length} name={folder.name} size={folder.size} />
                        </div>
                    ))}
                    <PinnedFolder preview={true} />
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;