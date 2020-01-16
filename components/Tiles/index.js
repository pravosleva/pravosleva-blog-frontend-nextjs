import Link from 'next/link';


const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://www.pravosleva.ru/api'; // 'http://80.87.194.181/api';

export const Tiles = ({
  articles,
}) => (
  <>
    {
      articles.length > 0
      ? (
        <div className='tiles-wrapper'>
          {
            articles.map(({ id, briefBackground, title, brief = 'No brief' }, i) => {
              const bgSrc = briefBackground && briefBackground.url
                ?
                  dev ? `http://80.87.194.181/api${briefBackground.url}` : `${baseURL}${briefBackground.url}`
                : '/text-1.jpeg';

              return (
                <div
                  className='tiles-item white'
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
                  <em>{brief}</em>
                  <span style={{ textAlign: 'right' }}>
                    <Link
                      href={`/article/${id}`}
                    ><a className='special-link white unselectable'>Read more</a></Link>
                  </span>
                </div>
              )
            })
          }
        </div>
      ) : null
    }
  </>
);
