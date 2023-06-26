/* Libraries */
import React, { Fragment } from 'react';
import { Divider } from '@mui/material';

const ComponentAuthHeader = ({ headerText }: { headerText: string }) => {
    return (
        <Fragment>
            <img src='/logos/logo-color.svg' alt='logo' className='px-12 w-full h-auto object-contain'></img>
            <Divider className='my-4' />
            <span className='text-center font-bold text-xl mb-6'>{headerText}</span>
        </Fragment>
    )
}

export default ComponentAuthHeader;