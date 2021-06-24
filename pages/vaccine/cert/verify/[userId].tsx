import React from 'react'
import axios from 'axios'
import { getApiUrl } from '@/utils/getApiUrl'
import { CertVerifiedPage } from '@/components/covid-trash'

// TODO: перенести в hoc по аналогии с privateRouteHOC?
// import { privateRouteHOC } from '@/helpers/services/hoc/privateRouteHOC'

const api = axios.create({ baseURL: getApiUrl() })
const isDev = process.env.NODE_ENV === 'development'

const VerifyPage = ({ userData, errorMsg }) => {
  return <>
    {isDev && !!errorMsg && (
      <pre style={{ border: '1px solid red' }}>{JSON.stringify(userData, null, 2)}</pre>
    )}
    {!!errorMsg && <div>{errorMsg}</div>}
    {
      !errorMsg && (
        <CertVerifiedPage
          userData={userData}
        />
      )
    }
  </>
}

VerifyPage.getInitialProps = async (ctx) => {
  const { query } = ctx
  const { userId } = query
  let errorMsg = null

  const fetchUserData = async (userId) => {
    if (!userId) return null

    const result = await api
      .get(`/users/${userId}`)
      .then((res) => res.data)
      .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

    // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
    if (typeof result === 'string') {
      errorMsg = result
    }
    return result
  }

  const result = await fetchUserData(userId)

  return { userData: result, errorMsg }
}

export default VerifyPage

/* NOTE: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString

SAMPLE:

{
  "userData": {
    "confirmed": true,
    "blocked": false,
    "_id": "60d4664199f5cd63bf162b86",
    "username": "pravosleva",
    "email": "pravosleva@uremont.com",
    "fullName": "Полторацкий Денис Владимирович",
    "passportSN": "4608337817",
    "dateOfBirth": "1986-04-13", // NOTE: Если создано из админки, прилетит именно в таком формате
    "provider": "local",
    "createdAt": "2021-06-24T11:02:25.838Z",
    "updatedAt": "2021-06-24T11:02:25.946Z",
    "__v": 0,
    "role": {
      "_id": "5fec5d4e3f30b25d13371012",
      "name": "Authenticated",
      "description": "Default role given to authenticated user.",
      "type": "authenticated",
      "createdAt": "2020-12-30T10:58:22.638Z",
      "updatedAt": "2020-12-30T10:58:22.638Z",
      "__v": 0,
      "id": "5fec5d4e3f30b25d13371012"
    },
    "id": "60d4664199f5cd63bf162b86"
  },
  "errorMsg": null,
  "query": {
    "userId": "60d4664199f5cd63bf162b86"
  }
}

*/