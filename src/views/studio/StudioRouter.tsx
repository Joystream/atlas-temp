import styled from '@emotion/styled'
import React from 'react'
import { Routes } from 'react-router'

const StudioRouter = () => {
  return (
    <>
      <Container>
        <h1>Studio view here</h1>
        <Routes></Routes>
      </Container>
    </>
  )
}

export default StudioRouter

const Container = styled.div`
  --max-inner-width: calc(1440px);
  max-width: var(--max-inner-width);
  margin: 0 auto;
`
