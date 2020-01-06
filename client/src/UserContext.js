import { createContext } from 'react';



export const User = {
  isLoggedIn: false,
  user: null,
  getUserData: async () => {
    const data = await fetch(`/api/Profile/getCurrentUser`);
    const response = await data.json();
    console.log(response);
  }
}

export const UserContext = createContext(User);
