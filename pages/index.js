import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
// import formatDistance from 'date-fns/formatDistance';
// EXAMPLE: formatDistance(new Date(createdAt), now, { addSuffix: true })
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { PulseLoader } from 'react-spinners';
// import Head from 'next/head';
// import dynamic from 'next/dynamic';

import Layout from '../components/layout';
import useDebounce from '../hooks/use-debounce';
import { Tiles } from '../components/Tiles';

// AUTH
// import nextCookie from 'next-cookies';
import { getMe } from '../hocs/auth/fns';
import { useDispatch } from 'react-redux';
import { userInfoActions } from '../store/reducer/user-info';


const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/api';
const api = axios.create({ baseURL });
const Loader = () => (
  <div
    className='fade-in-effect'
    style={{
      margin: '30px 0px 20px',
      // minHeight: '360px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <PulseLoader
      // css={override}
      size={15}
      margin={5}
      //size={"150px"} this also works
      // color='rgb(18, 58, 188)'
      color='#2E65B2'
      loading={true}
    />
  </div>
);
// const Banner = dynamic(() => import('../components/Banner'), {
//   ssr: false,
//   loading: () => <Loader />,
// });

// const delay = (ms = 3000) => new Promise(res => setTimeout(res, ms));

const IndexPage = ({ initialArtiles, usr = null }) => {
  const [isLoading, setLoading] = useState(false);
  const [articles, setArticles] = useState(initialArtiles);
  const [queryText, setQueryText] = useState('');
  const [searchBy, setSearchBy] = useState('body');
  const getNextSearchTarget = ({
    targets = ['body', 'title', 'tag'],
    current = 'body'
  }) => {
    const currentIndex = targets.findIndex(t => t === current);
    let nextIndex = 0;

    if (currentIndex >= targets.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = currentIndex + 1;
    }

    return targets[nextIndex];
  };
  const getPrefix = name => {
    switch (name) {
      case 'body': case 'title': return 'in';
      default: return 'by';
    }
  };

  const debouncedSetQueryText = useDebounce(queryText, 1000);
  const debouncedSearchBy = useDebounce(searchBy, 1000);

  // Here's where the API call happens
  // We use useEffect since this is an asynchronous action
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSetQueryText || debouncedSearchBy) {
        if (window) window.scrollTo({ top: 0, behavior: 'auto' });

        // Set isSearching state
        setLoading(true);
        // Fire off our API call
        fetchArticles({
          queryText: debouncedSetQueryText,
          targetField: debouncedSearchBy,
        })
          .then(results => {
            // Set results state
            if (Array.isArray(results)) setArticles(results);
            // Set back to false since request finished
            setLoading(false);
          });
      } else {
        // setArticles([]);
      }
    },
    [debouncedSetQueryText, debouncedSearchBy, setLoading, setArticles]
  );

  // --- TODO: REFACTOR AUTH: Set to Redux on client
  const dispatch = useDispatch();
  useEffect(() => {
    if (usr.id) dispatch(userInfoActions.setUser({ ...usr }));
  }, [usr.id]);
  // ---

  return (
    <>
      <Layout>
        <div id='searchPanel'>
          <span id='bodySearchToggler' className='unselectable' onClick={() => {
            setSearchBy(getNextSearchTarget({ current: searchBy }));
          }}>
            {
              (() => {
                switch (searchBy) {
                  case 'body': return <i className="fas fa-code"></i>;
                  case 'title': return <i className="fas fa-heading"></i>;
                  case 'tag': return <i className="fas fa-tag"></i>;
                  default: return null;
                }
              })()
            }
          </span>
          <input
            id='searchText'
            type='text'
            value={queryText}
            onChange={e => setQueryText(e.target.value)}
            placeholder={`Search ${getPrefix(searchBy)} ${searchBy}...`}
            className='unselectable'
            style={{
              maxWidth: queryText ? '100%' : '250px'
            }}
          />
          {
            queryText
            ? <span id='clearSearchText' className='unselectable fade-in-effect' onClick={() => setQueryText('')}><i className='fas fa-times'></i></span>
            : null
          }
        </div>
        {/*
          isLoading
          ? <Loader />
          : articles.length > 0
            ? <Banner articles={articles} />
            : null
        */}
        {
          <Tiles articles={articles} />
        }
        {
          isLoading && <Loader />
        }
        {
          !isLoading && articles.length > 0
          ? (
            <div>
              {
                articles.map(({ id, title, createdAt, tags = [] }) => (
                  <div
                    key={id}
                    style={{
                      padding: '20px 0 10px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                    className='special-link-wrapper'
                  >
                    <Link
                      href={`/article/${id}`}
                    ><a className='special-link unselectable'>{title.length > 30 ? `${title.substr(0, 30)}...` : title}</a></Link>
                    <small className='unselectable' style={{ opacity: '0.5', padding: '10px 0 10px 10px', textAlign: 'right' }}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</small>
                    {
                      tags.length > 0
                      ? (
                        <div
                          style={{
                            position: 'absolute',
                            top: '0', left: '0',
                            // transform: 'translateY(5px)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                          className='unselectable'
                        >
                          <i className="fas fa-tag" style={{ marginRight: '10px', opacity: '0.2' }}></i>
                          {tags.map(({ id, name }) => (
                            <span
                              key={id}
                              style={{ marginRight: '10px' }}
                              className='the-tag'
                              onClick={() => {
                                setSearchBy('tag');
                                setQueryText(name);
                              }}
                            >{name}</span>
                          ))}
                        </div>
                      ) : null
                    }
                  </div>
                ))
              }
            </div>
          ) : <div><em style={{ opacity: '0.4' }}>No results...</em></div>
        }
      </Layout>
    </>
  );
}

// API search function
async function getTagIDByName(name) {
  const result = await api.get(`/tags?name_contains=${name}`)
    .then(res => res.data)
    .catch(err => err);
  if (result && Array.isArray(result) && result.length > 0) return result[0].id;
  return 'tag-not-found';
};
async function _getQueryString({
  queryText,
  targetField,
  options,
}) {
  let queryString = '';
  const {
    limit = 5,
    start = 0,
  } = options;

  if (limit) queryString += '&_limit=' + limit;
  if (start) queryString += '&_start=' + start;
  switch (targetField) {
    case 'body':
    case 'title':
      queryString += `&${targetField}_contains=${queryText}`;
      break;
    case 'tag':
      const tagID = await getTagIDByName(queryText);
      if (tagID) queryString += `&tags_in=${tagID}`;
      break;
    default: break;
  }
  queryString += '&_sort=createdAt:DESC&isPublished_eq=true';

  return queryString.slice(1);
}
async function fetchArticles ({ queryText = '', targetField = 'body' }) {
  const query = await _getQueryString({
    queryText: encodeURIComponent(queryText),
    targetField,
    // TMP:
    options: { limit: 5, start: 0 },
  });
  const route = queryText
    ? `/articles?${query}`
    : '/articles?_sort=createdAt:DESC&isPublished_eq=true&_limit=5';
  const result = await api.get(route)
    .then(res => res.data)
    .catch(err => err);
  if (Array.isArray(result)) {
    return Promise.resolve(result)
  } else {
    return Promise.resolve([]);
  };
}

IndexPage.getInitialProps = async ctx => {
  const res = await fetchArticles({});

  // --- TODO: REFACTOR AUTH
  const usr = await getMe(ctx)
    .then(usr => usr)
    .catch(err => err);
  // ---

  return { initialArtiles: res, usr }
}

export default IndexPage;
