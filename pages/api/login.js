import axios from 'axios';


const dev = process.env.NODE_ENV === 'development';
const baseURL = dev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/strapi';
const api = axios.create({ baseURL });

export default async (req, res) => {
  const { username, password } = await req.body;

  if (!username || !password) return res.status(500).json({ message: '(!username || !password) is true!' });

  const route = '/auth/local';
  let status = 500;

  try {
    const response = await api.post(route,
      { identifier: username, password },
      { validateStatus: status => status >= 200 && status < 500 },
    ) // { headers: { 'Authorization': `Bearer ${jwt}` } }
      .then(res => {
        status = res.status;

        return res.data;
      })
      .catch(err => err);

    if (response.jwt) {
      const { jwt } = await response;

      return res.status(200).json({ jwt });
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
