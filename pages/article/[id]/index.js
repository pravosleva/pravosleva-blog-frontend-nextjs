import { useState, useCallback, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { PulseLoader } from 'react-spinners';
import Lightbox from 'react-image-lightbox';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../../../components/layout';
// AUTH
import { getMe } from '../../../hocs/auth/fns';
import { useDispatch } from 'react-redux';
import { userInfoActions } from '../../../store/reducer/user-info';


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
  // const allSrc = [];

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
        // bgSrc: briefBackground && briefBackground.url
        //   ?
        //     isDev
        //     ? `http://80.87.194.181/api${briefBackground.url}`
        //     : `${baseURL}${briefBackground.url}`
        //   : '/text-1.jpeg',
      });

      // images.forEach(({ url }) => {
      //   allSrc.push(isDev ? `http://80.87.194.181/api${url}` : `${baseURL}${url}`);
      // });
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
              <div
                className='bx_breadcrumbs'
                // style={{ marginTop: '38px' }}
              >
                <ul itemScope itemType='http://schema.org/BreadcrumbList'>
                  <li
                    itemProp='itemListElement'
                    itemScope
                    itemType='http://schema.org/ListItem'
                  >
                    <Link
                      href='/'
                      title='Pravosleva.ru'
                      itemProp='item'
                    >
                      Главная
                    </Link>
                  </li>
                  <li
                    itemProp='itemListElement'
                    itemScope
                    itemType='http://schema.org/ListItem'
                  >
                    <span style={{
                      fontFamily: 'Montserrat',
                      textDecoration: 'none',
                      color: 'gray',
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                    }}>
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
                className='tiles-grid-item white'
                style={{
                  borderRadius: '0',
                  width: '100%',
                  minHeight: '250px',
                  backgroundImage: `url(${bgSrc})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  margin: '10px 0 50px 0',
                }}
              >
                <h1 className='fade-in-effect'>{article.title || 'No title'}</h1>
                {
                  article.brief
                  ? <div style={{ marginBottom: '30px' }} className='fade-in-effect'><em style={{ fontFamily: 'Montserrat' }}>{article.brief}</em></div>
                  : null
                }
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
                  <>
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
                          {/* WAY 1: react-images
                          <ModalGateway>
                            {viewerIsOpen ? (
                              <Modal onClose={closeLightbox}>
                                <Carousel
                                  currentIndex={currentPackIndex}
                                  views={article.photos.map(({ url }) => ({
                                    src: `${baseURL}${url}`,
                                    caption: article.title
                                  }))}
                                />
                              </Modal>
                            ) : null}
                          </ModalGateway>
                          */}
                          {/* WAY 2: react-image-lightbox */}
                          {
                            viewerIsOpen && currentPackIndex === i && images[currentImageIndex]
                            ? (
                              <Lightbox
                                imageTitle={`${name ? `${name}: ` : ''}${currentImageIndex + 1} / ${images.length}`}
                                // imageCaption={`${formatDateByMS(createdAtMS)} (${photos.length} ${getFilesInRussian(photos.length)}${photos.length !== images.length ? `, из них ${images.length} ${getImagesInRussian(images.length)}` : ''})`}
                                // imageCaption={images[photoIndex]}
                                imagePadding={0}
                                clickOutsideToClose={false}
                                mainSrc={images[currentImageIndex].src}
                                nextSrc={images[(currentImageIndex + 1) % images.length].src}
                                prevSrc={images[(currentImageIndex + images.length - 1) % images.length].src}
                                onCloseRequest={closeLightbox}
                                onMovePrevRequest={() => {
                                  // setCurrentPackIndex((currentImageIndex + images.length - 1) % images.length);
                                  setCurrentImageIndex((currentImageIndex + images.length - 1) % images.length);
                                }}
                                onMoveNextRequest={() => {
                                  // setCurrentPackIndex((currentImageIndex + 1) % images.length);
                                  setCurrentImageIndex((currentImageIndex + 1) % images.length);
                                }}
                              />
                            ) : null
                          }

                        </div>
                      ))
                    }
                  </>
                ) : null
              }
            </>
          ) : (
            <h1>Not found, try again...</h1>
            // <div>Hey, where is the f*cking <code>id</code> as query param?</div>
          )
        }
        <div
          key={id}
          style={{
            padding: '10px 0 10px 0',
            // marginBottom: '20px',
            width: '100%',
          }}
          className='special-link-wrapper fade-in-effect unselectable'
        >
          <Link href="/"><a className='special-link'>Go back to the homepage</a></Link>
        </div>
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
