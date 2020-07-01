import React, { useCallback } from 'react'
import styled from 'styled-components'
// import { useSelector } from 'react-redux'
// import { IRootState } from '@/store/reducers/IRootState'
import { IUserInfo } from '@/helpers/services/IUserInfo'
import { AuthToken } from '@/helpers/services/AuthToken'

const Container = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
`

interface IProps {
  auth: AuthToken
  userInfo: IUserInfo | null
  query: any
}

export const ProfilePage: React.FC<IProps> = (props) => {
  // WAY 2: And also you can get userInfo from Redux
  // const userInfo = useSelector((state: IRootState) => state.userInfo.fromServer)

  const showEnvs = useCallback(() => {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
    console.log(`REACT_APP_API_ENDPOINT: ${process.env.REACT_APP_API_ENDPOINT}`)
    console.log(`REACT_APP_SOCKET_ENDPOINT: ${process.env.REACT_APP_SOCKET_ENDPOINT}`)
    console.log(`RECAPTCHAV3_VERIFY_URL: ${process.env.RECAPTCHAV3_VERIFY_URL}`)
  }, [])

  return (
    <Container>
      <h2>Profile</h2>
      <pre>{JSON.stringify(props.userInfo, null, 2)}</pre>
      <button className="rippled-btn" style={{ width: 'auto', background: 'gray' }} onClick={showEnvs}>
        <span>
          <i className="fas fa-terminal" style={{ marginRight: '10px' }}></i>
          process.env in console
        </span>
      </button>
    </Container>
  )
}
