import { fetchConfig } from 'src/request'
import { getFetchConfigData } from 'src/request/data'
import { IFetchDataActionProps } from 'src/types'

export default (configProps: IFetchDataActionProps) => {
  const { loading, setLoading, setValues, setMetadata, setError, api_key } =
    configProps

  return async () => {
    if (!loading) {
      setLoading(true)
      try {
        const configData = getFetchConfigData(configProps)
        const { data, ...metadata } = await fetchConfig(api_key, configData)

        setMetadata(metadata)
        setValues(data)
      } catch (err) {
        setError({ message: err.message })
      }
      setLoading(false)
    }
  }
}
