import React, { useState } from 'react'
import { getInitials, getNameFromEmail } from '../AdminPage/Users/Users';
import { VscReactions } from 'react-icons/vsc'
import { CiEdit } from 'react-icons/ci'
import { BsThreeDots } from 'react-icons/bs'
import { AiOutlineDelete } from 'react-icons/ai'
import data from '@emoji-mart/data'



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
    const [editId, setEditId] = useState<string>('')
    const [moreOptions, setMoreOptions] = useState<any>({
        id:'',
        flag:false
    })
    const [commentvalue, setCommentValue] = useState<string>('')
    const handleEdit = (id: string, values: string) => {
        setEditId(id);
        setCommentValue(values);
        setMoreOptions('')
    }
    const handleCancelEdit = () => {
        setEditId('');
    }


    return (
        comments && comments.length && <>
            {
                comments.map((values: CommentsProps, index: string) => {
                    const { id, message, user, timeStamp } = values
                    return (
                        message && <div className='flex gap-4'>
                            <div  key={index} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white">
                                {getInitials(user.emailId)}
                            </div>
                            {
                                editId === id ? (
                                    <div className='border w-full border-sky-500 rounded p-2'>
                                        <div>
                                            <textarea className='w-full outline-none' value={commentvalue} onChange={(e) => setCommentValue(e.target.value)} rows={1} />
                                        </div>
                                        <div className='justify-end flex gap-4'>
                                            <button onClick={handleCancelEdit} className='bg-slate-200 text-slate-700 rounded hover:bg-slate-300 duration-300 px-3 py-1 text-sm'>Cancel</button>
                                            <button className='bg-sky-500 text-white text-sm px-3 py-1 hover:bg-sky-400 duration-300 rounded'>Update</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='border w-full flex flex-col gap-4 rounded p-2 relative'>
                                        <div className='grid grid-cols-2'>
                                            <div className='text-xs'>
                                                <span className='font-semibold'> {getNameFromEmail(user.emailId)} </span>
                                                <span>Commented : {timeStamp} </span>
                                            </div>
                                            <div className='flex items-center justify-end gap-4'>
                                                <button type='button'>
                                                    <VscReactions />
                                                </button>
                                                <button type='button' onClick={() => handleEdit(id, message)}>
                                                    <CiEdit />
                                                </button>
                                                <button type='button' onClick={()=>setMoreOptions(id)}>
                                                    <BsThreeDots />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            {message}
                                        </div>
                                        {
                                            moreOptions === id && <div className='absolute right-10 top-7 shadow-md py-2 rounded bg-white w-[20%] '>
                                                <button className='flex items-center gap-3 w-full hover:bg-slate-100 duration-200 px-4'> <AiOutlineDelete /> <span>Delete</span> </button>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                })
            }
        </>
    )
}

export default Discussion