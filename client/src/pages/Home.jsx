import React from 'react'
import HeroSection from '../components/HeroSection'
import FeatureSection from '../components/FeatureSection'
import TrailerSection from '../components/TrailerSection'
import CustomTrailerPlayer from '../components/CustomTrailerPlayer'

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      {/* <CustomTrailerPlayer /> */}
      <TrailerSection />
    </>
  )
}

export default Home