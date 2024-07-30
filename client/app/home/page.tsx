"use client";
import { useState, useEffect } from "react";
import ApplicationList from "../components/ApplicationList"
import ApplicationForm from "../components/ApplicationForm";
import CustomDropdown from "../components/CustomDropdown";

export default function Home() {
  const [userName, setUserName] = useState('');
  const [applications, setApplications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [waterDroplets, setWaterDroplets] = useState(0);


  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:5001/application", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        setUserName(data.userName);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    }
  };


  // this is an async function, so it has to wait to get the applications
  const fetchApplications = async (e: React.FormEvent) => {
    e.preventDefault();
    // fetch sends a request to the backend API. we are waiting to get
    // a response, then we get json data
    const response = await fetch("http://localhost:5001/application")
    const data = await response.json() 
    setApplications(data.applications)
  }

  const handleLogin = async () => {
    window.location.href = "http://localhost:5001/login";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setApplications([]);
      } else {
        console.error("Error logging out:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentApplication({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (application: any) => {
    if (isModalOpen) return
    setCurrentApplication(application)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchApplications
    location.reload()
  }


  const clickSort = async (sort: string) => {
    
    // adds parameters to the request it sends to the backend BECAUSE IT IS A GET REQ.
    const url = new URL('http://localhost:5001/application');
    url.searchParams.append('custom_sort', sort);

    // sends request to the backend relaying information
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    // updates live table
    const data = await response.json() 
    setApplications(data.applications)

    // now needs to update the database
  }



  return (
    <div className="bg-gray-100">
      <div className="flex flex-col items-center mt-3 justify-center">
            <div className="flex justify-between items-center w-full px-8">
              <a href="/">
              <button className="p-3 rounded-lg px-[13px] hover:border-white hover:bg-gray-300/50 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </button>
              
              </a>
              
              <div className="ml-12 font-rubik  text-sm text-gray-800 rounded-lg p-2 px-4 dark:bg-white/10 dark:border-white/20 dark:text-white" role="alert">
              🌱 Glad to have you, <span className="font-semibold">{userName.split(' ')[0]}</span>!
              </div>
              <div className="flex items-center">
                
                <a href="/">
                  <button
                    onClick={handleLogout}
                    className="bg-black/85 border-transparent font-rubik rounded-md my-2 py-2 px-3 ml-6 text-white flex justify-center place-content-center hover:bg-black/80 duration-300"
                  >
                    Logout
                  </button>
                </a>
              </div>
            </div>
            <div className="mt-10 mb-4 flex flex-row justify-between items-center w-[78%]">
            
              <div>
              <button
                onClick={openCreateModal}
                className="justify-start bg-green-500 hover:from-blue-500 hover:to-green-400 duration-300 font-rubik rounded-md mt-2 py-2 px-3 text-white flex  place-content-center">
                  Create New Application <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" stroke-width="2.5" stroke="currentColor" className="size-6 pl-1 pb-[2px] "><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </button>
              </div>
              <div className="justify-end flex">
              <CustomDropdown
                  label="Sort By"
                  items={[
                  { label: "Not Applied", onClick: () => clickSort("Not Applied") },
                  { label: "Offered", onClick: () => clickSort("Offered") },
                  ]}
              />
              <form className="flex items-center max-w-sm mx-auto justify-end ml-6">   
                  <label className="sr-only">Search</label>
                  <div className="relative w-full">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-gren-500" placeholder="Search applications..." required />
                  </div>
              </form>
              </div>
            </div>
      </div>
      <ApplicationList applications={applications} updateApplication={openEditModal} updateCallback={onUpdate}/>
      {isModalOpen && <div className="position: fixed z-1 left-0 top-0 w-full h-full overflow-auto">
        <div className="bg-white m-4 p-4 w-4/5">
          <span className="close" onClick={closeModal}>&times;</span>
          <ApplicationForm existingApplication={currentApplication} updateCallback={onUpdate} closeModal={closeModal}/>
        </div>
      </div>
      }
    </div>
  );
  }
  