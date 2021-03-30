type Input = number | null | undefined | boolean | string
type Options = {
  decimals?: number
  fallback?: string
}

function formatNumber(
  number: Input,
  { decimals = 1, fallback = 'N/A' }: Options = {}
): string {
  const type = typeof number
  if (
    number === null ||
    number === '' ||
    ['boolean', 'undefined'].includes(type)
  ) {
    return fallback
  }

  return Number(number).toFixed(decimals)
}

export default formatNumber
