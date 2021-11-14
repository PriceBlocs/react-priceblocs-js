import { fetchConfig } from 'src/request'
import { getFetchConfigData } from 'src/request/data'
import {
  FetchCallProps,
  FetchConfigProps,
  FetchDataActionProps,
} from 'src/types'

export default (configProps: FetchDataActionProps) => {
  const {
    api_key,
    loading,
    setLoading,
    setValues,
    setMetadata,
    setError,
    ...fetchConfigProps
  } = configProps

  return async (props?: FetchCallProps): Promise<void> => {
    if (!loading || (props && props.force)) {
      setLoading(true)
      try {
        const configData = getFetchConfigData(
          fetchConfigProps as FetchConfigProps
        )
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
