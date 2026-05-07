type Options = {
  decimals?: number
  fallback?: string
}

function formatNumber(
  number,
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

  const numeric = Number(number)
  if (Number.isNaN(numeric)) {
    return fallback
  }

  return numeric.toFixed(decimals)
}

export default formatNumber
