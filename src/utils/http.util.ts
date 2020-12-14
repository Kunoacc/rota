interface HttpResponse<T> extends Response {
  parsedBody?: T
}

const BASE_PATH: string = `https://clava.io/api`

export async function http<T>(
  path: RequestInfo
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch( `${BASE_PATH}/${path}`,{
    credentials: 'omit',
    method: 'GET',
    cache: 'no-cache'
  });
  try {
    response.parsedBody = await response.json();
  } catch (error) {}

  if (!response.ok || response.status !== 200) {
    throw new Error(response.statusText)
  }

  return response;
}