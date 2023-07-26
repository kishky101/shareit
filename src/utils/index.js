import jwt_decode from 'jwt-decode';
import { client } from "../client";


export const createOrGetUser = async (response, navigate) => {

   const decoded =  jwt_decode(response.credential);

   localStorage.setItem('user', JSON.stringify(decoded))

   const { name, picture, sub } = decoded;

   const user = {
    _id: sub,
    _type: 'user',
    userName: name,
    image: picture
   }

   client.createIfNotExists(user)
    .then(() => {
        navigate('/', {replace: true})
    })

//    await axios.post(`http://localhost:5173/api/auth`, user)
}