import React from 'react'
import { Grid } from './Grid'

export const EquipmentGroup = React.forwardRef(({ name, children, deep }, ref) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 ref={ref}>{name}</h3>
      {deep === 1 && <Grid>{children}</Grid>}
      {deep === 2 && children}
    </div>
  )
})