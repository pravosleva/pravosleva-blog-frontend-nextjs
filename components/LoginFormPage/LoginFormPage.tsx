import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled, { css, StyledComponent } from 'styled-components'

interface ILoginFormPage {
  onSubmit: () => void
  handleSubmit: () => void
  pristine: boolean
  reset: () => void
  submitting: boolean
  children?: any
}

interface IBlock {
  fullRight?: boolean
  children?: any
}
const Block: StyledComponent<'div', any, IBlock, never> = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(p: IBlock) =>
    p.fullRight &&
    css`
      justify-content: flex-end;
    `}

  & > div {
  }
  & > div > input {
    max-width: 350px;
  }
  @media (max-width: 767px) {
    & > div {
      & > input {
        width: 100%;
      }
    }
  }
  & > button {
    border-radius: 0;
  }
  & > button:first-child {
    border-radius: 5px 0 0 5px;
  }
  & > button:last-child {
    border-radius: 0 5px 5px 0;
  }
`
const Container = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
    max-width: 400px;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
  & > form > ${Block}:not(:last-child) {
    margin-bottom: 20px;
  }
`

const LoginFormConnected: React.FC = (props: ILoginFormPage) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h2>In progress...</h2>
        <Block>
          <label>Email</label>
          <div>
            <Field name="email" component="input" type="email" placeholder="Email" />
          </div>
        </Block>
        <Block>
          <label>Password</label>
          <div>
            <Field name="password" component="input" type="password" placeholder="Password" />
          </div>
        </Block>
        <Block fullRight>
          <button type="submit" disabled={pristine || submitting}>
            Submit
          </button>
          {reset && (
            <button type="button" disabled={pristine || submitting} onClick={reset}>
              Clear Values
            </button>
          )}
        </Block>
      </form>
    </Container>
  )
}

export const LoginFormPage = reduxForm({
  form: 'login', // a unique identifier for this form
})(LoginFormConnected)
