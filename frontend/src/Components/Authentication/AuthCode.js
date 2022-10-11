import axios from "axios";

//const API_URL = "http://localhost:3000/api/auth/";

export const verifyUser = async(code) => {
     /*await axios.get(API_URL + "confirm/" + code).then((response) => {
      return response.data;
      
    });*/
 await axios.get(`/api/auth/${code}`).then((response) => {
        return response.data;
})
};