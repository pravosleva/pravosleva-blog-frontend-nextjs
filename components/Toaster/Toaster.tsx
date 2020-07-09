import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TToast, IToast, forceHideToast } from '@/actions'
import cn from 'classnames'
import '@/css/toaster.css'
import { Button, NextLinkButton, ExternalLinkButton } from '@/ui-kit/atoms'
import Link from 'next/link'
// import { withTranslator } from '@/hocs/with-translator'
import { CloseButton } from '@/ui-kit/atoms/CloseButton'
// import { getThemeColor } from '@/ui-kit'

type FontAwesomeClassNamesAsMsgType = 'fa-ban' | 'fa-exclamation-triangle' | 'fa-info-circle'

const getFontAwesomeClassNameByType = (type: TToast): FontAwesomeClassNamesAsMsgType => {
  switch (type) {
    case 'error':
      return 'fa-ban'
    case 'warning':
      return 'fa-exclamation-triangle'
    case 'info':
      return 'fa-info-circle'
    case 'default':
    default:
      return 'fa-info-circle'
  }
}
export const Toaster: React.FC = () => {
  const items: IToast[] = useSelector((state: any) => state.toaster.items)
  const dispatch = useDispatch()
  const handleRemove = (id: number): void => {
    dispatch(forceHideToast(id))
  }

  return (
    <div className="toast-container">
      {items.map(({ status, type, id, text, actions, isClosable }: IToast) => (
        <div
          key={id}
          className={cn(
            'toast-container__toast-item-root',
            `toast-container__toast-item-root__${status}`,
            `toast-container__toast-item-root__${status}--${type}`
          )}
          onClick={!!actions ? null : handleRemove.bind(null, id)}
          style={{ cursor: !!actions ? 'auto' : 'pointer' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="messageWrapper">
              <div>
                <i className={cn('fas', getFontAwesomeClassNameByType(type))}></i>
              </div>
              <div>{text}</div>
              {isClosable && <CloseButton size={20} color="White color" onClick={handleRemove.bind(null, id)} />}
            </div>
            <div className="buttonsWrapper">
              {!!actions &&
                Array.isArray(actions) &&
                actions.length > 0 &&
                actions.map(({ label, linkParams, buttonParams }, i) => (
                  <React.Fragment key={i}>
                    {!!linkParams ? (
                      linkParams.asButton ? (
                        linkParams.isInternalLink ? (
                          <NextLinkButton
                            href={linkParams.path}
                            name={label}
                            onClick={handleRemove.bind(null, id)}
                            typeName={linkParams.btnTypeName || 'blue'}
                            width="responsive"
                            size="xsmall"
                          />
                        ) : (
                          <ExternalLinkButton
                            href={linkParams.path}
                            name={label}
                            onClick={handleRemove.bind(null, id)}
                            typeName={linkParams.btnTypeName || 'blue'}
                            width="responsive"
                            size="xsmall"
                          />
                        )
                      ) : (
                        <Link href={linkParams.path} />
                      )
                    ) : null}
                    {!!buttonParams && (
                      <Button
                        typeName={buttonParams.btnTypeName || 'blue'}
                        width="responsive"
                        size="xsmall"
                        onClick={() => {
                          buttonParams.cb()
                          handleRemove(id)
                        }}
                      >
                        {label}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
