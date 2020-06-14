import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import loadable from '@loadable/component'
import Head from 'next/head'
import { Layout } from '@/components/layout'
import { getFormatedDate2 } from '@/utils/timeConverter'
import Prism from 'prismjs'

const Lightbox = loadable(() => import(/* webpackChunkName: "react-image-lightbox" */ 'react-image-lightbox'))
const Gallery = loadable(() => import(/* webpackChunkName: "react-photo-gallery" */ 'react-photo-gallery'), {
  ssr: false,
})

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const baseURL = isDev ? 'http://localhost:1337' : 'http://pravosleva.ru/api'
const api = axios.create({ baseURL })

function columns(containerWidth) {
  let columns = 1

  if (containerWidth >= 500) columns = 2
  if (containerWidth >= 900) columns = 3
  if (containerWidth >= 1500) columns = 4

  return columns
}

const Article = ({ initArticleData: article, usr }) => {
  // const router = useRouter()
  // const { id } = router.query
  // GALLERY:
  const [currentPackIndex, setCurrentPackIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewerIsOpen, setViewerIsOpen] = useState(false)
  const openLightbox = useCallback((_, { index }) => {
    setCurrentImageIndex(index)
    setViewerIsOpen(true)
  }, [])
  const closeLightbox = () => {
    setCurrentPackIndex(0)
    setCurrentImageIndex(0)
    setViewerIsOpen(false)
  }
  let imagesPacks = []

  if (article?.gallery?.length > 0) {
    article.gallery.forEach(({ name, description, images = [], id }) => {
      imagesPacks.unshift({
        id,
        name,
        description,
        images: images.map(({ url }) => ({
          src: isDev ? `http://80.87.194.181/api${url}` : `${baseURL}${url}`,
          caption: `${article.title}: ${description}.`,
        })),
      })
    })
  }

  const bgSrc = article?.briefBackground?.url
    ? isDev
      ? `http://80.87.194.181/api${article.briefBackground.url}`
      : `${baseURL}${article.briefBackground.url}`
    : '/static/img/text-1.jpeg'
  const thisPageUrl = `http://pravosleva.ru/article/${article.id}`

  useEffect(() => {
    // You can call the Prism.js API here
    // Use setTimeout to push onto callback queue so it runs after the DOM is updated
    setTimeout(() => Prism.highlightAll(), 0)
  }, [])

  return (
    <>
      <Head>
        <title>{`Pravosleva | ${article?.title || 'No title'}`}</title>
        {!!article.brief && <meta name="description" content={article.brief} />}
        {!!article.brief && <meta property="og:description" content={article.brief} />}
        {!!bgSrc && <meta property="vk:image" content={bgSrc} />}
        {!!bgSrc && <meta property="twitter:image" content={bgSrc} />}
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta property="og:title" content={article.title} />
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
                      Главная
                    </a>
                  </Link>
                </li>
                <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
                  <span>{article?.title?.length > 30 ? `${article.title.substring(0, 30)}...` : article.title}</span>
                </li>
              </ul>
            </div>

            <div className="article-wrapper">
              <div className="fade-in-effect tiles-grid-item-in-article white article-wrapper__big-image-as-container">
                <h1 className="article-page-title">{article.title || 'No title'}</h1>
                {article?.brief && (
                  <div className="fade-in-effect article-wrapper__big-image-as-container__title">
                    <em>{article.brief}</em>
                  </div>
                )}
                <small className="inactive article-wrapper__big-image-as-container__date">
                  {getFormatedDate2(new Date(article.createdAt))}
                </small>
              </div>
            </div>

            <div className="article-body fade-in-effect">
              {!!article.body ? <ReactMarkdown source={article.body} /> : 'No body'}
            </div>
            {article.gallery && imagesPacks.length > 0 ? (
              <div className="galleries-wrapper">
                {imagesPacks.map(({ id, name, description, images }, i) => (
                  <div
                    key={id}
                    style={{
                      marginBottom: '40px',
                    }}
                    onClick={() => setCurrentPackIndex(i)}
                  >
                    {name && <h2>{name}</h2>}
                    {description && <p>{description}</p>}
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
        <div className="special-link-wrapper fade-in-effect unselectable">
          <Link href="/" as="/">
            <a className="link-as-rippled-btn">
              <i className="fas fa-arrow-left"></i>
              <span style={{ marginLeft: '10px' }}>Go back to the homepage</span>
            </a>
          </Link>
        </div>
        <style jsx>{`
          @media (max-width: 767px) {
            .article-page-title {
              text-transform: uppercase;
              font-size: 2em;
              font-weight: bold;
              letter-spacing: 0.1em;
            }
          }
          @media (min-width: 768px) {
            .article-page-title {
              text-transform: uppercase;
              font-size: 2em;
              /* font-weight: bold; */
              /* letter-spacing: 0.1em; */
            }
          }
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
          .article-wrapper__big-image-as-container__title {
            margin-bottom: 30px;
            font-family: Montserrat;
          }
          .article-wrapper__big-image-as-container__date {
            text-align: right;
          }
        `}</style>
      </Layout>
    </>
  )
}

Article.getInitialProps = async (ctx) => {
  const { query } = ctx
  const { id } = query

  const fetchArticle = async (id) => {
    if (!id) return null

    const result = await api
      .get(`/articles/${id}`)
      .then((res) => res.data)
      .catch((err) => err)

    if (result && result.id) return result
    return null
  }

  const res = await fetchArticle(id)

  return { initArticleData: res, usr: null }
}

export default Article
