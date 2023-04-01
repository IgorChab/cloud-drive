import React, {FC, forwardRef} from 'react';
import {FcFolder} from "react-icons/fc";
import {formatBytes} from '../DataList/DataList'
import {useDrag} from 'react-dnd'

interface Props {
    id?: string
    name?: string
    items?: number
    size?: number
    preview?: boolean
}

const PinnedFolder: FC<Props> = ({id, size, items, name, preview}) => {

    const [collected, drag, dragPreview] = useDrag({
        type: 'pinnedFolder',
        item: {id},
        collect: (monitor) => {
            dragPreview: monitor.isDragging()
        },
    })

    return (
        <div 
            className={`border border-[#F5F5F5] p-[12px_30px] gap-6 flex items-center mb-[10px] cursor-pointer ${preview? 'justify-center cursor-default' : 'justify-between'}`}
            title={name}
        >
            {
                !preview?
                <div ref={drag} className='flex items-center'>
                    <div className='flex gap-5'>
                        <FcFolder size={50}/>
                        <div className='flex flex-col gap-2'>
                            <p className="font-medium text-xl text-black/[85%] whitespace-nowrap text-ellipsis overflow-hidden w-[130px]">{name}</p>
                            <p className="text-black/[45%] font-bold text-base">{items} Items</p>
                        </div>
                    </div>
                    <p className='text-base font-bold text-black/[25%] capitalize'>{formatBytes(size || 0)}</p>
                </div>
                : <p className='font-normal text-base text-black/[45%] p-5 m-0'>Drag and Drop Folder to pin</p>
            }
        </div>
    );
};

export default PinnedFolder;