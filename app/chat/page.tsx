"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  MoreVertical,
  Users,
  Search,
  Phone,
  Video,
  Plus,
  Settings,
} from "lucide-react"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState("general")

  const chatRooms = [
    {
      id: "general",
      name: "General",
      members: 24,
      unread: 3,
      lastMessage: "Don't forget about the inspection today",
      time: "9:15 AM",
    },
    {
      id: "livestock",
      name: "Livestock Team",
      members: 8,
      unread: 0,
      lastMessage: "Health records updated",
      time: "8:45 AM",
    },
    {
      id: "crop",
      name: "Crop Farming",
      members: 12,
      unread: 1,
      lastMessage: "New guidelines uploaded",
      time: "Yesterday",
    },
    {
      id: "announcements",
      name: "Announcements",
      members: 24,
      unread: 0,
      lastMessage: "System maintenance scheduled",
      time: "2 days ago",
    },
  ]

  const messages = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "SJ",
      message: "Good morning team! Don't forget about the livestock inspection at Farm A today.",
      time: "9:15 AM",
      isOwn: false,
    },
    {
      id: 2,
      user: "You",
      avatar: "JD",
      message: "Thanks for the reminder! I'll be there by 10 AM.",
      time: "9:18 AM",
      isOwn: true,
    },
    {
      id: 3,
      user: "Mike Wilson",
      avatar: "MW",
      message: "I've uploaded the new equipment maintenance checklist to the guidelines section.",
      time: "9:22 AM",
      isOwn: false,
      attachment: "equipment_checklist.pdf",
    },
    {
      id: 4,
      user: "Emma Davis",
      avatar: "ED",
      message: "Great work on the flower farm inspection yesterday! The completion rate was 100%.",
      time: "9:45 AM",
      isOwn: false,
    },
    {
      id: 5,
      user: "You",
      avatar: "JD",
      message: "Thanks Emma! The new guidelines really helped streamline the process.",
      time: "9:47 AM",
      isOwn: true,
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
      // Here you would send the message
    }
  }

  const handleFileUpload = () => {
    console.log("Opening file upload")
    // Here you would handle file upload
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Team Chat</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {chatRooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-colors ${
                  selectedChat === room.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedChat(room.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm">{room.name}</h4>
                      {room.unread > 0 && <Badge className="bg-red-500 text-white text-xs">{room.unread}</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{room.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{room.lastMessage}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{room.members} members</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{chatRooms.find((room) => room.id === selectedChat)?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {chatRooms.find((room) => room.id === selectedChat)?.members} members
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex space-x-2 max-w-[70%] ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                  <div className={`space-y-1 ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${msg.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      {msg.attachment && (
                        <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center space-x-2">
                          <Paperclip className="h-3 w-3" />
                          <span className="text-xs">{msg.attachment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleFileUpload}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
