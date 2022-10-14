import * as React from 'react';
import {Avatar} from "@material-ui/core";
import {FC} from "react";

function stringToColor(string: string) {
    let hash = 0;
    let i

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name: string) {
    return {
        style: {
            backgroundColor: stringToColor(name),
            width: '50px',
            height: '50px'
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`.toUpperCase(),
    };
}

interface Props{
    fullName: string
}

 const BackgroundLetterAvatars: FC<Props> = ({fullName}) => {
    return (
        <Avatar {...stringAvatar(fullName)}/>
    );
}

export default BackgroundLetterAvatars
