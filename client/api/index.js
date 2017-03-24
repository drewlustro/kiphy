/* eslint-disable camelcase */
import axios from 'axios'

const GIPHY_API_KEY = 'dc6zaTOxFJmzC'

export const cancelTokenSource = axios.CancelToken.source()

export const giphyApi = axios.create({
  baseURL: 'http://api.giphy.com/v1',
  timeout: 2000,
  params: {
    api_key: GIPHY_API_KEY
  },
  cancelToken: cancelTokenSource.token
})

export const handleGiphyApiException = (error) => {
  if (axios.isCancel(error)) {
    console.log('GiphyApi Request cancelled.', error.message)
  } else if (error.response) {
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else {
    console.log('Axios Error: ', error.message)
  }
}
