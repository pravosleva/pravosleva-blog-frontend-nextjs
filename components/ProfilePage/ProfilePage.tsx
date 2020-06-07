import React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
`

export const ProfilePage: React.FC = () => {
  return (
    <Container>
      <h2>Profile</h2>
      <p>In progress...</p>
    </Container>
  )
}
