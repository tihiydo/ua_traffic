import React from 'react'
import InfoMessage, { type InfoMessageProps } from './ui/custom/info-message'
import TranslateError from './translate-error'

type Props = {
    errorCode: string;
    children?: React.ReactNode | ((args: { error: React.ReactNode, code: string }) => React.ReactNode)
} & Omit<InfoMessageProps, 'code' | 'children'>

const ServerErrorMessage = ({ children, errorCode, variant = 'error', closable = true, ...props }: Props) => {
    return (
        <InfoMessage code={errorCode} variant={variant} closable={closable} {...props}>
            {children
                ? typeof children === 'function'
                    ? children({ error: <TranslateError errorCode={errorCode} />, code: errorCode })
                    : children
                : <TranslateError errorCode={errorCode} />
            }
        </InfoMessage>
    )
}

export default ServerErrorMessage