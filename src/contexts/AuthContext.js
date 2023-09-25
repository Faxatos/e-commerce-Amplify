import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { Auth } from 'aws-amplify'

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [isBuyer, setIsBuyer] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [balance, setBalance] = useState(0);

    function updateAuthStatus(authStatus) {
        setIsAuthenticated(authStatus)

        if(authStatus === true){
            getUserInfo();
        }
        else{ //logout branch - reset current user fields
            setAccessToken('');
            setUsername('');
            setIsBuyer('');
            setFullname('');
            setAddress('');
            setDescription('');
            setEmail('');
            setBalance(0);
        }
    }

    async function getUserInfo() {
        await Auth.currentAuthenticatedUser()
        .then((user) => {
            setAccessToken(user.signInUserSession.accessToken.jwtToken);
            setUsername(user.username);
            setIsBuyer(user.attributes['custom:isBuyer']);
            setFullname(user.attributes['name']);
            setAddress(user.attributes['address']);
            setDescription(user.attributes['custom:description']);
            setEmail(user.attributes['email']);
            setBalance(user.attributes['custom:balance']);
        })
        .catch(error => console.log(`Error: ${error.message}`));
    }

    return (

        <AuthContext.Provider
            value={{isAuthenticated, username, isBuyer, email, fullname, address, description, accessToken, balance, updateAuthStatus, setBalance
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)