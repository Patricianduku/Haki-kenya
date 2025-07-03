import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useNotifications } from '@/hooks/useNotifications'
import { Bell, Check, Trash2, FileQuestion, Calendar, Shield, Star } from 'lucide-react'
import { format } from 'date-fns'

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const [open, setOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'question': return <FileQuestion className="w-4 h-4" />
      case 'consultation': return <Calendar className="w-4 h-4" />
      case 'report': return <Shield className="w-4 h-4" />
      case 'review': return <Star className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-blue-600'
      case 'consultation': return 'text-green-600'
      case 'report': return 'text-red-600'
      case 'review': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {notifications.length > 0 && (
                <div className="flex space-x-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNotifications}
                    className="text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <CardDescription>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <ScrollArea className="h-80">
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}