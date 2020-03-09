import axios from 'axios';

/*
const fetchMe = async jwt => {
  const result = await axios(
    `${apiUrl}/users/me`,
    {
      headers: { 'Authorization': `Bearer ${jwt}` },
    }
  )
    .then(apiResponseHadler)
    .then(res => res.data)
    .catch(err => err && err.data ? err.data : err);

  if (result && result.id) {
    // window.localStorage.removeItem('logout'); // ?
    return Promise.resolve(result);
  }

  return Promise.reject(result);
}
*/

const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/strapi';
const api = axios.create({ baseURL });

export default async (req, res) => {
  const { username, password } = await req.body;

  if (!username || !password) return res.status(500).json({ message: '(!username || !password) is true!' });

  const route = '/users/me';
  let status = 500;

  try {
    const response = await api.post(route,
      null,
      {
        validateStatus: status => status >= 200 && status < 500,
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      },
    )
      .then(res => {
        status = res.status;

        return res.data;
      })
      .catch(err => err);

    if (response.jwt && res.data) {
      const { jwt } = await response;

      return res.status(200).json(res.data);
    } else {
      const error = new Error(response.status);

      error.response = response;
      throw error;
    }
  } catch (error) {
    const { response } = error;

    return response
      ? res.status(status).json({ message: response.status })
      : res.status(400).json({ message: error.message });
  }
};
