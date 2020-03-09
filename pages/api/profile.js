import axios from 'axios';


const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev
  ? 'http://localhost:1337'
  : 'http://80.87.194.181/strapi';
const api = axios.create({ baseURL });

export default async (req, res) => {
  if (!('authorization' in req.headers))
    return res.status(401).send('Authorization header missing');

  const auth = await req.headers.authorization;
  const route = '/users/me';
  let status = 500;

  try {
    const response = await api.get(route,
      { headers: { 'Authorization': auth } },
      // { validateStatus: status => status >= 200 && status < 500 },
    )
      .then(res => {
        status = res.status;

        return res.data;
      })
      .catch(err => err);

    if (response.id) {
      // OK: User received!
      return res.status(200).json({ ...response });
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
