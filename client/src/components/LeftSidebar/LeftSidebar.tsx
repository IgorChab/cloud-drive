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
import { useTypedSelector } from '../../hooks/redux';
import {useLazyDownloadFileQuery} from '../../app/services/fileService'

const LeftSidebar = () => {

    const user = useTypedSelector(state => state.appInfo.user)
    
    const availableSpace: any= useTypedSelector(state => state.appInfo.user?.availableSpace)
    const usedSpace: any = useTypedSelector(state => state.appInfo.user?.usedSpace)

    const [trigger] = useLazyDownloadFileQuery()

    return (
        <div className='w-full'>
            <p className='text-center text-[#1890FF] font-medium text-lg p-[15px_10px]'>Virtual Drive</p>
            <div>
                <div>
                    <p className='groupTitle mb-2'>Drive Storage</p>
                    <div className='groupItem active'>
                        <AiOutlineFolderOpen/>
                        <p>My Drive</p>
                    </div>
                    <div className='groupItem' onClick={() => trigger("635aacdeec02ff4723c8a066")}>
                        <AiOutlineUsergroupAdd/>
                        <p>Shared with me</p>
                    </div>
                </div>
                <div>
                    <p className='groupTitle'>Tags</p>
                    <div className='groupItem'>
                        <div className="circle bg-red-500"></div>
                        <p>Red</p>
                    </div>
                    <div className='groupItem'>
                        <div className="circle bg-yellow-300"></div>
                        <p>Yellow</p>
                    </div>
                    <div className='groupItem'>
                        <div className="circle bg-blue-400"></div>
                        <p>Blue</p>
                    </div>
                    <div className='groupItem'>
                        <div className="circle bg-green-400"></div>
                        <p>Green</p>
                    </div>
                    <div className='groupItem'>
                        <AiOutlinePlus/>
                        <p>Add more tags</p>
                    </div>
                </div>
                <div>
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
                <div className="border-t border-t-[#D9D9D9] pt-3">
                    <div className="groupTitle flex items-center gap-3 mb-2">
                        <AiOutlineCloud size={24}/>
                        <p>Storage</p>
                    </div>
                    <div className="discStorage">
                        <p className='text-black/[85] text-sm font-normal'>{(usedSpace/(1024**3)).toFixed(2)} GB of {(availableSpace/(1024**3)).toFixed(2)} GB</p>
                        <div className="bg-[#D9D9D9] rounded-[100px] w-full h-2">
                            <div className="bg-[#1890FF] rounded-[100px] w-[10%] h-2 " style={{width: `${(usedSpace*100/availableSpace).toFixed(2)}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;