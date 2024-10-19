import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, UserIcon, MailIcon } from 'lucide-react';

const LoginScreen = ({ onLogin, theme }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ phoneNumber, name, email });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'
      }`}
    >
      <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Sign in to RestoChat
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phone-number" className="sr-only">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border ${
                    theme === 'light'
                      ? 'border-gray-300 placeholder-gray-500 text-gray-900'
                      : 'border-gray-700 placeholder-gray-400 text-white bg-gray-700'
                  } rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="sr-only">Name (optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border ${
                    theme === 'light'
                      ? 'border-gray-300 placeholder-gray-500 text-gray-900'
                      : 'border-gray-700 placeholder-gray-400 text-white bg-gray-700'
                  } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email (optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border ${
                    theme === 'light'
                      ? 'border-gray-300 placeholder-gray-500 text-gray-900'
                      : 'border-gray-700 placeholder-gray-400 text-white bg-gray-700'
                  } rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Sign in
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginScreen;