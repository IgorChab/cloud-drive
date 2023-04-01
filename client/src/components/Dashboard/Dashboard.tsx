import React, {FC} from 'react';
import {Grid} from "@material-ui/core";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";
import Main from "../Main/Main";

const Dashboard: FC = () => {

    return (
        <Grid container className='h-full'>
            <Grid item xs={2} className='flex justify-center h-full bg-[#F5F5F5] shadow-[inset_-1px_0_0_#F0F0F0] lg:hidden'>
                <LeftSidebar/>
            </Grid>
            <Grid item xs={12} md={7} xl={8} className='bg-white sm:bg-slate-50 w-full h-full p-8 sm:p-0 lg:p-4 flex flex-col'>
                <Main/>
            </Grid>
            <Grid item xs className='bg-white border-l border-[#F0F0F0] h-full lg:hidden'>
                <RightSidebar/>
            </Grid>
        </Grid>
    );
};


export default Dashboard;