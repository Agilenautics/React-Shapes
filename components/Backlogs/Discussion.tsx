import React from 'react'
import { getInitials } from '../AdminPage/Users/Users';

interface User {
    emailId: string;
}

interface CommentsProps {
    id: string;
    message: string;
    timeStamp: string
    user: User
}

const Discussion = ({ comments }: any) => {

    return (
        <>
            {
                comments && comments.length &&
                comments.map((values: CommentsProps, index: string) => {
                    const { id, message, user, timeStamp } = values
                    console.log(timeStamp)
                    return (
                        <div key={index} className='grid grid-cols-2 gap-6'>
                            <div>
                                <span className='text-white bg-slate-500 text-center rounded-full'> {getInitials(user.emailId)} </span>
                                <span> {message} </span>
                            </div>
                            <div className='border'>{timeStamp} </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Discussion