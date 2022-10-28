import React, {FC, forwardRef} from 'react';
import {FcFolder} from "react-icons/fc";
import {formatBytes} from '../DataList/DataList'

interface Props {
    name?: string
    items?: number
    size: number
    preview?: boolean
}

const PinnedFolder: FC<Props> = ({size, items, name, preview}) => {

    return (
        <div className={`border border-[#F5F5F5] p-[12px_30px] gap-6 flex items-center cursor-pointer mt-[10px] ${preview? 'justify-center' : 'justify-between'}`}>
            {
                !preview?
                <>
                    <div className='flex gap-5'>
                        <FcFolder size={50}/>
                        <div className='flex flex-col gap-2'>
                            <p className="font-medium text-xl text-black/[85%]">{name}</p>
                            <p className="text-black/[45%] font-bold text-base">{items} Items</p>
                        </div>
                    </div>
                    <p className='text-base font-bold text-black/[25%] capitalize'>{formatBytes(size)}</p>
                </>
                : <p className='font-normal text-base text-black/[45%] p-5 m-0'>Drag and Drop Folder to pin</p>
            }
        </div>
    );
};

export default PinnedFolder;