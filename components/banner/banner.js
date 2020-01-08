import Link from 'next/link';
import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';


const { Element } = BannerAnim;
const BgElement = Element.BgElement;

// const baseURL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:1337';
const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/api';

const Banner = ({ articles }) => (
  <div className='fade-in-effect' >
    <BannerAnim
      autoPlay
      dragPlay={false}
      // autoPlaySpeed={6000}
      prefixCls='banner-user'
      style={{ margin: '30px 0 20px 0' }}
    >
      {
        articles.map(({ id, photos, title, brief = 'No brief' }, i) => {
          const bgSrc = photos && Array.isArray(photos) && photos.length > 0
            ?
              dev ? `http://80.87.194.181/api${photos[0].url}` : `${baseURL}${photos[0].url}`
            : '/text-1.jpeg';
          return (
            <Element
              key={id}
              name={i}
              prefixCls='banner-user-elem'
            >
              <BgElement
                key={`bg-${id}`}
                className='bg'
                style={{
                  backgroundImage: `url(${bgSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  paddingLeft: '50px',
                  paddingRight: '50px',
                }}
              />
              <QueueAnim
                name='QueueAnim'
                className='unselectable'
                style={{
                  paddingTop: '50px',
                  paddingLeft: '50px',
                  paddingRight: '50px',
                }}
              >
                <h2 key='h2'>{title}</h2>
                <p key='p'><em>{brief}</em></p>
              </QueueAnim>
              <TweenOne
                animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }}
                name='TweenOne1'
                className='unselectable'
                style={{
                  paddingLeft: '50px',
                  paddingRight: '50px',
                }}
              >
              <Link
                href={`/article/${id}`}
              ><a className='special-link white unselectable'>Read more</a></Link>
              </TweenOne>
            </Element>
          )
        })
      }
    </BannerAnim>
  </div>
);

export default Banner;
