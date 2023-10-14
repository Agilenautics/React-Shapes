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

const getTime = (time: string) => {
    return new Date(time).getTime()
}

const Discussion = ({ comments }: any) => {

    return (
        comments && comments.length && <div className='shadow-md p-2 my-2 bg-slate-100 rounded'>
            {
                comments.map((values: CommentsProps, index: string) => {
                    const { id, message, user, timeStamp } = values
                    return (
                        <div key={index} className='grid grid-cols-2 gap-6 m-2'>
                            <div className='flex items-center gap-3'>
                                <div className="flex h-5 w-5  items-center cursor-pointer justify-center rounded-full bg-slate-600 font-semibold text-white">
                                    {getInitials(user.emailId)}
                                </div>
                                <span> {message} </span>
                            </div>
                            <div className='text-center'>{timeStamp} </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Discussion