import React, { useState } from 'react';
import './RightSidebar.css'
import BackgroundLetterAvatars from "../Avatar/Avatar";
import {AiOutlineFileImage, AiOutlineFilePdf, AiOutlineFileUnknown} from "react-icons/ai";
import {Grid} from "@material-ui/core";
import PinnedFolder from "../PinnedFolder/PinnedFolder";
import {useDrop} from 'react-dnd'

const RightSidebar = () => {

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
        <div className='rightSideContainer'>
            <div className="userInfo">
                <BackgroundLetterAvatars fullName='Igor Chabanchuk'/>
                <div>
                    <p>Hi, Igor</p>
                    <p className='settings'>Profile Settings</p>
                </div>
            </div>
            <div className="typeFile">
                <p className="rightSideGroupTitle">Type File</p>
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
            <div className="pinnedDrive">
                <p className="rightSideGroupTitle">Pinned Folder</p>
                <div className="pinnedItem" ref={dropRef}>
                    {pinnedFolders.map(folder => (
                        //@ts-ignore
                        <PinnedFolder items={folder.items} name={folder.name} space={folder.space}/>
                    ))}
                    <PinnedFolder preview={true}/>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;