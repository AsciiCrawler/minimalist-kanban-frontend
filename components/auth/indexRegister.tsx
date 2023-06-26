/* Libraries */
import React from 'react';
import { Card } from '@mui/material';

/* Components */
import ComponentRegister from './register';

export default function IndexRegister() {
    return (
        <Card className='flex flex-col px-10 py-8 w-full max-w-xl'>
            <ComponentRegister />
        </Card>
    );
}