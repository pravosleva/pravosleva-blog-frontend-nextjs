import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { Layout } from '@/components/layout'
import useDebounce from '@/hooks/use-debounce'
import loadable from '@loadable/component'
import { getApiUrl } from '@/utils/getApiUrl'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { withTranslator } from '@/hocs/with-translator'
import { Loader } from '@/components/Loader'
// import { useDispatch } from 'react-redux'
// import { showAsyncToast } from '@/actions'

const Tiles = loadable(() =>
  import(/* webpackChunkName: "Tiles" */ '@/components/Tiles').then(({ Tiles }) => ({
    default: Tiles,
  }))
)

const getTags = (articles) => {
  const tags = new Map()

  for (let i = 0, maxI = articles.length; i < maxI; i++) {
    if (!!articles[i].tags && articles[i].tags.length > 0) {
      for (let j = 0, maxJ = articles[i].tags.length; j < maxJ; j++) {
        if (!tags.has(articles[i].tags[j].name)) {
          tags.set(articles[i].tags[j].name, 1)
        } else {
          tags.set(articles[i].tags[j].name, tags.get(articles[i].tags[j].name) + 1)
        }
      }
    }
  }

  const objs = []
  for (let key of tags) {
    objs.push({ name: key[0], counter: tags.get(key[0]) })
  }

  return objs.sort((u1, u2) => {
    const nameA = u1.name.toLowerCase(),
      nameB = u2.name.toLowerCase()

    if (nameA < nameB)
      //sort string ascending
      return -1
    if (nameA > nameB) return 1

    return 0 //default return value (no sorting)
  })
}

const LIMIT = 5
const baseURL = getApiUrl()
const api = axios.create({ baseURL })

