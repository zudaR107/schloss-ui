import { NumberField, type NumberFieldProps } from './NumberField'
import { currencySymbol } from '../lib/currency'

export interface AmountFieldProps extends Omit<NumberFieldProps, 'prefix'> {
  /** ISO 4217 code, e.g. 'RUB'/'USD'. Defaults to 'RUB'. */
  currencyCode?: string
}

/**
 * A money-specific NumberField: the prefix is derived from the currency
 * code (not hardcoded), so it stays correct if the surrounding form lets
 * the user pick a currency other than the default.
 */
export function AmountField({ currencyCode, ...rest }: AmountFieldProps) {
  return <NumberField {...rest} prefix={currencySymbol(currencyCode ?? 'RUB')} />
}
