'use client'

import React from 'react'
import Translate from './Translate'
import { type TranslationValues } from 'next-intl'
import { ERROR_CODES } from '@/constants/error-codes'

type Props = {
    errorCode?: string
    args?: TranslationValues
    showUnknownContents?: boolean;
}

const TranslateError = ({ errorCode, args, showUnknownContents }: Props) => {
    const isEnumerated = Object.values(ERROR_CODES).includes(errorCode ?? '')

    if (showUnknownContents && !isEnumerated) {
        return errorCode;
    }

    if (!errorCode || !isEnumerated) {
        return <Translate namespace='Validation' itemKey='unknown' />
    }

    return <Translate namespace='Validation' itemKey={errorCode} values={args} />
}

export default TranslateError