import React, {DragEvent, FC} from 'react';
import {Grid} from "@material-ui/core";
import './Dashboard.css';
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";
import Main from "../Main/Main";
import { useTypedSelector } from '../../hooks/redux';
import { useGetUsersQuery } from '../../app/services/auth';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'


const Dashboard: FC = () => {

    const userData = useTypedSelector((state) => state.auth)
    console.log(userData)

    // const {data} = useGetUsersQuery('')

    // console.log(data)

    const dragEnd = (e: DragEvent) => {
        console.log(e)
    }

    return (
        <Grid container className='container'>
            <Grid item xs={2} className='flex leftSide'>
                <LeftSidebar/>
            </Grid>
            <DndProvider backend={HTML5Backend}>
                <Grid item xs={7} className='main'>
                    <Main/>
                </Grid>
                <Grid item xs className='rightSide'>
                    <RightSidebar/>
                </Grid>
            </DndProvider>
        </Grid>
    );
};

export default Dashboard;