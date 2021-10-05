import { fetchConfig } from 'src/request'
import { prepareFetchConfigData } from 'src/request/data'
import { IFetchDataActionProps } from 'src/types'

export default (props: IFetchDataActionProps) => {
  const { loading, setLoading, setValues, setMetadata, setError, api_key } =
    props

  return async () => {
    if (!loading) {
      setLoading(true)
      try {
        const configData = prepareFetchConfigData(props)
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
