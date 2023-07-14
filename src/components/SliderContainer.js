import React from 'react'
import styled from 'styled-components'
import MovieSlider from './MovieSlider'

const SliderContainer = ({movies}) => {
    const getMoviesBetween = (start, end)=>{
        return movies.slice(start, end)
    }
  return (
    <SliderWrapper>
        <MovieSlider data={getMoviesBetween(0,10)} title="Top 10 Movies in Indonesia Today" />
        <MovieSlider data={getMoviesBetween(10,20)} title="Trending now" />
        <MovieSlider data={getMoviesBetween(20,32)} title="New Releases" />
    </SliderWrapper>
  )
}

const SliderWrapper = styled.div`


`

export default SliderContainer