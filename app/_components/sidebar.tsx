'use client'

import { Button } from '@/components/ui/button'
import { Home, Calendar, FolderOpen, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const handleNavigation = (path: string) => {
    router.push(path)
    if (onClose) onClose()
  }

  return (
    <div className="h-full w-64 bg-white dark:bg-black border-r shadow-sm">
      <div className="flex flex-col p-4 gap-2">
        {/* Mobile close button */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <div className="text-2xl font-bold tracking-tight text-primary dark:text-primary-foreground">
            DailyQuest
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop title */}
        <div className="hidden md:block text-2xl font-bold tracking-tight text-primary dark:text-primary-foreground mb-8">
          DailyQuest
        </div>

        <Button
          variant={isActive('/') ? "default" : "ghost"}
          size="sm"
          onClick={() => handleNavigation('/')}
          className="justify-start gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>

        <Button
          variant={isActive('/calendar') ? "default" : "ghost"}
          size="sm"
          onClick={() => handleNavigation('/calendar')}
          className="justify-start gap-2"
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </Button>

        <Button
          variant={isActive('/categories') ? "default" : "ghost"}
          size="sm"
          onClick={() => handleNavigation('/categories')}
          className="justify-start gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          Categories
        </Button>
      </div>
    </div>
  )
}
