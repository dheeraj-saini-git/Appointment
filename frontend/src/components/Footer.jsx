import React from 'react'
import { assets } from '../assets/assets'
export default function Footer(){

    return(
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'> 
            {/*left*/}
            <div>
                <img  className={'mb-5 w-40'} src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis porro fugiat quibusdam illum perspiciatis? Fugit? ipsum dolor sit amet. ipsum dolor, sit amet consectetur adipisicing elit.</p>
            </div>

            {/*center*/}
            <div>
                <p className='text-x1 font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            {/*right*/}
            <div>
                <p className='text-x1 font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-8974332022</li>
                    <li>AskQuery@gmail.com</li>
                </ul>
            </div>

        </div>
        <div>
            {/*Copyright text*/ }
            <hr />
            <p className='py-5 text-sm text-center'>
                Copyright 2025@ ApolloHospital - All Right Reserved.
            </p>
        </div>
        </div>
       
    )
}
