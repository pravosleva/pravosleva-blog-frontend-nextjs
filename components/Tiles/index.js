import { memo } from 'react';
import Link from 'next/link';
import { Map } from 'immutable';


const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://www.pravosleva.ru/api'; // 'http://80.87.194.181/api';

const Grid = ({
  articles,
}) => (
  <>
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
function areEqual(prevProps, nextProps) {
  /*
  возвращает true, если nextProps рендерит
  тот же результат что и prevProps,
  иначе возвращает false
  */

  const test1 = new Map({ ...prevProps.articles });
  const test2 = new Map({ ...nextProps.articles });

  console.log(test1);
  console.log(test2);

  return test1.equals(test2);
}

export const Tiles = memo(Grid, areEqual);
