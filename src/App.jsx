import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Component, useState } from 'react'

import { cases } from './issue1'
import { runIssue2 } from './issue2'

class Boundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) return <p data-testid="error">Error: {this.state.error.message}</p>
    return this.props.children
  }
}

function CaseHost({ Case }) {
  const [client] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={client}>
      <Case />
    </QueryClientProvider>
  )
}

function Issue1() {
  const [selected, setSelected] = useState(cases[0].id)
  const [rerenders, setRerenders] = useState(0)
  const current = cases.find((item) => item.id === selected)
  return (
    <section>
      <h2>Issue 1: render loop</h2>
      <p>Pick a case, then click "re-render" once. Expected on v5.105.2 and later: {current.expected}.</p>
      {cases.map((item) => (
        <label key={item.id} style={{ display: 'block' }}>
          <input
            type="radio"
            name="case"
            data-testid={item.id}
            checked={item.id === selected}
            onChange={() => setSelected(item.id)}
          />{' '}
          {item.title} ({item.expected})
        </label>
      ))}
      <button type="button" data-testid="rerender" onClick={() => setRerenders(rerenders + 1)}>
        re-render ({rerenders})
      </button>
      <Boundary key={selected}>
        <CaseHost Case={current.Component} />
      </Boundary>
    </section>
  )
}

function Issue2() {
  const [output, setOutput] = useState(null)
  return (
    <section>
      <h2>Issue 2: selection of reset data</h2>
      <button type="button" data-testid="run-issue-2" onClick={() => runIssue2().then(setOutput)}>
        run
      </button>
      {output && <pre data-testid="issue-2">{JSON.stringify(output, null, 2)}</pre>}
    </section>
  )
}

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <Issue1 />
      <Issue2 />
    </main>
  )
}
