import { useState, useCallback } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { PulseLoader } from 'react-spinners';
// import Gallery from 'react-photo-gallery';
import Lightbox from 'react-image-lightbox';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '../../../components/layout';


const Gallery = dynamic(() => import('react-photo-gallery'), {
  ssr: false
});

// const baseURL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/api';
const dev = process.env.NODE_ENV === 'development';
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

const Article = ({ initArticleData: article }) => {
  const router = useRouter();
  const { id } = router.query;
  // GALLERY:
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);
  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  let images = [];

  if (article && article.photos && article.photos.length > 0) {
    images = article.photos.map(({ url }) => ({
      src: dev ? `http://80.87.194.181/api${url}` : `${baseURL}${url}`,
      caption: article.title
    }));
  }

  return (
    <>
      <Head>
        <title>{`Pravosleva | ${article && article.title ? article.title : 'Not found'}`}</title>
      </Head>
      <Layout>
        {
          article
          ? (
            <>
              <h1 className='fade-in-effect'>{article.title || 'No title'}</h1>
              {
                article.brief
                ? <blockquote style={{ marginBottom: '30px' }} className='brooks fade-in-effect'>{article.brief}</blockquote>
                : null
              }
              <div className='article-body fade-in-effect'>{
                article.body
                ? <ReactMarkdown source={article.body} />
                : 'No body'
              }</div>
              {
                article.photos && article.photos.length > 0
                ? (
                  <div style={{
                    marginBottom: '30px'
                  }}>
                    <Gallery
                      photos={
                        article.photos
                          .map(({ url }) => ({
                            src: dev ? `http://80.87.194.181/api${url}` : `${baseURL}${url}`,
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
                            currentIndex={currentImage}
                            views={article.photos.map(({ url }) => ({
                              src: `${baseURL}${url}`,
                              caption: article.title
                            }))}
                          />
                        </Modal>
                      ) : null}
                    </ModalGateway>
                    */}
                    {/* WAY 2:  */}
                    {
                      viewerIsOpen
                      ? (
                        <Lightbox
                          imageTitle={`${currentImage + 1} / ${images.length}`}
                          // imageCaption={`${formatDateByMS(createdAtMS)} (${photos.length} ${getFilesInRussian(photos.length)}${photos.length !== images.length ? `, из них ${images.length} ${getImagesInRussian(images.length)}` : ''})`}
                          // imageCaption={images[photoIndex]}
                          imagePadding={0}
                          clickOutsideToClose={false}
                          mainSrc={images[currentImage].src}
                          nextSrc={images[(currentImage + 1) % images.length].src}
                          prevSrc={images[(currentImage + images.length - 1) % images.length].src}
                          onCloseRequest={closeLightbox}
                          onMovePrevRequest={() => setCurrentImage((currentImage + images.length - 1) % images.length)}
                          onMoveNextRequest={() => setCurrentImage((currentImage + 1) % images.length)}
                        />
                      ) : null
                    }
                  </div>
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
          style={{ padding: '10px 0 20px 0', marginBottom: '10px', width: '100%' }}
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

  return { initArticleData: res }
}

export default Article;
