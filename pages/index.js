import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { Layout } from '@/components/layout'
import useDebounce from '@/hooks/use-debounce'
import loadable from '@loadable/component'
import { getApiUrl } from '@/utils/getApiUrl'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

const Tiles = loadable(() =>
  import(/* webpackChunkName: "Tiles" */ '@/components/Tiles').then(({ Tiles }) => ({
    default: Tiles,
  }))
)

const baseURL = getApiUrl()
const api = axios.create({ baseURL })
const Loader = () => (
  <div className="fade-in-effect loader-wrapper">
    <PulseLoader size={15} margin={5} color="#0162c8" loading={true} />
  </div>
)

const IndexPage = ({ initialArtiles, initialArtilesCounter, usr }) => {
  const [isLoading, setLoading] = useState(false)
  const [articles, setArticles] = useState(initialArtiles)
  const [articlesCounter, setArticlesCounter] = useState(initialArtilesCounter)
  const [queryText, setQueryText] = useState('')
  const handleChangeText = useCallback((e) => setQueryText(e.target.value), [])
  const handleClearText = useCallback(() => setQueryText(''), [])
  const [searchBy, setSearchBy] = useState('body')
  const [start, setStart] = useState(0)
  const getNextSearchTarget = useCallback(({ targets = ['body', 'title', 'tag'], current = 'title' }) => {
    const currentIndex = targets.findIndex((t) => t === current)
    let nextIndex = 0

    if (currentIndex >= targets.length - 1) {
      nextIndex = 0
    } else {
      nextIndex = currentIndex + 1
    }

    return targets[nextIndex]
  }, [])
  const getPrefix = useCallback((name) => {
    switch (name) {
      case 'body':
      case 'title':
        return 'in'
      default:
        return 'by'
    }
  }, [])

  const debouncedSetQueryText = useDebounce(queryText, 1000)
  const debouncedSearchBy = useDebounce(searchBy, 1000)

  const newFetchCb = useCallback(() => {
    if (!!window) window.scrollTo({ top: 0, behavior: 'auto' })

    setStart(0)
    setLoading(true)

    Promise.all([
      fetchArticles({ queryText: debouncedSetQueryText, targetField: debouncedSearchBy }).then((results) => {
        if (Array.isArray(results)) setArticles(results)
      }),
      fetchArticlesCounter({ queryText: debouncedSetQueryText, targetField: searchBy }).then((res) =>
        setArticlesCounter(res)
      ),
    ]).then(() => setLoading(false))
  }, [debouncedSetQueryText, debouncedSearchBy, searchBy])
  const newFetch = useDebouncedCallback(newFetchCb, 500)

  useEffect(() => {
    if (!!debouncedSetQueryText || !!debouncedSearchBy) newFetch()
  }, [debouncedSetQueryText, setLoading, setArticles])
  useEffect(() => {
    if (!!debouncedSetQueryText) newFetch()
  }, [debouncedSearchBy, setLoading, setArticles])

  const handleStartForNextPage = useCallback(() => {
    if (!isLoading) setStart(start + 5)
  }, [isLoading, start, setStart])
  const handleStartForPrevPage = useCallback(() => {
    if (!isLoading) setStart(start - 5)
  }, [isLoading, start, setStart])
  useEffect(() => {
    if (!!window) window.scrollTo({ top: 0, behavior: 'auto' })

    setLoading(true)
    fetchArticles({ queryText, targetField: searchBy, start }).then((results) => {
      if (Array.isArray(results)) setArticles(results)
      setLoading(false)
    })
    fetchArticlesCounter({ queryText, targetField: searchBy }).then((res) => setArticlesCounter(res))
  }, [start])
  const handleSearchToggler = useCallback(() => {
    setSearchBy(getNextSearchTarget({ current: searchBy }))
  }, [searchBy])
  const getIconByCritery = useCallback((searchBy) => {
    switch (searchBy) {
      case 'body':
        return <i className="fas fa-code"></i>
      case 'title':
        return <i className="fas fa-heading"></i>
      case 'tag':
        return <i className="fas fa-tag"></i>
      default:
        return <i className="fas fa-code"></i>
    }
  }, [])

  return (
    <>
      <Layout>
        <div className="homepage-wrapper">
          <div className="searchPanel-wrapper">
            <div id="searchPanel">
              <span id="bodySearchToggler" className="unselectable" onClick={handleSearchToggler}>
                {getIconByCritery(searchBy)}
              </span>
              <input
                id="searchText"
                type="text"
                value={queryText}
                onChange={handleChangeText}
                placeholder={`Search ${getPrefix(searchBy)} ${searchBy}...`}
                className="unselectable"
                style={{ maxWidth: queryText ? '100%' : '350px' }}
              />
              {queryText ? (
                <span id="clearSearchText" className="unselectable fade-in-effect" onClick={handleClearText}>
                  <i className="fas fa-times"></i>
                </span>
              ) : null}
            </div>
          </div>
          {
            <Tiles
              articles={articles}
              articlesCounter={articlesCounter}
              currentStart={start}
              handleStartForNextPage={handleStartForNextPage}
              handleStartForPrevPage={handleStartForPrevPage}
              isLoading={isLoading}
            />
          }
          {isLoading && <Loader />}
        </div>
      </Layout>
    </>
  )
}

