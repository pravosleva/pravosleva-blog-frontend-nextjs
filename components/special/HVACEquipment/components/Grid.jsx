import styled from 'styled-components'

export const Grid = styled('div')`
  display: grid;
  @media (min-width: 768px) {
    column-gap: 10px;
    row-gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-auto-rows: minmax(270px, auto);
    grid-auto-flow: dense;
  }
  @media (max-width: 767px) {
    grid-gap: 10px;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(270px, auto);
  }
`