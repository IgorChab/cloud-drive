import React, { useState } from 'react';
import './RightSidebar.css'
import BackgroundLetterAvatars from "../Avatar/Avatar";
import {AiOutlineFileImage, AiOutlineFilePdf, AiOutlineFileUnknown} from "react-icons/ai";
import {MdOutlineLogout} from 'react-icons/md'
import {File} from '../../interfaces/user.interface'
import PinnedFolder from "../PinnedFolder/PinnedFolder";
import {useDrop} from 'react-dnd'
import { useTypedSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../features/user/userSlice';

const RightSidebar = () => {

    const dispatch = useAppDispatch()

    const user = useTypedSelector(state => state.appInfo.user)

    const [pinnedFolders, setPinnedFolders] = useState<File[]>([])

    const [{ isOver }, dropRef] = useDrop({
        accept: 'folder',
        //@ts-ignore
        drop: (item) => setPinnedFolders((pinnedFolders) => !pinnedFolders.includes(item) ? [...pinnedFolders, item] : pinnedFolders),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })
 

    return (
        <div className='p-[30px_15px]'>
            <div className="flex items-center justify-between font-medium text-[20px] text-black/[85] leading-7">
                <div className='flex items-center gap-3'>
                    <BackgroundLetterAvatars fullName='Igor Chabanchuk'/>
                    <div>
                        <p>Hi, {user?.firstName}</p>
                        <p className='font-normal text-sm text-black/[45%]'>Profile Settings</p>
                    </div>
                </div>
                <div className='flex items-center flex-col cursor-pointer' onClick={() => dispatch(logout())}>
                    <MdOutlineLogout size={24} className='text-black/[45%]'/>
                    <p className='font-normal text-sm text-black/[45%]'>Logout</p>
                </div>
            </div>
            <div className="flex flex-col gap-[15px] font-normal text-black/[45] text-sm mt-5">
                <p className="font-medium text-[#595959] ">Type File</p>
                <div className="typeFileItem">
                    <div className='typeFileItemInner'>
                        <AiOutlineFileImage/>
                        <p>Photo & Video</p>
                    </div>
                    <p className="seeAll">See all</p>
                </div>
                <div className="typeFileItem">
                    <div className='typeFileItemInner'>
                        <AiOutlineFilePdf/>
                        <p>Documents</p>
                    </div>
                    <p className="seeAll">See all</p>
                </div>
                <div className="typeFileItem">
                    <div className='typeFileItemInner'>
                        <AiOutlineFileUnknown/>
                        <p>Others</p>
                    </div>
                    <p className="seeAll">See all</p>
                </div>
            </div>
            <div className="mt-[30px]">
                <p className="font-medium text-[#595959] text-sm">Pinned Folder</p>
                <div className="h-full" ref={dropRef}>
                    {pinnedFolders.map(folder => (
                        //@ts-ignore
                        <PinnedFolder items={folder.childs.length} name={folder.name} size={folder.size}/>
                    ))}
                    <PinnedFolder preview={true} size={0}/>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;