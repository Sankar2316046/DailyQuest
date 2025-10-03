'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/landing'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Handle menu click
  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  if (isLandingPage) {
    return (
      <div >
        <Navbar />
        {children}
      </div>
    )
  }

  return (
   
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={handleMenuClick} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
   
  )
}
// {/* <div className="flex h-screen">
// {/* Desktop sidebar - always visible */}
// <div className="hidden md:block w-64 flex-shrink-0">
//   <Sidebar isOpen={true} onClose={handleSidebarClose} />
// </div>

// {/* Mobile sidebar - overlay */}
// {sidebarOpen && (
//   <div className="md:hidden fixed inset-0 z-50">
//     <Sidebar isOpen={true} onClose={handleSidebarClose} />
//   </div>
// )}

// {/* Main content */}
// </div> */}