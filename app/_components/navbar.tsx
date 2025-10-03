'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { UserRoundCheckIcon, Home, Calendar, FolderOpen, Menu, LogOut, ChevronDown } from 'lucide-react'
import { AuthService } from '../backend/services/auth.service'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface NavbarProps {
  onMenuClick?: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const auth = new AuthService()
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchName = async () => {
      try {
        const userName = await auth.getusername()
        if (userName) {
          setName(userName)
        } else {
          setName('Guest')
        }
      } catch (error) {
        console.error('Error fetching name:', error)
        setName('Guest')
      } finally {
        setLoading(false)
      }
    }

    fetchName()
  }, [auth])

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await auth.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 border-b shadow-sm bg-white dark:bg-black">
      {/* Left - Menu button and Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight text-primary dark:text-primary-foreground">
          DailyQuest
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.png" alt="Avatar" />
              <AvatarFallback className="flex items-center justify-center">
                <UserRoundCheckIcon/>
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground truncate max-w-24">
              {loading ? 'Loading...' : name}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="flex flex-col gap-1">
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b">
              {loading ? 'Loading...' : name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  )
}
