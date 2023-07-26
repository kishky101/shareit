import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { googleLogout } from '@react-oauth/google';

import { client } from '../client';
import { userQuery, userCreatedPinsQuery, userSavedPinsQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { fetchUser } from '../utils/fetchUser';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('created');
  const [activeBtn, setActiveBtn] = useState('created');
  
  const loggedInUser = fetchUser();

  const fetchCreatedPins = () => {
    const query = userCreatedPinsQuery(userId);

    client.fetch(query)
      .then((data) => {
        setPins(data)
      })
  }

  const fetchSavedPins = () => {
    const query = userSavedPinsQuery(userId);

    client.fetch(query)
      .then((data) => {
        setPins(data)
      })
  }


  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
      .then((data) => {
        setUserProfile(data[0])
      })
  }, [userId]);

  useEffect(() => {
    if(text === 'created') {
      fetchCreatedPins();
    }else if(text === 'saved') {
      fetchSavedPins();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, userId])


  if(!userProfile) {
    return <Spinner message={'Loading profile'} />
  }

  return (
    <div className='relative min-h-full pb-2'>
      <div className='w-full'>
        <div className='h-370'>
          <img 
            className='w-full h-[100%] object-cover'
            src={randomImage}
            alt='banner-picture'
          />
        </div>
        <img 
          src={userProfile?.image}
          className='w-30 h-30 z-10 rounded-full mx-auto -mt-10'
          alt='user-profile'
        />
        <p className='bottom-0 text-center font-bold text-3xl mt-5'>{userProfile?.userName}</p>
        {userId === loggedInUser.sub && <button 
          type='button'
          className='absolute top-3 right-2 bg-white w-9 h-9 rounded-full flex justify-center items-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none cursor-pointer'
          onClick={() =>  {
            googleLogout();
            navigate('/login')
            localStorage.clear();
          }}
        >
          <AiOutlineLogout color='red' />
        </button>}
      </div>

      <div className=''>
        <div className='flex flex-wrap gap-5 justify-center mt-10'>
          <button 
            className={activeBtn === 'created' ? 'bg-red-500 text-white font-bold p-2 px-3 rounded-full outline-none' : 'font-bold bg-primary'}
            onClick={() => {
              setActiveBtn('created');
              setText('created');
            }}          
          >
            Created
          </button>
          <button 
            className={activeBtn === 'saved' ? 'bg-red-500 text-white font-bold p-2 px-3 rounded-full outline-none' : 'font-bold bg-primary'}
            onClick={() => {
              setActiveBtn('saved');
              setText('saved');
            }}
          >
            Saved
          </button>
        </div>

        <div className='mt-6'>
          {pins?.length? <MasonryLayout pins={pins} /> : <p className='font-bold text-center'>No pins Found!</p>}
        </div>
      </div>
    </div>
  )
}

export default UserProfile