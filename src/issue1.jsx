import { useQueries, useQuery } from '@tanstack/react-query'

// Issue 1: a placeholder result that is not the same reference on every render.
// Every query below never resolves, so the observer keeps showing placeholderData.

const never = () => new Promise(() => {})

class Row {
  constructor(name) {
    this.name = name
  }
}

let renderCount = 0
const toSet = (row) => new Set([row.name])
const stablePlaceholder = { label: null }
const throwingSelect = (row) => {
  if (row.label === null) throw new Error('label not ready')
  return row.label
}

function Result({ result }) {
  return <pre>{JSON.stringify({ status: result.status, isPlaceholderData: result.isPlaceholderData })}</pre>
}

function ClassInstanceUseQueries() {
  const [result] = useQueries({
    queries: [{ queryKey: ['class'], queryFn: never, placeholderData: new Row('row') }],
  })
  return <Result result={result} />
}

function ClassInstanceUseQuery() {
  const result = useQuery({ queryKey: ['class'], queryFn: never, placeholderData: new Row('row') })
  return <Result result={result} />
}

function ChangingContentUseQueries() {
  renderCount += 1
  const [result] = useQueries({
    queries: [{ queryKey: ['changing'], queryFn: never, placeholderData: { name: 'row', count: renderCount } }],
  })
  return <Result result={result} />
}

function ChangingContentUseQuery() {
  renderCount += 1
  const result = useQuery({
    queryKey: ['changing'],
    queryFn: never,
    placeholderData: { name: 'row', count: renderCount },
  })
  return <Result result={result} />
}

function SetSelectionUseQuery() {
  const result = useQuery({ queryKey: ['set'], queryFn: never, placeholderData: { name: 'row' }, select: toSet })
  return <Result result={result} />
}

function ThrowingSelectUseQuery() {
  const result = useQuery({
    queryKey: ['label'],
    queryFn: never,
    placeholderData: stablePlaceholder,
    select: throwingSelect,
  })
  return <Result result={result} />
}

export const cases = [
  {
    id: 'class-useQueries',
    title: 'useQueries: placeholderData is a class instance created on every render',
    expected: 'loops',
    Component: ClassInstanceUseQueries,
  },
  {
    id: 'class-useQuery',
    title: 'useQuery: the same placeholderData',
    expected: 'settles',
    Component: ClassInstanceUseQuery,
  },
  {
    id: 'changing-useQueries',
    title: 'useQueries: plain placeholderData whose content changes on every render',
    expected: 'loops',
    Component: ChangingContentUseQueries,
  },
  {
    id: 'changing-useQuery',
    title: 'useQuery: the same placeholderData',
    expected: 'settles',
    Component: ChangingContentUseQuery,
  },
  {
    id: 'set-useQuery',
    title: 'useQuery: equal plain placeholderData on every render, stable select returning a Set',
    expected: 'loops',
    Component: SetSelectionUseQuery,
  },
  {
    id: 'throw-useQuery',
    title: 'useQuery: stable placeholderData, stable select that throws for it',
    expected: 'loops',
    Component: ThrowingSelectUseQuery,
  },
]
