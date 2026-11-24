// Turns an axios error into a message a user can read
export function getErrorMessage(err) {
  if (err.response) {
    if (err.response.status === 429) {
      return 'Too many attempts. Please wait a minute and try again.'
    }
    const message = err.response.data?.message
    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string') return message
    return 'Something went wrong. Please try again.'
  }
  return 'Could not reach the server. Make sure the API is running.'
}