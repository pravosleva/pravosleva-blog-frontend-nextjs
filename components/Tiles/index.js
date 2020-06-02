import React, { memo } from 'react';
import Link from 'next/link';
import { Map } from 'immutable';
// import { DesktopArrow } from './components/DesktopArrow';
import { getFormatedDate2 } from '../../lib/timeConverter';


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
      !!articlesCounter && !isLoading && (!!currentStart ? Math.ceil((Math.ceil(articlesCounter / currentLimit) * currentStart) / articlesCounter) : 1) < Math.ceil(articlesCounter / currentLimit)
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
      !!articlesCounter && !isLoading && currentStart > 0
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
            articles.map(({ id, briefBackground, title, brief = 'No brief', createdAt }, i) => {
              const bgSrc = briefBackground && briefBackground.url
                ?
                  dev
                  ? `http://80.87.194.181/api${briefBackground.url}`
                  // В данном случае работаю с боевой базой в dev режиме
                  : `${baseURL}${briefBackground.url}`
                : '/text-1.jpeg';

              return (
                <div
                  className='tiles-grid-item tiles-grid-item-bg white'
                  key={id}
                  style={{ backgroundImage: `url(${bgSrc})` }}
                >
                  <span className='tiles-grid-item__title'>{title}</span>
                  <em className='tiles-grid-item__brief' style={{ textAlign: 'center' }}>{brief}</em>
                  <span style={{ textAlign: 'left', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      href={`/article/${id}`}
                    ><a className='special-link inactive-without-hover white unselectable'>READ MORE<i style={{ marginLeft: '10px' }} className='fas fa-arrow-right'></i></a></Link>
                    <small className='inactive'>{getFormatedDate2(new Date(createdAt))}</small>
                  </span>
                </div>
              )
            })
          }
        </div>
      ) : null
    }
    <div className='mobile-only mobile-arrows-wrapper'>
      {
        articles.length > 0 && !isLoading && currentStart > 0
        ? (
          <div
            className='fade-in-effect tiles-external-wrapper--mobile-arrow tiles-external-wrapper--mobile-arrow--prev'
            onClick={handleStartForPrevPage}
          >
            <i className='fas fa-arrow-left'></i>
          </div>
        )
        : null
      }
      {
        articles.length > 0 && !isLoading && (currentStart ? Math.ceil((Math.ceil(articlesCounter / currentLimit) * currentStart) / articlesCounter) : 1) < Math.ceil(articlesCounter / currentLimit)
        ? (
          <div
            className='fade-in-effect tiles-external-wrapper--mobile-arrow tiles-external-wrapper--mobile-arrow--next'
            onClick={handleStartForNextPage}
          >
            <i className='fas fa-arrow-right'></i>
          </div>
        )
        : null
      }
    </div>
    <style jsx>{`
      .tiles-grid-item-bg {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    `}</style>
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
