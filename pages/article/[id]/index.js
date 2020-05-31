import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Lightbox from 'react-image-lightbox';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../../../components/layout';
import { getMe } from '../../../hocs/auth/fns';
import { useDispatch } from 'react-redux';
import { userInfoActions } from '../../../store/reducer/user-info';
import { getFormatedDate2 } from '../../../lib/timeConverter';


const Gallery = dynamic(() => import('react-photo-gallery'), {
  ssr: false,
});

// const baseURL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337';
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const baseURL = isDev
  ? 'http://localhost:1337'
  : 'http://pravosleva.ru/api';
const api = axios.create({ baseURL });
// to best see the results, click the popout button in the preview browser
// and resize your browser
function columns(containerWidth) {
  let columns = 1;

  if (containerWidth >= 500) columns = 2;
  if (containerWidth >= 900) columns = 3;
  if (containerWidth >= 1500) columns = 4;

  return columns;
}

const Article = ({ initArticleData: article, usr = null }) => {
  const router = useRouter();
  const { id } = router.query;
  // GALLERY:
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImageIndex(index);
    setViewerIsOpen(true);
  }, []);
  const closeLightbox = () => {
    setCurrentPackIndex(0);
    setCurrentImageIndex(0);
    setViewerIsOpen(false);
  };
  let imagesPacks = [];

  if (article && article.gallery && article.gallery.length > 0) {
    article.gallery.forEach(({ name, description, images = [], id, briefBackground }) => {
      imagesPacks.unshift({
        id,
        name,
        description,
        images: images.map(({ url }) => ({
          src: isDev ? `http://80.87.194.181/api${url}` : `${baseURL}${url}`,
          caption: `${article.title}: ${description}.`,
        })),
      });
    })
  }

  const bgSrc = article.briefBackground && article.briefBackground.url
    ?
      isDev ? `http://80.87.194.181/api${article.briefBackground.url}` : `${baseURL}${article.briefBackground.url}`
    : '/text-1.jpeg';
  const thisPageUrl = `http://pravosleva.ru/article/${article.id}`;

  // --- TODO: REFACTOR AUTH: Set to Redux on client
  const dispatch = useDispatch();
  useEffect(() => {
    if (usr.id) dispatch(userInfoActions.setUser({ ...usr }));
  }, [usr.id]);
  // ---

  return (
    <>
      <Head>
        <title>{`Pravosleva | ${article && article.title ? article.title : 'Not found'}`}</title>
        {
          !!article.brief &&
          <meta name='description' content={article.brief} />
        }
        {
          !!article.brief &&
          <meta property='og:description' content={article.brief} />
        }
        {
          bgSrc && // 537x240
          <meta property='vk:image' content={bgSrc} />
        }
        {
          bgSrc && // 1024x512
          <meta property='twitter:image' content={bgSrc} />
        }
        <meta property='og:image:width' content='600' />
        <meta property='og:image:height' content='315' />
        <meta property='og:title' content={article.title} />
        <meta property='og:image' content={bgSrc} />
        <meta property='og:type' content='article' />
        {
          isProd && <meta property='og:url' content={thisPageUrl} />
        }
        <meta property='og:site_name' content='pravosleva.ru' />
      </Head>
      <Layout>
        {
          article
          ? (
            <>
              {/**/}
              <div className='bx_breadcrumbs'>
                <ul itemScope itemType='http://schema.org/BreadcrumbList'>
                  <li
                    itemProp='itemListElement'
                    itemScope
                    itemType='http://schema.org/ListItem'
                  >
                    <Link href='/'>
                      <a
                        title='Pravosleva.ru'
                        itemProp='item'
                      >Главная</a>
                    </Link>
                  </li>
                  <li
                    itemProp='itemListElement'
                    itemScope
                    itemType='http://schema.org/ListItem'
                  >
                    <span>
                      {
                        article.title.length > 30
                        ? `${article.title.substring(0, 30)}...`
                        : article.title
                      }
                    </span>
                  </li>
                </ul>
              </div>

              <div
                className='article-wrapper'
                style={{
                  minHeight: '250px',
                  width: '100%',
                  // background: 'linear-gradient(rgba(230,100,101,0.5), rgba(46,101,178,0.5))',
                  background: 'linear-gradient(rgba(255,255,255,1), transparent)',
                  display: 'block',
                  position: 'relative'
                }}
              >
                <div
                  className='fade-in-effect tiles-grid-item white'
                  style={{
                    borderRadius: '0',
                    width: '100%',
                    minHeight: '250px',
                    // backgroundImage: `url(${bgSrc})`,
                    // backgroundRepeat: 'no-repeat',
                    // backgroundSize: 'cover',
                    // backgroundPosition: 'center',
                    margin: '10px 0 50px 0',
                    
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // alignItems: ''
                  }}
                >
                  <h1>{article.title || 'No title'}</h1>
                  {
                    article.brief
                    ? <div style={{ marginBottom: '30px' }} className='fade-in-effect'><em style={{ fontFamily: 'Montserrat' }}>{article.brief}</em></div>
                    : null
                  }
                  <small style={{ textAlign: 'right' }} className='inactive'>{getFormatedDate2(new Date(article.createdAt))}</small>
                </div>
              </div>

              <div
                className='article-body fade-in-effect'
                style={{ marginBottom: '40px' }}
              >{
                article.body
                ? <ReactMarkdown source={article.body} />
                : 'No body'
              }</div>
              {
                article.gallery && imagesPacks.length > 0
                ? (
                  <div className='galleries-wrapper'>
                    {
                      imagesPacks.map(({ id, name, description, images }, i) => (
                        <div
                          key={id}
                          style={{
                            marginBottom: '40px'
                          }}
                          onClick={() => setCurrentPackIndex(i)}
                        >
                          { name && <h2>{name}</h2> }
                          { description && <p>{description}</p> }
                          <Gallery
                            photos={
                              images
                                .map(({ src }) => ({
                                  src,
                                  width: 16,
                                  height: 9,
                                }))
                            }
                            onClick={openLightbox}
                            direction='column'
                            columns={columns}
                          />
                          {
                            viewerIsOpen && currentPackIndex === i && images[currentImageIndex]
                            ? (
                              <Lightbox
                                imageTitle={`${name ? `${name}: ` : ''}${currentImageIndex + 1} / ${images.length}`}
                                imagePadding={0}
                                clickOutsideToClose={false}
                                mainSrc={images[currentImageIndex].src}
                                nextSrc={images[(currentImageIndex + 1) % images.length].src}
                                prevSrc={images[(currentImageIndex + images.length - 1) % images.length].src}
                                onCloseRequest={closeLightbox}
                                onMovePrevRequest={() => {
                                  setCurrentImageIndex((currentImageIndex + images.length - 1) % images.length);
                                }}
                                onMoveNextRequest={() => {
                                  setCurrentImageIndex((currentImageIndex + 1) % images.length);
                                }}
                              />
                            ) : null
                          }

                        </div>
                      ))
                    }
                  </div>
                ) : null
              }
            </>
          ) : (
            <>
              <h1>Not found, try again...</h1>
              <div>Hey, where is the f*cking <code>id</code> in query params?</div>
            </>
          )
        }
        <div className='special-link-wrapper fade-in-effect unselectable'>
          <Link href='/'><a className='special-link-underline'><i className='fas fa-arrow-left'></i><span style={{ marginLeft: '10px' }}>Go back to the homepage</span></a></Link>
        </div>
        <style jsx>{`
          .article-wrapper::after {
            content: "";
            background: url(${bgSrc});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            filter: grayscale(1);
            // opacity: 0.5;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            position: absolute;
            z-index: -1;
          }
        `}</style>
      </Layout>
    </>
  )
};

Article.getInitialProps = async ctx => {
  const { query } = ctx;
  const { id } = query;

  const fetchArticle = async id => {
    if (!id) return;

    const result = await api.get(`/articles/${id}`)
      .then(res => res.data)
      .catch(err => err);

    if (result && result.id) return result;
    return null;
  }

  const res = await fetchArticle(id);

  // --- TODO: REFACTOR AUTH
  const usr = await getMe(ctx)
    .then(usr => usr)
    .catch(err => err);
  // ---

  return { initArticleData: res, usr }
}

export default Article;
