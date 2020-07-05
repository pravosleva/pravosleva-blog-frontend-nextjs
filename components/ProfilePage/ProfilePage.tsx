import React, { useCallback, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
// import { useSelector } from 'react-redux'
// import { IRootState } from '@/store/reducers/IRootState'
import { IUserInfo } from '@/helpers/services/IUserInfo'
import { AuthToken } from '@/helpers/services/AuthToken'
import Prism from 'prismjs'
import {
  // ModalBase,
  Modal,
} from '@/ui-kit'
import { FooterRow } from '@/ui-kit/molecules/Modal/FooterRow'
// import { ModalResult } from '@/ui-kit/molecules/Modal/ModalResult'
import { useUnscrolledBody } from '@/hooks/use-unscrolled-body'
import { Button } from '@/ui-kit/atoms/Button'
import { withTranslator } from '@/hocs/with-translator'

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
  userInfo: IUserInfo | null // WAY 1: Ged data from privateRouteHOC
  query: any
  t: Function
}

export const ProfilePage: React.FC = withTranslator((props: IProps) => {
  // WAY 2: And also you can get userInfo from Redux
  // const userInfo = useSelector((state: IRootState) => state.userInfo.fromServer)

  useEffect(() => {
    // You can call the Prism.js API here
    // Use setTimeout to push onto callback queue so it runs after the DOM is updated
    setTimeout(() => Prism.highlightAll(), 0)
  }, [])
  const [isModalActive, setIsModalActive] = useState(false)
  const { shouldBodyUnscrolled, onBlockScrollBody } = useUnscrolledBody(false)
  const hideModal = useCallback(() => {
    setIsModalActive(false)
    onBlockScrollBody(false)
  }, [])
  const openModal = useCallback(() => {
    setIsModalActive(true)
    if (!!window) {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }
    onBlockScrollBody(true)
  }, [])
  const envs = useMemo(() => {
    return [
      <span>
        <b>NODE_ENV</b>
        <br />
        <code>{process.env.NODE_ENV}</code>
      </span>,
      <span>
        <b>REACT_APP_API_ENDPOINT</b>
        <br />
        <code>{process.env.REACT_APP_API_ENDPOINT}</code>
      </span>,
      <span>
        <b>REACT_APP_SOCKET_ENDPOINT</b>
        <br />
        <code>{process.env.REACT_APP_SOCKET_ENDPOINT}</code>
      </span>,
      <span>
        <b>RECAPTCHAV3_VERIFY_URL</b>
        <br />
        <code>{process.env.RECAPTCHAV3_VERIFY_URL}</code>
      </span>,
    ]
  }, [])
  const showModal = useCallback(() => {
    openModal()
  }, [])

  return (
    <Container>
      <h2>{props.t('PROFILE')}</h2>
      <pre>
        <code className="language-json">{JSON.stringify(props.userInfo, null, 2)}</code>
      </pre>
      <button className="rippled-btn" style={{ width: 'auto', background: 'gray' }} onClick={showModal}>
        <span>
          <i className="fas fa-terminal" style={{ marginRight: '10px' }}></i>
          process.env
        </span>
      </button>
      {/* EXAMPLE 1 */}
      {/*isModalActive && (
        <ModalBase onCloseClick={hideModal} width="440px">
          <ModalResult
            isSuccess
            title="process.env"
            text={
              <div>
                <ul style={{ textAlign: 'left' }}>
                  {envs.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                <hr />
                <p>shouldBodyUnscrolled= {String(shouldBodyUnscrolled)}</p>
              </div>
            }
            buttonText="Ok"
            handleButtonClick={hideModal}
          />
        </ModalBase>
      )*/}
      {/* EXAMPLE 2 */}
      {isModalActive && (
        <Modal
          size="large"
          modalTitle="Envs"
          modalSubtitle="process.env"
          closeModal={hideModal}
          renderBodyContent={() => (
            <div>
              <ul style={{ textAlign: 'left' }}>
                {envs.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              <hr />
              <p>shouldBodyUnscrolled= {String(shouldBodyUnscrolled)}</p>
            </div>
          )}
          renderFooterContent={() => (
            <FooterRow>
              <Button typeName="blue" size="small" width="narrow" onClick={hideModal}>
                {props.t('CLOSE')}
              </Button>
            </FooterRow>
          )}
        />
      )}
    </Container>
  )
})
