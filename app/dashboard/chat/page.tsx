"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  getAllChatGroups,
  getMessagesForGroup,
  sendChatMessage,
} from "@/lib/services/chats/actions";
import { TeamGroup, ChatMessage } from "@/lib/services/chats/models";
import { NewChatGroupDialog } from "@/components/chats/new-chat-group";
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
} from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [chatGroups, setChatGroups] = useState<TeamGroup[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const { toast } = useToast();

  /**
   * Load chat groups from API
   * Sets first group as selected if none is currently selected
   */
  const loadChatGroups = async () => {
    try {
      const groups = await getAllChatGroups();
      setChatGroups(groups);
      if (groups.length > 0 && !selectedChat) {
        setSelectedChat(groups[0].id);
      }
    } catch (error) {
      console.error("Failed to load chat groups:", error);
      toast({
        title: "Error",
        description: "Failed to load chat groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load chat groups on component mount
  useEffect(() => {
    loadChatGroups();
  }, [toast]);

  // Load messages when chat group changes
  useEffect(() => {
    if (selectedChat) {
      const loadMessages = async () => {
        try {
          const chatMessages = await getMessagesForGroup(selectedChat);
          setMessages(chatMessages);
        } catch (error) {
          console.error("Failed to load messages:", error);
          toast({
            title: "Error",
            description: "Failed to load messages",
            variant: "destructive",
          });
        }
      };

      loadMessages();
    }
  }, [selectedChat, toast]);

  /**
   * Handle message sending
   */
  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      setSendingMessage(true);
      try {
        const success = await sendChatMessage({
          message: message.trim(),
          team_id: selectedChat,
        });

        if (success) {
          setMessage("");
          const chatMessages = await getMessagesForGroup(selectedChat);
          setMessages(chatMessages);
        } else {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      } finally {
        setSendingMessage(false);
      }
    }
  };

  const handleFileUpload = () => {
    console.log("Opening file upload");
    // TODO: Implement file upload functionality
  };

  /**
   * Format timestamp for display
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /**
   * Generate user initials from name
   */
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Team Chat</h2>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewGroupDialog(true)}
                title="Create new chat group"
              >
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
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading chat groups...
              </div>
            ) : chatGroups.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No chat groups found
              </div>
            ) : (
              chatGroups.map((group) => (
                <Card
                  key={group.id}
                  className={`cursor-pointer transition-colors ${
                    selectedChat === group.id
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedChat(group.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{group.name}</h4>
                        {/* TODO: Add unread count when available */}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(group.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {group.description}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {group.member_count} members
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {chatGroups.find((group) => group.id === selectedChat)?.name ||
                  "Select a chat"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {chatGroups.find((group) => group.id === selectedChat)
                  ?.member_count || 0}{" "}
                members
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
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
                <br />
                <span className="text-sm">
                  Select a chat group to start messaging.
                </span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender.is_mine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex space-x-2 max-w-[70%] ${
                      msg.sender.is_mine
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(msg.sender.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`space-y-1 ${
                        msg.sender.is_mine ? "items-end" : "items-start"
                      } flex flex-col`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-medium uppercase">
                          {msg.sender.full_name}
                        </span>
                      </div>
                      <div
                        className={`px-5 py-2 rounded-full ${
                          msg.sender.is_mine
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm font-medium">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
              disabled={!selectedChat || sendingMessage}
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !selectedChat || sendingMessage}
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* New Chat Group Dialog */}
      <NewChatGroupDialog
        isOpen={showNewGroupDialog}
        onClose={() => setShowNewGroupDialog(false)}
        onSuccess={() => {
          // Refresh chat groups when a new one is created
          loadChatGroups();
        }}
      />
    </div>
  );
}
