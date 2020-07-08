import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import io from 'socket.io-client'
import { usersActions } from '@/store/reducers/users'
import { getSocketApiUrl, getApiUrl } from '@/utils/getApiUrl'
import { showAsyncToast } from '@/actions'
import { useRouter } from 'next/router'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { withTranslator } from './with-translator'
import axios from 'axios'
// import { axiosUniversalCatch } from '@/utils/errors/axiosUniversalCatch'

const socketApiUrl = getSocketApiUrl()
const getUsersArr = (users) =>
  Object.keys(users).map((key, i, a) => ({ socketId: key, ip: users[key].ip, geo: users[key].geo }))
const baseURL = getApiUrl()
const api = axios.create({ baseURL })

export const withSocketApi = (WrappedComponent) => {
  const Wrapper = withTranslator((props) => {
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
      if (process.browser) {
        const client = io.connect(socketApiUrl)

        client.on('HELLO', (payload) => {
          const { users } = payload

          if (!!users) dispatch(usersActions.set(getUsersArr(users)))
        })
        client.on('ARTICLE_UPDATED', async (payload) => {
          const isCorrect = !!payload?.id
          const article = await api
            .get(`/articles/${payload.id}`)
            .then((res) => res.data)
            .catch((_err) => null)
          const targetPath = `/article/${article.slug}`

          if (isCorrect) {
            if (!!article) {
              if (isCurrentPath(router.asPath, targetPath)) {
                dispatch(
                  showAsyncToast({
                    text: `${props.t('UPDATED')}: ${article?.title || payload.id}`,
                    delay: 30000,
                    type: 'info',
                    isClosable: true,
                    actions: [
                      {
                        label: props.t('RELOAD_CURRENT_PAGE'),
                        linkParams: {
                          asButton: true,
                          btnTypeName: 'orange',
                          path: targetPath,
                          isInternalLink: false,
                        },
                      },
                    ],
                  })
                )
              } else {
                dispatch(
                  showAsyncToast({
                    text: `${props.t('UPDATED')}: ${article?.title || payload.id}`,
                    delay: 30000,
                    type: 'info',
                    isClosable: true,
                    actions: [
                      {
                        label: props.t('MOVE_TO'),
                        linkParams: {
                          asButton: true,
                          btnTypeName: 'blue',
                          path: targetPath,
                          isInternalLink: true,
                        },
                      },
                    ],
                  })
                )
              }
            } else {
              dispatch(
                showAsyncToast({
                  text: `EVENT ERR: ${props.t('SOMETHING_WRONG')}`,
                  delay: 10000,
                  type: 'warn',
                })
              )
            }
            return
          }

          dispatch(showAsyncToast({ text: `${props.t('UPDATED')}: ${payload.id}`, delay: 7000, type: 'info' }))
        })
        client.on('ARTICLE_CREATED', async (payload) => {
          const isCorrect = !!payload?.id
          const article = await api
            .get(`/articles/${payload.id}`)
            .then((res) => res.data)
            .catch((_err) => null)
          const targetPath = `/article/${article.slug}`

          if (isCorrect) {
            if (!!article) {
              if (isCurrentPath(router.asPath, targetPath)) {
                dispatch(
                  showAsyncToast({
                    text: `${props.t('CREATED')}: ${article?.title || payload.id}`,
                    delay: 30000,
                    type: 'info',
                    isClosable: true,
                    actions: [
                      {
                        label: props.t('RELOAD_CURRENT_PAGE'),
                        linkParams: {
                          asButton: true,
                          btnTypeName: 'orange',
                          path: targetPath,
                          isInternalLink: false,
                        },
                      },
                    ],
                  })
                )
              } else {
                dispatch(
                  showAsyncToast({
                    text: `${props.t('CREATED')}: ${article?.title || payload.id}`,
                    delay: 30000,
                    type: 'info',
                    isClosable: true,
                    actions: [
                      {
                        label: props.t('MOVE_TO'),
                        linkParams: {
                          asButton: true,
                          btnTypeName: 'blue',
                          path: targetPath,
                          isInternalLink: true,
                        },
                      },
                    ],
                  })
                )
              }
            } else {
              dispatch(
                showAsyncToast({
                  text: `EVENT ERR: ${props.t('SOMETHING_WRONG')}`,
                  delay: 10000,
                  type: 'warn',
                })
              )
            }
            return
          }

          dispatch(showAsyncToast({ text: `${props.t('UPDATED')}: ${payload.id}`, delay: 7000, type: 'info' }))
        })
        client.on('SOMEBODY_CONNECTED', (payload) => {
          const { users } = payload

          if (!!users) dispatch(usersActions.set(getUsersArr(users)))
        })
        client.on('SOMEBODY_RECONNECTED', (payload) => {
          const { users } = payload

          if (!!users) dispatch(usersActions.set(getUsersArr(users)))
        })
        client.on('SOMEBODY_DISCONNECTED', (payload) => {
          const { users } = payload

          if (!!users) dispatch(usersActions.set(getUsersArr(users)))
        })
        /*
        client.on('ORDER_UPDATED', payload => {
          console.log(payload);
          if (!payload.id) return;

          // console.log(myOrdersList);

          // const id = props.cookies.get('userId');
          const jwt = props.cookies.get('jwt');

          // Step 1: Need to requset for the order if necessary...
          const isThisCurrentArticle = [...myOrdersList].some(o => o.id == payload.id); // eslint-disable-line
          // NOTE: Нестрогое равенство из-за багов Strapi@beta

          if (isThisCurrentArticle) {
            // Step 2: For current user case.

            // Step 2.1: GET /orders/:id
            getTheOrder({ jwt, id: payload.id })
              .then(res => {
                // Step 2.2: Result received. Then we have to update it in redux store...
                // TODO: Преобразовать объект?

                dispatch(myOrdersActions.update({ ...res }));
              })
              .catch(err => {
                console.log('Result crashed.');
                console.log(err);
              });
          } else {
            console.log('socket emit ORDER_UPDATED ignored: Not my Order updated.');
          }
        });
        */

        return () => {
          client.disconnect()
          client.removeAllListeners()
        }
      }
    }, [process.browser])

    return <WrappedComponent {...props} />
  })

  return Wrapper
}
