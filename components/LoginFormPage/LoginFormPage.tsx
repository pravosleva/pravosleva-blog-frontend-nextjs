import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

interface ILoginFormPage {
  onSubmit: () => void
  handleSubmit: () => void
  pristine: boolean
  reset: () => void
  submitting: boolean
  children?: any
}

const Container = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
`
const Block = styled('div')`
  @media (max-width: 767px) {
    width: 100%;
    border: 1px solid red;
    & > div {
      width: 100%;
      & > input {
        width: 100%;
      }
    }
  }
`

const LoginFormConnected: React.FC = (props: ILoginFormPage) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <Container>
      <form onSubmit={handleSubmit}>
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

        <Block>
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
