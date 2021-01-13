import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import loadable from '@loadable/component'
import Head from 'next/head'
import { Layout } from '@/components/layout'
import { getFormatedDate2 } from '@/utils/timeConverter'
import Prism from 'prismjs'
import { getImageUrl, getBgSrc, getApiUrl, isProd } from '@/utils/getApiUrl'
import { useUnscrolledBody } from '@/hooks/use-unscrolled-body'
import { convertToPlainText } from '@/utils/markdown/convertToPlainText'
import { withTranslator } from '@/hocs/with-translator'
import Img from '@lxsmnsyc/react-image'
import { Loader } from '@/components/Loader'
import { HVACEquipment } from '@/components/special/HVACEquipment/index'
import { AnimatePresence, motion } from 'framer-motion'
import NextNProgress from 'nextjs-progressbar'
// <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
import { baseRenderers } from '@/react-markdown-renderers'
import { ShareSection } from '@/components/ShareSection'

// animate: defines animation
// initial: defines initial state of animation or starting point
// exit: defines animation when component exits

const Lightbox = loadable(() => import(/* webpackChunkName: "react-image-lightbox" */ 'react-image-lightbox'))
// const Gallery = loadable(() => import(/* webpackChunkName: "react-photo-gallery" */ 'react-photo-gallery'), {
//   ssr: false,
// })

const api = axios.create({ baseURL: getApiUrl() })

// function columns(containerWidth) {
//   let columns = 1
//   if (containerWidth >= 500) columns = 2
//   if (containerWidth >= 900) columns = 3
//   if (containerWidth >= 1500) columns = 4
//   return columns
// }

const ImageContainer = ({ src, onItemClick }) => {
  const containerRef = useRef({})

  return (
    <div ref={containerRef} className="custom-gallery-wrapper_item">
      <Img
        onClick={onItemClick}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        src={src}
        fallback={<Loader isForImage />}
        containerRef={containerRef}
        alt="img"
        sources={[
          {
            source: src,
            media: '(orientation: portrait)',
          },
          {
            source: src,
            media: '(orientation: landscape)',
          },
        ]}
      />
    </div>
  )
}
const Gallery = ({ images, onItemClick }, i) => {
  return (
    <div key={i} className="custom-gallery-wrapper">
      {images.map(({ src }, j) => (
        <ImageContainer key={src} src={src} onItemClick={() => onItemClick(j)} />
      ))}
    </div>
  )
}

