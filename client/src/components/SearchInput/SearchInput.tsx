import { Button } from '@material-ui/core';
import React from 'react';
import {AiOutlineSearch, AiOutlineFilter, AiOutlineUnorderedList} from "react-icons/ai";
import {TbGridDots} from 'react-icons/tb'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import {switchFileContainer} from '../../features/events/eventSlice'
import './SearchInput.css'

const SearchInput = () => {

    const dispatch = useAppDispatch()

    const dataGrid = useTypedSelector(state => state.event.dataGrid)

    return (
        <div className={'searchContainer'}>
            <form className={'searchBox'}>
                <input type={"text"} placeholder={'Search File, Folder, Drive name'} className={'searchInput'}/>
                <button type={"submit"} className={'searchBtn'}>
                    <AiOutlineSearch/>
                </button>
            </form>
            <Button className='buttonBase'>
                <AiOutlineFilter color={'#00000072'} size={16} cursor={'pointer'}/>
            </Button>
            <Button className='buttonBase' onClick={() => dispatch(switchFileContainer())}>
                {dataGrid
                    ? <TbGridDots color={'#00000072'} size={16} cursor={'pointer'}/>
                    : <AiOutlineUnorderedList color={'#00000072'} size={16} cursor={'pointer'}/>
                }
            </Button>
        </div>
    );
};

export default SearchInput;