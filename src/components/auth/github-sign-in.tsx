'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

const GithubSignIn = () => {
  const handleGithubAuth = async () => {
    await signIn('github');
  };

  return (
    <button title="Github sign in" onClick={handleGithubAuth} className='flex items-center justify-center w-full h-14 bg-primary mt-4 p-4 gap-4 rounded-lg text-gray-100 hover:bg-primary/90 transition'>
      <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='h-8'>
        <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <title>github</title>
          <rect fill="none" height="24" width="24"></rect>
          <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"></path>{' '}
        </g>
      </svg>
      Sign up with Github
    </button>
  );
};

export default GithubSignIn;