// API search function
async function getTagIDByName(name) {
  const result = await api
    .get(`/tags?name_contains=${name}`)
    .then((res) => res.data)
    .catch((err) => err)

  if (!!result && Array.isArray(result) && result.length > 0) return result[0].id

  return 'tag-not-found'
}
async function _getQueryString({ queryText, targetField, options }) {
  let queryString = ''
  const { limit = 5, start = 0 } = options

  if (!!limit) queryString += '&_limit=' + limit
  if (!!start) queryString += '&_start=' + start
  if (!!queryText) {
    switch (targetField) {
      case 'body':
      case 'title':
        queryString += `&${targetField}_contains=${queryText}`
        break
      case 'tag':
        const tagID = await getTagIDByName(queryText)

        if (tagID === 'tag-not-found') return null
        if (!!tagID) queryString += `&tags_in=${tagID}`
        break
      default:
        break
    }
  }

  queryString += '&_sort=createdAt:DESC&isPublished_eq=true'

  return queryString.slice(1)
}
async function fetchArticles({ queryText, targetField, start }) {
  const query = await _getQueryString({
    queryText: !!queryText ? encodeURIComponent(queryText) : null,
    targetField,
    options: { limit: 5, start }, // TMP
  })

  if (!query) return Promise.resolve([]) // Special for tag-not-found

  const result = await api
    .get(`/articles?${query}`)
    .then((res) => res.data)
    .catch((err) => err)

  if (Array.isArray(result)) {
    return Promise.resolve(result)
  } else {
    return Promise.resolve([])
  }
}
async function fetchArticlesCounter({ queryText, targetField }) {
  const query = await _getQueryString({
    queryText: !!queryText ? encodeURIComponent(queryText) : null,
    targetField,
    options: { limit: 5 }, // TMP
  })
  if (!query) return Promise.resolve(0)

  const result = await api
    .get(`/articles/count?${query}`)
    .then((res) => res.data)
    .catch((err) => err)

  if (Number.isInteger(result)) {
    return Promise.resolve(result)
  } else {
    return Promise.reject('Ответ не является целым числом')
  }
}

IndexPage.getInitialProps = async (ctx) => {
  const articles = await fetchArticles({
    queryText: '',
    targetField: 'body',
    start: 0,
  })
  const articlesCounter = await fetchArticlesCounter({ queryText: '', targetField: 'body' })

  return {
    initialArtilesCounter: articlesCounter,
    initialArtiles: articles,
    usr: null,
  }
}

export default IndexPage
