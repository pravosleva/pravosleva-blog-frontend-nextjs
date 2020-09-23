import React from 'react'
import styled from 'styled-components'
import { PhotosBtnWrapper } from './PhotosBtnWrapper'

export const GridItem = styled('div')`
  transition: 0.5s;
  @media (min-width: 768px) {
    padding: 10px;
    border-radius: 8px;
  }
  @media (max-width: 767px) {
    padding: 10px;

    border-radius: 8px;
    /* transform: translateX(-20px); */
    /* width: calc(100% + 40px); */
  }
  box-shadow: 0 5px 10px 0px rgba(7, 7, 7, 0.2);
  & > .card-description blockquote {
    margin-left: 0;
    padding-left: 1.5em;
    opacity: 0.5;
    border-left: 2px solid gray;
  }

  display: flex;
  flex-direction: column;
`

export const Card = React.forwardRef(({ description, title, brands, params, t, data }, ref) => {
  let brandlist
  try {
    brandlist = JSON.parse(brands)
  } catch (_err) {
    brandlist = []
  }
  const paramlist = JSON.parse(params)

  return (
    <GridItem className="card" ref={ref}>
      <div className="card-title">
        <h4>{title}</h4>
      </div>
      <div className="card-description">
        <blockquote>{description}</blockquote>
      </div>
      <div className="card-params">
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
      </div>
      <hr />
      <div className="card-brands">
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
      </div>
      {data?.photos && <PhotosBtnWrapper description={description} title={title} photos={data?.photos} />}
    </GridItem>
  )
})
