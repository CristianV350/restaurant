import axios from 'axios'

class ClientAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:3000/api';
  }

  public async get(endpoint: string) {
    try {
      const response = await axios.get(`${this.baseURL}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async post(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${this.baseURL}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ClientAPI();