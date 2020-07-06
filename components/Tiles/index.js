import React, { memo, useCallback } from 'react'
import Link from 'next/link'
import { Map } from 'immutable'
import { getFormatedDate2 } from '@/utils/timeConverter'
import { getBgSrc } from '@/utils/getApiUrl'
import ReactMarkdown from 'react-markdown' // <ReactMarkdown source={article.brief} />
// import { convertToPlainText } from '@/utils/markdown/convertToPlainText'
// import { useDeviceWidth } from '@/hooks/use-device-width'

const Grid = ({
  isFirstRender,
  articles,
  articlesCounter,
  currentStart,
  currentLimit = 5,
  handleStartForNextPage,
  handleStartForPrevPage,
  isLoading,
}) => {
  // const { width: deviceWidth } = useDeviceWidth()
  const renderArticles = useCallback(
    (articles) => {
      return articles.map(({ id, briefBackground, title, brief = 'No brief', createdAt, slug }, _i) => {
        const bgSrc = getBgSrc(briefBackground?.url, true)

        return (
          <div
            className="tiles-grid-item tiles-grid-item-bg white"
            key={id}
            style={{
              // backgroundImage: `linear-gradient(#FFF, transparent, #FFF), url(${bgSrc})`,
              // backgroundImage: `radial-gradient(ellipse closest-side, rgba(15, 14, 22, 0.5), #100e17), url(${bgSrc})`,
              backgroundImage: `url(${bgSrc})`,
            }}
          >
            <span className="tiles-grid-item__title">
              <ReactMarkdown source={title} />
            </span>
            <div className="tiles-grid-item__brief" style={{ textAlign: 'center' }}>
              <ReactMarkdown source={brief} />
            </div>
            <span
              style={{
                textAlign: 'left',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Link href="/article/[slug]" as={`/article/${slug}`}>
                <a className="special-link inactive-without-hover white unselectable">
                  READ MORE<i style={{ marginLeft: '10px' }} className="fas fa-arrow-right"></i>
                </a>
              </Link>
              <small className="inactive">{getFormatedDate2(new Date(createdAt))}</small>
            </span>
          </div>
        )
      })
    },
    [] // deviceWidth
  )

  return (
    <>
      <div className="tiles-external-wrapper">
        {!!articlesCounter &&
        !isLoading &&
        (!!currentStart ? Math.ceil((Math.ceil(articlesCounter / currentLimit) * currentStart) / articlesCounter) : 1) <
          Math.ceil(articlesCounter / currentLimit) ? (
          <div
            className="fade-in-effect tiles-external-wrapper--desktop-arrow tiles-external-wrapper--desktop-arrow--next"
            onClick={handleStartForNextPage}
          >
            <i className="fas fa-arrow-right"></i>
          </div>
        ) : null}
        {!!articlesCounter && !isLoading && currentStart > 0 ? (
          <div
            className="fade-in-effect tiles-external-wrapper--desktop-arrow tiles-external-wrapper--desktop-arrow--prev"
            onClick={handleStartForPrevPage}
          >
            <i className="fas fa-arrow-left"></i>
          </div>
        ) : null}
        {articles.length > 0 ? (
          <div className={`tiles-grid-wrapper${!isFirstRender ? ' fade-in-effect' : ''}`}>
            {renderArticles(articles)}
          </div>
        ) : null}
        <div className="mobile-only mobile-arrows-wrapper">
          {articles.length > 0 && !isLoading && currentStart > 0 ? (
            <div
              className="fade-in-effect tiles-external-wrapper--mobile-arrow tiles-external-wrapper--mobile-arrow--prev"
              onClick={handleStartForPrevPage}
            >
              <i className="fas fa-arrow-left"></i>
            </div>
          ) : null}
          {articles.length > 0 &&
          !isLoading &&
          (currentStart ? Math.ceil((Math.ceil(articlesCounter / currentLimit) * currentStart) / articlesCounter) : 1) <
            Math.ceil(articlesCounter / currentLimit) ? (
            <div
              className="fade-in-effect tiles-external-wrapper--mobile-arrow tiles-external-wrapper--mobile-arrow--next"
              onClick={handleStartForNextPage}
            >
              <i className="fas fa-arrow-right"></i>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
function areEqual(prevProps, nextProps) {
  const test1 = new Map({
    articles: prevProps.articles,
    currentStart: prevProps.currentStart,
    isLoading: prevProps.isLoading,
    isFirstRender: prevProps.isFirstRender,
  })
  const test2 = new Map({
    articles: nextProps.articles,
    currentStart: nextProps.currentStart,
    isLoading: nextProps.isLoading,
    isFirstRender: nextProps.isFirstRender,
  })

  return test1.equals(test2) || prevProps.isFirstRender === nextProps.isFirstRender
}

export const Tiles = memo(Grid, areEqual)
