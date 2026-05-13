import React from 'react'
import Hero from '../components/home/Hero'
import WhyChoose from '../components/home/WhyChoose'
import FeaturedTutors from '../components/home/FeatureTutors'
import StudentReviews from "../components/home/StudentReviews"

function Home() {
  return (
    <div>
      <Hero />
      <WhyChoose />
      <FeaturedTutors />
      <StudentReviews />
    </div>
  )
}

export default Home
