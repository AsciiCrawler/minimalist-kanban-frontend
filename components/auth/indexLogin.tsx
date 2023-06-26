/* Libraries */
import React from 'react';
import { Card } from '@mui/material';

/* Components */
import ComponentLogin from './login';

export default function IndexLogin() {
    return (
        <Card className='flex flex-col mx-2 sm:px-10 px-4 py-4 w-full max-w-xl'>
            <ComponentLogin />
        </Card>
    );
}