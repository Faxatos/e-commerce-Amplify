import { useNavigate } from 'react-router-dom';
import { Auth } from "aws-amplify";

import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as FaUserCircle from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai';
import * as PiIcons from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { SidebarBuyerData } from './SidebarBuyerData';
import { SidebarSellerData } from './SidebarSellerData';
import './Navbar.css';
import { IconContext } from 'react-icons';

import { useAuthContext } from '../../contexts/AuthContext';

function Navbar(props) {
    const { username, isBuyer, isAuthenticated, updateAuthStatus } = useAuthContext();
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(true);
    const showSidebar = () => setSidebar(!sidebar);

    const handleLogout = async () => {
        try {
            await Auth.signOut()

            updateAuthStatus(false)
            navigate('/')
        } catch (err) { console.log(err) }
    }


  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={() => showSidebar()} />
          </Link>
          <div className='nav-text'>
            <Link to={(function(){
                        if(username === ""){
                          return "/login"
                        }
                        else{
                          return "/profile"
                        }
                        })()
                      } className='profile-text'>
              <FaIcons.FaUserCircle size={35}/>
              <p className='centered-items'>
                <span>
                  {(function(){
                        if(username === ""){
                          return "guest"
                        }
                        else{
                          return username
                        }
                        })()
                      }
                </span>
              </p>
            </Link>
          </div>
          
                    
          {/* eventually add here more navbar components */}
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items'>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars' onClick={() => showSidebar()}>
                <FaIcons.FaBars />
              </Link>
            </li>
            {
              (function(){
                if(isAuthenticated === false){
                  return <><li className='nav-text'>
                    <Link to="/login">
                        <AiIcons.AiOutlineLogin />
                        <span>Login</span>
                    </Link>
                </li>
                <li className='nav-text'>
                    <Link to="/register">
                        <PiIcons.PiSignInBold />
                        <span>Register</span>
                    </Link>
                </li></>;
                }
                else{ //isAuthenticated === true
                  return <li className='nav-text'>
                  <Link onClick={() => handleLogout()}>
                      <AiIcons.AiOutlineLogout />
                      <span>Logout</span>
                  </Link>
                  </li>;
                }
              })()}
            <hr className="rounded"></hr>
            {
              (function(){
                if(isAuthenticated === true && isBuyer === "true"){
                  return SidebarBuyerData.map((item, index) => {
                    return (
                    <li key={index} className={item.cName}>
                        <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                        </Link>
                    </li>
                    );
                  })
                }
                else if(isAuthenticated === true && isBuyer === "false"){
                  return SidebarSellerData.map((item, index) => {
                    return (
                    <li key={index} className={item.cName}>
                        <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                        </Link>
                    </li>
                    );
                  })
                }
              })()}

          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;