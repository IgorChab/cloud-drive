import React from 'react';
import './LeftSidebar.css'
import {
    AiOutlineFolderOpen,
    AiOutlineUsergroupAdd,
    AiOutlinePlus,
    AiOutlineClockCircle,
    AiOutlineDelete,
    AiOutlineCloud
} from "react-icons/ai";
import { Button } from '@material-ui/core';

const LeftSidebar = () => {
    return (
        <div className='container'>
            <p className='logo'>Virtual Drive</p>
            <div className='menu'>
                <div className="group">
                    <p className='groupTitle'>Drive Storage</p>
                    <div className='groupItem active'>
                        <AiOutlineFolderOpen/>
                        <p>My Drive</p>
                    </div>
                    <div className='groupItem'>
                        <AiOutlineUsergroupAdd/>
                        <p>Shared with me</p>
                    </div>
                </div>
                <div className="group">
                    <p className='groupTitle'>Tags</p>
                    <div className='groupItem'>
                        <div className="circle red"></div>
                        <p>Red</p>
                    </div>
                    <div className='groupItem'>
                        <div className="circle yellow"></div>
                        <p>Yellow</p>
                    </div>
                    <div className='groupItem'>
                        <div className="circle blue"></div>
                        <p>Blue</p>
                    </div>
                    <div className='groupItem'>
                        <div className="circle green"></div>
                        <p>Green</p>
                    </div>
                    <div className='groupItem'>
                        <AiOutlinePlus/>
                        <p>Add more tags</p>
                    </div>
                </div>
                <div className="group">
                    <p className='groupTitle'>More</p>
                    <div className='groupItem'>
                        <AiOutlineClockCircle/>
                        <p>Recents</p>
                    </div>
                    <div className='groupItem'>
                        <AiOutlineDelete/>
                        <p>Trash</p>
                    </div>
                </div>
                <div className="group devider">
                    <div className="groupTitle groupTitle_flex">
                        <AiOutlineCloud size={24}/>
                        <p>Storage</p>
                    </div>
                    <div className="discStorage">
                        <p className='usedSpace'>1.18 GB of 50 GB</p>
                        <div className="progressBar">
                            <div className="progressInner"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;