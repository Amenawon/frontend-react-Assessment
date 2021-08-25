import axios from 'axios';

const requestUrl = 'https://sievo-react-assignment.azurewebsites.net/api/data';

class HttpService {

  async getData() {
    try {
      const response = await axios.get(requestUrl);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

}
export default HttpService;