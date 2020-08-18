import React from 'react'
// import styled from 'styled-components'
import { Grid } from './Grid'

// export const FlexContainer = styled('div')`
//   display: flex;
//   flex-direction: column;
// `

export const EquipmentSubgroup = React.forwardRef(({ name, children }, ref) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 ref={ref}>{name}</h4>
      <Grid>{children}</Grid>
    </div>
  )
})