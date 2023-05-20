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
        <div className='flex gap-3 sm:gap-2 items-center sm:justify-end sm:my-2 my-4 '>
            <div className='border sm:border-0 border-[#D9D9D9] sm:w-[200px] sm:rounded-3xl sm:bg-white w-full flex justify-between sm:justify-end'>
                <input
                    type='text'
                    placeholder='Search File or Folder'
                    className='outline-none w-full sm:text-sm p-[10px_12px] sm:px-2 sm:py-1 border-0 sm:rounded-3xl'
                    onChange={handleSearch}
                />
                <div
                    className='outline-none border-0 bg-transparent text-[#00000072] sm:p-0 sm:pr-4 p-4 text-base flex items-center'
                >
                    <AiOutlineSearch />
                </div>
            </div>
            <Button className='!p-[5px] !rounded-[50%] sm:!bg-white !min-w-[auto]' onClick={() => dispatch(switchFileContainer())}>
                {dataList
                    ? <TbGridDots color='#00000072' size={22} cursor='pointer' />
                    : <AiOutlineUnorderedList color='#00000072' size={22} cursor='pointer' />
                }
            </Button>
        </div>
    );
};

export default SearchInput;