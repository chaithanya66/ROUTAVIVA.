export async function post(url, body = {}, headers = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    console.log("Post performed bro")
    return await handleResponse(response);
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
}


export async function sampleFunction() {
  console.log("This is a function")
}

async function handleResponse(response) {
if (!response.ok) {
const errorMessage = await response.text();
//   throw new Error(HTTP error! status: ${response.status}, message: ${errorMessage});
}
return response.json();
}