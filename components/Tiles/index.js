import React, { memo } from 'react';
import Link from 'next/link';
import { Map } from 'immutable';
// import { DesktopArrow } from './components/DesktopArrow';


const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://www.pravosleva.ru/api'; // 'http://80.87.194.181/api';

const Grid = ({
  articles,
  articlesCounter,
  currentStart,
  currentLimit = 5,
  handleStartForNextPage,
  handleStartForPrevPage,
  isLoading,
}) => (
  <div className='tiles-external-wrapper'>
    {
      articles.length > 0 && !isLoading && (currentStart ? Math.ceil((Math.ceil(articlesCounter / currentLimit) * currentStart) / articlesCounter) : 1) < Math.ceil(articlesCounter / currentLimit)
      ? (
        <div
          className='fade-in-effect tiles-external-wrapper--desktop-arrow tiles-external-wrapper--desktop-arrow--next'
          onClick={handleStartForNextPage}
        >
          <i className='fas fa-arrow-right'></i>
        </div>
      )
      : null
    }
    {
      articles.length > 0 && !isLoading && currentStart > 0
      ? (
        <div
          className='fade-in-effect tiles-external-wrapper--desktop-arrow tiles-external-wrapper--desktop-arrow--prev'
          onClick={handleStartForPrevPage}
        >
          <i className='fas fa-arrow-left'></i>
        </div>
      )
      : null
    }
    {
      articles.length > 0
      ? (
        <div className='tiles-grid-wrapper fade-in-effect'>
          {
            articles.map(({ id, briefBackground, title, brief = 'No brief' }, i) => {
              const bgSrc = briefBackground && briefBackground.url
                ?
                  dev
                  ? `http://80.87.194.181/api${briefBackground.url}`
                  // В данном случае работаю с боевой базой в dev режиме
                  : `${baseURL}${briefBackground.url}`
                : '/text-1.jpeg';

              return (
                <div
                  className='tiles-grid-item white'
                  key={id}
                  style={{
                    backgroundImage: `url(${bgSrc})`,

                    // TMP:
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <strong>{title}</strong>
                  <em style={{ textAlign: 'center' }}>{brief}</em>
                  <span style={{ textAlign: 'left' }}>
                    <Link
                      href={`/article/${id}`}
                      rel='preload'
                      importance='high'
                    ><a className='special-link inactive-witout-hover white unselectable'>READ MORE <i className='fas fa-arrow-right'></i></a></Link>
                  </span>
                </div>
              )
            })
          }
        </div>
      ) : null
    }
  </div>
);
function areEqual(prevProps, nextProps) {
  // возвращает true, если nextProps рендерит
  // тот же результат что и prevProps,
  // иначе возвращает false

  const test1 = new Map({ ...prevProps.articles, currentStart: prevProps.currentStart, isLoading: prevProps.isLoading });
  const test2 = new Map({ ...nextProps.articles, currentStart: nextProps.currentStart, isLoading: nextProps.isLoading });

  return test1.equals(test2);
}

export const Tiles = memo(Grid, areEqual);
