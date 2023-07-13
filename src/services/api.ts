import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://uyirk4dymb.execute-api.us-east-1.amazonaws.com/v1'
});
