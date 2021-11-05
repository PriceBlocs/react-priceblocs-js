import { fetchConfig } from 'src/request'
import { getFetchConfigData } from 'src/request/data'
import { FetchCallProps, FetchDataActionProps } from 'src/types'

export default (configProps: FetchDataActionProps) => {
  const { loading, setLoading, setValues, setMetadata, setError, api_key } =
    configProps

  return async (props?: FetchCallProps): Promise<void> => {
    if (!loading || (props && props.force)) {
      setLoading(true)
      try {
        const configData = getFetchConfigData(configProps)
        const response = await fetchConfig(api_key, configData)
        if ('data' in response) {
          const { data, ...metadata } = response
          setValues(data)
          setMetadata(metadata)
        }
      } catch (err) {
        setError(err)
      }
      setLoading(false)
    }
  }
}
