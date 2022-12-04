import { Button } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineUnorderedList } from "react-icons/ai";
import { TbGridDots } from 'react-icons/tb'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { switchFileContainer } from '../../features/events/eventSlice'
import { filterFilesByName } from '../../features/user/userSlice';
const SearchInput = () => {

    const dispatch = useAppDispatch()

    const dataList = useTypedSelector(state => state.event.dataList)

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        let searchString = e.target.value.toLowerCase()
        dispatch(filterFilesByName(searchString))
    }

    return (
        <div className='flex gap-3 items-center w-full my-4'>
            <div className='border border-[#D9D9D9] w-full flex justify-between'>
                <input
                    type='text'
                    placeholder='Search File or Folder'
                    className='outline-none w-full p-[10px_12px] border-0'
                    onChange={handleSearch}
                />
                <div
                    className='outline-none border-0 bg-transparent text-[#00000072] p-3 text-base flex items-center'
                >
                    <AiOutlineSearch />
                </div>
            </div>
            <Button className='!p-[5px] !rounded-[50%] !min-w-[auto]'>
                <AiOutlineFilter color={'#00000072'} size={16} cursor={'pointer'} />
            </Button>
            <Button className='!p-[5px] !rounded-[50%] !min-w-[auto]' onClick={() => dispatch(switchFileContainer())}>
                {dataList
                    ? <TbGridDots color='#00000072' size={16} cursor='pointer' />
                    : <AiOutlineUnorderedList color='#00000072' size={16} cursor='pointer' />
                }
            </Button>
        </div>
    );
};

export default SearchInput;