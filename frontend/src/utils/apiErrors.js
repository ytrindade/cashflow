export function getApiErrorMessages(err, fallbackMessage) {
  const errorMessages = err?.response?.data?.errorMessages;

  if (errorMessages?.length) {
    return errorMessages;
  }

  return [fallbackMessage];
}
