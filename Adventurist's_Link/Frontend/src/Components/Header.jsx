import { Button, Navbar, TextInput } from 'flowbite-react';
import React from 'react'
import { Link , useLocation } from 'react-router-dom';
import {AiOutlineSearch , AiOutlineUser} from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa'

const Header = () => {
    const path = useLocation().pathname;
    return (
      <Navbar className='border-b-2' >
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-blue-700 to-red-400 rounded-lg text-white'> Adventurist's</span>
            Link
        </Link>
          <form >
            <TextInput 
               type='text' 
               placeholder='Search..'  
               rightIcon={AiOutlineSearch} 
               className='hidden lg:inline'   
            />
          </form>
          <Button className='w-12 h-9 lg:hidden' color='gray-700' pill >
            <AiOutlineSearch />
          </Button>
          <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' style={{backgroundColor: '#d3d3d3'}} pill>
                 <FaMoon/>
            </Button>
            <Link to='/signin'>
              <Button gradientDuoTone='purpleToblue'  style={{backgroundImage: 'linear-gradient(to right, #8e2de2, #00bfff)'}}> 
               <AiOutlineUser />
                Sign In
              </Button>
            </Link>
             <Navbar.Toggle/>
          </div>
          <Navbar.Collapse className='flex'>
                <Navbar.Link active={path === "/"} as={'div'} >
                    <Link to="/">
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link  active={path ==="/about"} as={'div'}>
                    <Link to="/about">
                        About
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
      </Navbar>  
    );
  };

export default Header;