import { QueryClient, QueryObserver } from '@tanstack/react-query'

// Issue 2: after resetQueries, a select that throws for placeholderData brings back the selection of the reset data.
// Plain QueryObserver, no React, so the render loop of issue 1 does not hide it.

const placeholder = { label: null }
const label = (row) => {
  if (row.label === null) throw new Error('label not ready')
  return row.label
}

function snapshot(observer) {
  const result = observer.getCurrentResult()
  return {
    status: result.status,
    data: result.data,
    isPlaceholderData: result.isPlaceholderData,
    error: result.error ? String(result.error) : null,
  }
}

export async function runIssue2() {
  const client = new QueryClient()
  client.setQueryData(['label'], { label: 'first' })
  const observer = new QueryObserver(client, {
    queryKey: ['label'],
    queryFn: () => new Promise(() => {}),
    enabled: false,
    placeholderData: placeholder,
    select: label,
  })
  const unsubscribe = observer.subscribe(() => {})
  const before = snapshot(observer)
  await client.resetQueries({ queryKey: ['label'] })
  const after = snapshot(observer)
  const cache = client.getQueryData(['label']) ?? null
  unsubscribe()
  return { before, after, cacheAfterReset: cache }
}
