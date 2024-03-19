import { Button, Label, TextInput , Checkbox} from 'flowbite-react';
import React , {useState} from 'react'
import { Link  , useNavigate} from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai';


const SignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
      <div className='min-h-screen mt-20'> 
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-7'>
            {/*left side for Logo and theme*/}
            <div className='flex-1'>
                <Link to='/' className='font-bold dark:text-white text-4xl'>
                  <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-blue-700 to-red-400 rounded-lg text-white'>
                     Adventurist's
                  </span>
                  Link
                </Link>
                <p className='text-sm mt-5'>
                    I need to find a nice Logo and paragraph about voyage !! to DOOO don't forget
                </p>
            </div>
        {/*right side side for registering*/}
            <div className='flex-1 bg-gray-100 p-8 rounded-lg'>
               <form className='flex flex-col gap-4'>
                <div>
                    <Label value='Your First Name'/>
                    <TextInput type='text' placeholder='FirstName' id='firstName' className='placeholder-green-300 rounded'/>  
                </div>
                <div>
                    <Label value='Your Last Name'/>
                    <TextInput type='text' placeholder='LastName' id='lastName' className='placeholder-green-300 rounded'/>  
                </div>
                <div>
                    <Label value='Your email address'/>
                    <TextInput type='text' placeholder='Email' id='email' className='placeholder-green-300 rounded' />  
                </div>
                <div>
                    <Label value='Your password'/>
                    <TextInput type={passwordVisible ? 'text' : 'password'} placeholder='*******' id='password' className='placeholder-green-300 rounded' eye onClick={() => setPasswordVisible(!passwordVisible)}/>  
                </div>
                <div>
                    <Label value='Please Confirm your Password'/>
                    <TextInput type={passwordVisible ? 'text' : 'password'} placeholder='Confirm Password' id='confirmPassword' className='placeholder-green-300 rounded' eye onClick={() => setPasswordVisible(!passwordVisible)}/>  
                </div>
                <div className="flex items-center gap-2">
              <Checkbox id="isAdmin" onChange={() => setIsAdmin(!isAdmin)} />
              <Label htmlFor="isAdmin">Sign Up as an Admin</Label>
            </div>          
              <div>
                <Label value="Admin Secret Key" />
                <TextInput
                  type="password"
                  placeholder="Enter admin secret key"
                  id="adminSecret"
                  className="placeholder-green-300rounded"
                  //value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                />
              </div>
                 <Button gradientDuoTone='purpleToPink' type='submit'>
                     Sign Up
                 </Button>
               </form>
               <div className='flex gap-2 text-sm mt-6'>
                <span>Have an account already ?</span>
                 <Link to='/signin' className='text-blue-700'>
                   Sign In
                 </Link>
               </div>
            </div>
        </div>
      </div>
    );
  };

export default SignUp ;