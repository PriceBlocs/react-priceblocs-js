import React from 'react'
import ActionButton from '@components/ActionButton'
import { usePriceBlocsContext } from '@priceblocs/react-priceblocs-js'

const Wrapper = ({ children }) => (
  <div className="container max-w-4xl px-4 lg:px-0 mx-auto flex flex-col justify-center pb-6 sm:pb-2">
    <div className="w-1/5">{children}</div>
  </div>
)

const Loader = () => (
  <Wrapper>
    <div className="h-10 bg-gray-400 rounded w-20"></div>
  </Wrapper>
)

const Content = () => {
  const { loading, refetch, setError } = usePriceBlocsContext()

  return (
    <Wrapper>
      <ActionButton
        customClasses={{
          button:
            'flex shadow-md justify-center items-center text-center text-sm sm:text-md mt-auto text-white border-0 py-2 px-4 focus:outline-none rounded-md transition duration-150 ease-in-out font-medium disabled:opacity-50',
        }}
        onClick={() => {
          setError(null)
          refetch()
        }}
        loading={loading}
        copy={{
          value: 'Refresh',
        }}
      />
    </Wrapper>
  )
}

const PageControls = () => {
  const { loading, values } = usePriceBlocsContext()

  return loading ? <Loader /> : values ? <Content /> : null
}

export default PageControls