const Article = withTranslator(({ t, initArticleData: article }) => {
  // const router = useRouter()
  // const { id } = router.query
  // GALLERY:
  const [currentPackIndex, setCurrentPackIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewerIsOpen, setViewerIsOpen] = useState(false)
  const { onBlockScrollBody } = useUnscrolledBody(false)
  // WAY 1: react-photo-gallery
  // const openLightbox = useCallback((_, { index }) => {
  //   setCurrentImageIndex(index)
  //   setViewerIsOpen(true)
  //   onBlockScrollBody(true)
  // }, [])
  // WAY 2: Custom gallery
  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index)
    setViewerIsOpen(true)
    onBlockScrollBody(true)
  }, [])
  const closeLightbox = useCallback(() => {
    setCurrentPackIndex(0)
    setCurrentImageIndex(0)
    setViewerIsOpen(false)
    onBlockScrollBody(false)
  }, [])

  const bgSrc = getBgSrc(article?.briefBackground?.url, true)
  const thisPageUrl = `http://pravosleva.ru/article/${article.slug}`

  useEffect(() => {
    // You can call the Prism.js API here
    // Use setTimeout to push onto callback queue so it runs after the DOM is updated
    setTimeout(() => Prism.highlightAll(), 0)
  }, [])

  return (
    <AnimatePresence exitBeforeEnter>
      <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
      <Head>
        <title>{`Pravosleva${article?.title ? ` | ${convertToPlainText(article?.title)}` : 'No title'}`}</title>
        {!!article.brief && <meta name="description" content={convertToPlainText(article.brief)} />}
        {!!article.brief && <meta property="og:description" content={convertToPlainText(article.brief)} />}
        {!!bgSrc && <meta property="vk:image" content={bgSrc} />}
        {!!bgSrc && <meta property="twitter:image" content={bgSrc} />}
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta property="og:title" content={convertToPlainText(article.title)} />
        <meta property="og:image" content={bgSrc} />
        <meta property="og:type" content="article" />
        {isProd && <meta property="og:url" content={thisPageUrl} />}
        <meta property="og:site_name" content="pravosleva.ru" />
      </Head>
      <Layout>
        {article ? (
          <>
            {/**/}
            <div className="bx_breadcrumbs">
              <ul itemScope itemType="http://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
                  <Link href="/" as="/">
                    <a title="Pravosleva.ru" itemProp="item">
                      {t('HOME')}
                    </a>
                  </Link>
                </li>
                <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
                  <span>
                    {article?.title?.length > 30
                      ? `${article.title.substring(0, 30).replace(/`/g, '')}...`
                      : article.title.replace(/`/g, '')}
                  </span>
                </li>
              </ul>
            </div>

            <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="/article/[slug]">
              <div className="article-wrapper">
                <div className="tiles-grid-item-in-article white article-wrapper__big-image-as-container">
                  <h1 className="article-page-title">
                    {!!article.title ? <ReactMarkdown source={article.title} /> : 'No title'}
                  </h1>
                  {article?.brief && (
                    <div className="article-wrapper__big-image-as-container__brief">
                      <ReactMarkdown source={article.brief} />
                    </div>
                  )}
                  <small className="inactive article-wrapper__big-image-as-container__date">
                    {getFormatedDate2(new Date(article.createdAt))}
                  </small>
                </div>
              </div>
            </motion.div>
            <div className="article-body">
              {!!article.body ? (
                <ReactMarkdown className="description-markdown" renderers={baseRenderers} source={article.body} />
              ) : (
                'No body'
              )}
            </div>
            {article.slug === 'tipy-oborudovaniya-hvac' && (
              <div className="article-body">
                <HVACEquipment />
              </div>
            )}
            {!!article.gallery && article.gallery.length > 0 ? (
              <div className="galleries-wrapper">
                {article.gallery
                  .map(({ name, description, images = [], id }) => ({
                    id,
                    name,
                    description,
                    images: images.map(({ url }) => ({
                      src: getImageUrl(url, true),
                      caption: `${article.title}: ${description}.`,
                    })),
                  }))
                  .map(({ id, name, description, images, slug }, i) => (
                    <div
                      key={id}
                      style={{
                        marginBottom: '40px',
                      }}
                      onClick={() => setCurrentPackIndex(i)}
                    >
                      {name && <h2>{name}</h2>}
                      {description && (
                        <ReactMarkdown
                          className="description-markdown"
                          renderers={baseRenderers}
                          source={description}
                        />
                      )}
                      {/* WAY 1: */}
                      {/*
                      <Gallery
                        photos={images.map(({ src }) => ({
                          src,
                          width: 16,
                          height: 9,
                        }))}
                        onClick={openLightbox}
                        direction="column"
                        columns={columns}
                      />
                      */}
                      {/* WAY 2: */}
                      <Gallery images={images} key={typeof window} onItemClick={openLightbox} />
                      {viewerIsOpen && currentPackIndex === i && images[currentImageIndex] ? (
                        <Lightbox
                          imageTitle={`${!!name ? `${name}: ` : ''}${currentImageIndex + 1} / ${images.length}`}
                          imagePadding={0}
                          clickOutsideToClose={false}
                          mainSrc={images[currentImageIndex].src}
                          nextSrc={images[(currentImageIndex + 1) % images.length].src}
                          prevSrc={images[(currentImageIndex + images.length - 1) % images.length].src}
                          onCloseRequest={closeLightbox}
                          onMovePrevRequest={() => {
                            setCurrentImageIndex((currentImageIndex + images.length - 1) % images.length)
                          }}
                          onMoveNextRequest={() => {
                            setCurrentImageIndex((currentImageIndex + 1) % images.length)
                          }}
                        />
                      ) : null}
                    </div>
                  ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h1>Not found, try again...</h1>
            <div>
              Hey, where is the f*cking <code>id</code> in query params?
            </div>
          </>
        )}
        <ShareSection bgSrc={bgSrc} slug={article.slug} title={article.title} />
        <div className="special-link-wrapper fade-in-effect unselectable">
          <Link href="/" as="/">
            <a className="link-as-rippled-btn">
              <i className="fas fa-arrow-left"></i>
              <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
            </a>
          </Link>
        </div>
        <style jsx>{`
          .article-wrapper {
            width: 100%;
            background: linear-gradient(rgba(255, 255, 255, 1), transparent);
            display: block;
            position: relative;
          }
          .article-wrapper::after {
            content: '';
            background: url(${bgSrc});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            filter: grayscale(1);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            position: absolute;
            z-index: -1;
          }
          .article-wrapper__big-image-as-container {
            border-radius: 0;
            width: 100%;
            min-height: 250px;
            margin: 10px 0 50px 0;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .article-wrapper__big-image-as-container > * {
            margin: 0;
          }
          .article-wrapper__big-image-as-container__brief {
            margin-bottom: 30px;
            line-height: 1em;
            font-family: Montserrat;
            font-style: italic;
          }
          .article-wrapper__big-image-as-container__date {
            text-align: right;
          }
        `}</style>
      </Layout>
    </AnimatePresence>
  )
})

Article.getInitialProps = async (ctx) => {
  const { query } = ctx
  const { slug } = query

  const fetchArticle = async (slug) => {
    if (!slug) return null

    const result = await api
      .get(`/articles?slug=${slug}`)
      .then((res) => res.data)
      .catch((err) => err)

    if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
    return null
  }

  const res = await fetchArticle(slug)

  return { initArticleData: res }
}

export default Article
