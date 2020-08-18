import React from 'react'
import styled from 'styled-components'

export const GridItem = styled('div')`
  border: 1px solid green;
  @media (min-width: 768px) {
    border-radius: 8px;
  }
  @media (max-width: 767px) {
    border-radius: 0px;
    transform: translateX(-20px);
    width: calc(100% + 40px);
  }
  box-shadow: 0 10px 6px -6px rgba(7, 7, 7, 0.4);
`

export const Card = React.forwardRef(({ description, title, brands, params, t }, ref) => {
  let brandlist
  try {
    brandlist = JSON.parse(brands)
  } catch (_err) {
    brandlist = []
  }
  const paramlist = JSON.parse(params)

  return (
    <GridItem ref={ref}>
      {title}
      <hr />
      {description}
      <hr />
      <h4>{t('PARAMS_TO_SELECTION')}</h4>
      {paramlist.length > 0 && (
        <ul>
          {[...paramlist].map(({ name, sublist = [] }, i) => {
            let list
            try {
              list = [...sublist]
            } catch (_err) {
              list = []
            }
            return (
              <React.Fragment key={`item_${name}-${i}`}>
                <li>{name}</li>
                {!!sublist && (
                  <ul>
                    {list.map(({ name }) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            )
          })}
        </ul>
      )}
      <hr />
      <h4>{t('BRANDS')}</h4>
      {brandlist.length > 0 && (
        <ul>
          {[...brandlist].map(({ name, link }) => (
            <li key={name}>
              {name}
              {/* !!link && (
                <>
                  {' '}
                  <a href={link.lication} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </>
              ) */}
            </li>
          ))}
        </ul>
      )}
    </GridItem>
  )
})
