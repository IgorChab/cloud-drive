import React, {FC} from 'react';
import {Grid} from "@material-ui/core";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";
import Main from "../Main/Main";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Dashboard: FC = () => {

    return (
        <Grid container className='h-full'>
            <Grid item xs={2} className='flex justify-center h-full bg-[#F5F5F5] shadow-[inset_-1px_0_0_#F0F0F0]'>
                <LeftSidebar/>
            </Grid>
            <DndProvider backend={HTML5Backend}>
                <Grid item xs={7} className='bg-white h-full p-8 flex flex-col'>
                    <Main/>
                </Grid>
                <Grid item xs className='bg-white border-l border-[#F0F0F0]'>
                    <RightSidebar/>
                </Grid>
            </DndProvider>
        </Grid>
    );
};


export default Dashboard;