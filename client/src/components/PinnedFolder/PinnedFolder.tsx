import React, {FC, forwardRef} from 'react';
import {FcFolder} from "react-icons/fc";
import './PinnedFolder.css'

interface Props {
    name?: string
    items?: number
    space?: string
    preview?: boolean
}

const PinnedFolder: FC<Props> = ({space, items, name, preview}) => {

    return (
        <div className='pinnedFolderContainer'>
            {
                !preview?
                <>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <FcFolder size={50}/>
                        <div className='statConn'>
                            <p className="folderName">{name}</p>
                            <p className="folderItems">{items} Items</p>
                        </div>
                    </div>
                    <p className='folderSpace'>{space}</p>
                </>
                : <p className='preview'>Drag and Drop Folder to pin</p>
            }
        </div>
    );
};

export default PinnedFolder;