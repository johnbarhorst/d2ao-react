import { createContext } from 'react';



export const User = {
  isLoggedIn: false,
  user: null,
  getUserData: async () => {
    const data = await fetch(`/api/Profile/getCurrentUser`);
    console.log(data);
  }
}

export const UserContext = createContext(User);