const IndexPage = withTranslator(({ initialArtiles, initialArtilesCounter, t, currentLang }) => {
  const [isLoading, setLoading] = useState(false)
  const [isLoadingPaging, setLoadingPaging] = useState(false)
  const [articles, setArticles] = useState(initialArtiles)
  const [articlesCounter, setArticlesCounter] = useState(initialArtilesCounter)
  const [queryText, setQueryText] = useState('')
  const handleChangeText = useCallback((e) => {
    setQueryText(e.target.value)
  }, [])
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

  const debouncedQueryText = useDebounce(queryText, 1000)
  const debouncedSearchBy = useDebounce(searchBy, 500)
  const memoizedSearchBy = useMemo(() => debouncedSearchBy, [debouncedSearchBy])
  const memoizedQueryText = useMemo(() => debouncedQueryText, [debouncedQueryText])

  const [isFirstRender, setIsFirstRender] = useState(true)
  const fetchWithRestartCb = useCallback(() => {
    if (isLoading || isFirstRender || !debouncedSearchBy) return
    if (!!window) window.scrollTo({ top: 0, behavior: 'auto' })

    setStart(0)
    setLoading(true)

    Promise.all([
      fetchArticles({ queryText: debouncedQueryText, targetField: debouncedSearchBy, start: 0 }).then((results) => {
        if (Array.isArray(results)) setArticles(results)
      }),
      fetchArticlesCounter({ queryText: debouncedQueryText, targetField: debouncedSearchBy, start: 0 }).then((res) =>
        setArticlesCounter(res)
      ),
    ])
      .then(() => {
        setLoading(false)
        setIsFirstRender(false)
      })
      .catch(() => {
        setLoading(false)
        setIsFirstRender(false)
      })
  }, [debouncedQueryText, debouncedSearchBy, isLoading])
  const fetchWithRestart = useDebouncedCallback(fetchWithRestartCb, 500)

  useEffect(() => {
    fetchWithRestart()
  }, [debouncedQueryText])
  useEffect(() => {
    if (!!memoizedQueryText) fetchWithRestart()
  }, [debouncedSearchBy])
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  const handleStartForNextPage = useCallback(() => {
    if (!isLoadingPaging) setStart(start + LIMIT)
  }, [isLoading, start, setStart])
  const handleStartForPrevPage = useCallback(() => {
    if (!isLoadingPaging) setStart(start - LIMIT)
  }, [isLoading, start, setStart])

  const fetchNoRestartCb = useCallback(() => {
    if (isLoading || isLoadingPaging || isFirstRender) return
    if (!!window) window.scrollTo({ top: 0, behavior: 'auto' })

    setLoadingPaging(true)

    Promise.all([
      fetchArticles({ queryText: memoizedQueryText, targetField: memoizedSearchBy, start }).then((results) => {
        if (Array.isArray(results)) setArticles(results)
      }),
      fetchArticlesCounter({ queryText: memoizedQueryText, targetField: memoizedSearchBy, start }).then((res) =>
        setArticlesCounter(res)
      ),
    ])
      .then(() => {
        setLoadingPaging(false)
        setIsFirstRender(false)
      })
      .catch(() => {
        setLoadingPaging(false)
        setIsFirstRender(false)
      })
  }, [start, isLoading])
  const fetchNoRestart = useDebouncedCallback(fetchNoRestartCb, 500)

  useEffect(() => {
    if (!!window) window.scrollTo({ top: 0, behavior: 'auto' })
    if (isFirstRender) return

    if (!!memoizedQueryText && start !== 0) return
    fetchNoRestart()
  }, [start])

  const handleSearchToggler = useCallback(() => {
    setSearchBy(getNextSearchTarget({ current: searchBy }))
  }, [searchBy])
  const getIconByCritery = useCallback((searchBy) => {
    switch (searchBy) {
      case 'body':
        return <i className="fas fa-search"></i>
      case 'title':
        return <i className="fas fa-heading"></i>
      case 'tag':
        return <i className="fas fa-tag"></i>
      default:
        return <i className="fas fa-code"></i>
    }
  }, [])

  const handleTagClick = useCallback((name) => {
    setQueryText(name)
    setSearchBy('tag')
  }, [])
  const getSearchTextTemplate = useCallback((name) => {
    switch (name) {
      case 'body':
        return t('SEATCH_INPUT_PLACEHOLDER--BODY')
      case 'title':
        return t('SEATCH_INPUT_PLACEHOLDER--TITLE')
      case 'tag':
        return t('SEATCH_INPUT_PLACEHOLDER--TAG')
      default:
        return t('SEATCH_INPUT_PLACEHOLDER')
    }
  }, [])
  const memoizedPlaceholder = useMemo(() => getSearchTextTemplate(memoizedSearchBy), [currentLang, memoizedSearchBy])
  const memoizedSearchModeTogglerDescription = useMemo(() => t('CHANGE_SEARCH_MODE'), [currentLang, memoizedSearchBy])

  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(showAsyncToast({ type: 'info', text: 'Test', delay: 30000 }))
  //   dispatch(showAsyncToast({ type: 'success', text: 'Test', delay: 30000 }))

  //   dispatch(
  //     showAsyncToast({
  //       type: 'info',
  //       text: 'Test',
  //       delay: 30000,
  //       // eslint-disable-next-line no-console
  //       actions: [{ label: 'Test', buttonParams: { btnTypeName: 'secondaryWhite', cb: () => console.log('Test') } }],
  //     })
  //   )
  // }, [])

  return (
    <>
      <Layout>
        <div className="homepage-wrapper">
          <div className="searchPanel-wrapper">
            <div id="searchPanel">
              <span
                title={`${memoizedSearchModeTogglerDescription}${isFirstRender ? ' ' : ''}`}
                id="bodySearchToggler"
                className="unselectable"
                onClick={handleSearchToggler}
              >
                {getIconByCritery(searchBy)}
              </span>
              <input
                id="searchText"
                type="text"
                value={queryText}
                onChange={handleChangeText}
                placeholder={`${memoizedPlaceholder}${isFirstRender ? ' ' : ''}`}
                // title={memoizedPlaceholder}
                className="unselectable"
                style={{ maxWidth: queryText ? '100%' : '305px' }}
              />
              {!!queryText ? (
                <span id="clearSearchText" className="unselectable slide-down-effect" onClick={handleClearText}>
                  <i className="fas fa-times"></i>
                </span>
              ) : null}
            </div>
          </div>
          {!isLoading && !isLoadingPaging && (
            <Tiles
              isFirstRender={isFirstRender}
              articles={articles}
              articlesCounter={articlesCounter}
              currentStart={start}
              currentLimit={LIMIT}
              handleStartForNextPage={handleStartForNextPage}
              handleStartForPrevPage={handleStartForPrevPage}
              isLoading={isLoadingPaging}
            />
          )}
          {(isLoading || isLoadingPaging) && <Loader isForImage />}
          {!isLoading && !isLoadingPaging && !!articles && articles.length > 0 && (
            <div className="tags-wrapper">
              {getTags(articles).map(({ name, counter }) => (
                <button className="rippled-btn" key={name} onClick={() => handleTagClick(name)}>
                  <span>
                    <i className="fas fa-tag" style={{ marginRight: '10px' }}></i>
                    {name}
                    <span style={{ marginLeft: '10px' }}>{counter}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  )
})

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
  const { limit = LIMIT, start } = options

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
    options: { limit: LIMIT, start }, // TMP
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
async function fetchArticlesCounter({ queryText, targetField, start }) {
  const query = await _getQueryString({
    queryText: !!queryText ? encodeURIComponent(queryText) : null,
    targetField,
    options: { limit: LIMIT, start }, // TMP
  })
  if (!query) return Promise.resolve(0)

  const result = await api
    .get(`/articles/count?${query}`)
    .then((res) => res.data)
    .catch((err) => err)

  if (Number.isInteger(result)) {
    return Promise.resolve(result)
  } else {
    return Promise.reject('Ответ не является целым числом', typeof result, JSON.stringify(result))
  }
}

IndexPage.getInitialProps = async (_ctx) => {
  const articles = await fetchArticles({
    queryText: '',
    targetField: 'body',
    start: 0,
  })
  const articlesCounter = await fetchArticlesCounter({ queryText: '', targetField: 'body' })

  return {
    initialArtilesCounter: articlesCounter,
    initialArtiles: articles,
    // initialArtilesCounter: 0,
    // initialArtiles: [],
  }
}

export default IndexPage
