import { fetchConfig } from 'src/request'
import { getFetchConfigData } from 'src/request/data'
import { FetchDataActionProps } from 'src/types'

export default (configProps: FetchDataActionProps) => {
  const { loading, setLoading, setValues, setMetadata, setError, api_key } =
    configProps

  return async () => {
    if (!loading) {
      setLoading(true)
      try {
        const configData = getFetchConfigData(configProps)
        const response = await fetchConfig(api_key, configData)
        if ('data' in response) {
          const { data, ...metadata } = response
          setValues(response.data)
          setMetadata(metadata)
        }
      } catch (err) {
        setError(err)
      }
      setLoading(false)
    }
  }
}
