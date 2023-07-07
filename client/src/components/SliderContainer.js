import React from 'react'
import styled from 'styled-components'
import MovieSlider from './MovieSlider'

const SliderContainer = ({movies}) => {
    const getMoviesBetween = (start, end)=>{
        return movies.slice(start, end)
    }
  return (
    <SliderWrapper>
        <MovieSlider data={getMoviesBetween(0,6)} title="Top 10 Movies in Indonesia Today" />
        <MovieSlider data={getMoviesBetween(6,12)} title="Trending now" />
        <MovieSlider data={getMoviesBetween(12,17)} title="New Releases" />
        {/* <MovieSlider data={getMoviesBetween(60,70)} title="Top Picks for 2" />
        <MovieSlider data={getMoviesBetween(40,50)} title="Popular On Netflix" />
        <MovieSlider data={getMoviesBetween(50,60)} title="Top Searches" />

        <MovieSlider data={getMoviesBetween(20,30)} title="Critically Acclaimed TV Shows" />
        <MovieSlider data={getMoviesBetween(70,80)} title="Only On Netflix" />  */}
    </SliderWrapper>
  )
}

const SliderWrapper = styled.div`


`

export default SliderContainer