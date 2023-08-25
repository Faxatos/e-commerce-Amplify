import { useNavigate } from 'react-router-dom';
import { Auth } from "aws-amplify";

import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as PiIcons from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { SidebarBuyerData } from './SidebarBuyerData';
import { SidebarSellerData } from './SidebarSellerData';
import './Navbar.css';
import { IconContext } from 'react-icons';

function Navbar(props) {
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(true);
    const showSidebar = () => setSidebar(!sidebar);

    const handleLogout = async () => {
        try {
            await Auth.signOut()

            props.updateAuthStatus(false)
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
                if(props.isAuthenticated === false){
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
                else{ //props.isAuthenticated === true
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
                if(props.isAuthenticated === true && props.isBuyer === "true"){
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
                else if(props.isAuthenticated === true && props.isBuyer === "false"){
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