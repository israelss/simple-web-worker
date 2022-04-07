export const CLOSE_WORKER = '__CLOSE_WORKER__'
export const CREATE_OBJECT_URL_NOT_FOUND = 'This browser does not have URL.createObjectURL method.'
export const WORKER_NOT_SUPPORTED = 'This browser does not support Workers.'

export const wrongArgs = (expected, received, extraInfo) =>
  `You should provide ${expected}
${extraInfo}
Received: ${JSON.stringify(received)}`

export const wrongArgsCircular = (expected, received, extraInfo) =>
  `You should provide ${expected}
${extraInfo}
Received a circular structure: ${received}`
