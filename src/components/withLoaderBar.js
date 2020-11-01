import React, { useState, useEffect } from 'react'
import { LinearProgress } from '@material-ui/core'

const _minTimeout = 700

const withLoaderBar = (WrappedComponent) => {
  const HOC = (props) => {
    const [loading, setLoadingInner] = useState(false)
    const [lastTimestamp, setLastTimestamp] = useState(new Date())
    let t = null

    useEffect(() => {
      return () => {
        if (t) {
          clearTimeout(t)
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setLoading = state => {
      const now = new Date()

      if (state) {
        setLastTimestamp(now)
      }

      const timeout = !state && (now - lastTimestamp) < _minTimeout
        ? _minTimeout : 1

      t = setTimeout(() => {
        setLoadingInner(state)
      }, timeout)
    }

    return (
      <div style={{ padding: '5px' }}>
        <div style={{ height: '5px' }}>
          {loading && <LinearProgress /> }
        </div>
        <div>
          <WrappedComponent { ...props } setLoading={setLoading} />
        </div>
      </div>
    )
  }

  return HOC
}

export default withLoaderBar
