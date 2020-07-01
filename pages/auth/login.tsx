import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import loadable from '@loadable/component'
import { IRootState } from '@/store/reducers/IRootState'
import { showAsyncToast } from '@/actions'
import { getErrorString } from '@/utils/redux-form/errors'
import { postLogin } from '@/helpers/services/restService'
import { Layout } from '@/components/layout'

// V1: TODO: Разобраться с динамическим импортом от Next.js
// import dynamic from 'next/dynamic'
// const LoginFormPage: any = dynamic(
//   () =>
//     import(/* webpackChunkName: "LoginFormPage" */ '@/components/LoginFormPage').then(
//       ({ LoginFormPage }) => ({
//         default: LoginFormPage,
//       })
//     ),
//   { loading: () => <CustomFullScreenLoader /> }
// )

// V2: loadable-components
const LoginFormPage: any = loadable(() =>
  import(/* webpackChunkName: "LoginFormPage" */ '@/components/LoginFormPage').then(({ LoginFormPage }) => ({
    default: LoginFormPage,
  }))
)

export type TLoginInputs = {
  email: string
  password: string
}

const Login: React.FC<{}> = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const email = useSelector((state: IRootState) => state.form?.login?.values?.email)
  const password = useSelector((state: IRootState) => state.form?.login?.values?.password)
  const errors = useSelector((state: IRootState) => state.form?.login?.syncErrors)
  const handleSubmit = async () => {
    const errorMsg = getErrorString(errors)
    if (!!errorMsg) {
      dispatch(
        showAsyncToast({
          text: errorMsg,
          type: 'warning',
          delay: 5000,
        })
      )
      return
    }

    await postLogin({ email, password })
      .then((username) => {
        router.push('/profile')
        dispatch(showAsyncToast({ text: `Logged as ${username}`, delay: 3000, type: 'success' }))
      })
      .catch((msg) => {
        dispatch(showAsyncToast({ text: msg, delay: 20000, type: 'error' }))
      })
  }

  return (
    <Layout>
      <LoginFormPage onSubmit={handleSubmit} submitting={false} pristine={false} />
    </Layout>
  )
}

export default Login
