import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled, { StyledComponent } from 'styled-components'
import './styles.css'

interface ILoginFormPage {
  onSubmit: () => void
  handleSubmit: () => void
  pristine: boolean
  reset: () => void
  submitting: boolean
  children?: any
}

const Container: StyledComponent<'div', any, {}, never> = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
    max-width: 400px;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
`

const LoginFormConnected: React.FC = (props: ILoginFormPage) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <Container className="box">
      <form onSubmit={handleSubmit}>
        <h2 className='gradient-animate-effect'>Login</h2>
        <div className="inputBox">
          <Field name="email" component="input" type="email" placeholder="Email" required />
          <label>Email</label>
        </div>
        <div className="inputBox">
          <Field name="password" component="input" type="password" placeholder="Password" required />
          <label>Password</label>
        </div>
        <div className="inputBox inputBox--btns">
          {reset && (
            <button className="rippled-btn" type="button" disabled={pristine || submitting} onClick={reset}>
              Clear
            </button>
          )}
          <button className="rippled-btn" type="submit" disabled={pristine || submitting}>
            Submit
          </button>
        </div>
      </form>
    </Container>
  )
}

export const LoginFormPage = reduxForm({
  form: 'login', // a unique identifier for this form
})(LoginFormConnected)
