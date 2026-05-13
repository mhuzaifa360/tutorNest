import React from 'react'
import Typography from '../common/Typography'
import Btn from '../common/Btn'
import { Link } from 'react-router'

function Hero() {
  return (
    <div className='flex justify-center items-center w-full h-screen bg-lightGreyBG'>
      <div className='flex flex-col justify-evenly items-center  w-[60%] h-[70%]'>
        <div>
        <Typography variant='h1' className='font-semibold'>Find Your Perfect Tutor, Learn at Your Pace</Typography>
        </div>
        <div>

        <Typography variant='h3'>Connect with verified expert tutors for personalized online learning. Achieve your academic goals with flexible scheduling and one-on-one support.</Typography>
        </div>
        <div className='flex w-full gap-2'>
          <Link to={"/teachers"}>
            <Btn variant='blue'>Find a Tutor</Btn>
          </Link>
          <Link to={"/login"}>
            <Btn variant='white'>Become a Tutor</Btn>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
