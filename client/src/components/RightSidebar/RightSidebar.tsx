import React, { useState } from 'react';
import './RightSidebar.css'
import BackgroundLetterAvatars from "../Avatar/Avatar";
import {AiOutlineFileImage, AiOutlineFilePdf, AiOutlineFileUnknown} from "react-icons/ai";
import {Grid} from "@material-ui/core";
import PinnedFolder from "../PinnedFolder/PinnedFolder";
import {useDrop} from 'react-dnd'
import { useTypedSelector } from '../../hooks/redux';

const RightSidebar = () => {

    const user = useTypedSelector(state => state.auth.user)

    const [pinnedFolders, setPinnedFolders] = useState([])

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
            <div className="flex items-center font-medium text-[20px] text-black/[85] gap-3 leading-7">
                <BackgroundLetterAvatars fullName='Igor Chabanchuk'/>
                <div>
                    <p>Hi, {user?.firstName}</p>
                    <p className='font-normal text-sm text-black/[45%]'>Profile Settings</p>
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
                        <PinnedFolder items={folder.childs.length} name={folder.name} space={folder.size}/>
                    ))}
                    <PinnedFolder preview={true}/>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;