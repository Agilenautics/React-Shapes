import React, { useEffect, useState } from 'react';
import Signout from '../Authentication/Signout/Signout';


const TopBar: React.FC = () => {
    return <div style={{
        backgroundColor: '#fff',
        borderBottom: '2px solid #000',
        width: '100vw',
        height: 75,
        padding: '0px 35px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }}>
        <Signout />
    </div>
}

export default TopBar;