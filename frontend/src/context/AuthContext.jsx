import { createContext , useContext ,useState } from "react";

export const AuthContext = createContext();

export  const useAuth =()=>{
    return useContext(AuthContext)
}

export const AuthContextProvider =({children})=>{
    const getInitialAuthUser = () => {
        try {
            const stored = localStorage.getItem('chatapp');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error parsing auth user from localStorage:', error);
            return null;
        }
    };
    const [authUser , setAuthUser] = useState(getInitialAuthUser());

    return <AuthContext.Provider value={{authUser ,setAuthUser}}>
        {children}
    </AuthContext.Provider>
}