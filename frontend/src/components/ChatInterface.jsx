import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Camera, Paperclip, Send, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const groupId = 1; // Default group ID

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchGroupInfo(), fetchMessages()]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      setGroupInfo(response.data);
    } catch (error) {
      console.error('Error fetching group info:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageToSend = newMessage;
    setNewMessage(''); // Clear input immediately for better UX

    try {
      const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/messages`, {
        message: messageToSend
      });
      
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageToSend); // Restore message on error
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUserInitials = (username) => {
    return username.split(' ').map(name => name[0]).join('').toUpperCase();
  };

  const isCurrentUser = (username) => {
    return username === user?.username;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="chat-interface">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/login')}>
            <ArrowLeft size={20} />
          </button>
          <div className="group-avatar">
            <div className="avatar-circle">
              {groupInfo?.name ? getUserInitials(groupInfo.name) : 'FF'}
            </div>
          </div>
          <div className="group-info">
            <h3 className="group-name">{groupInfo?.name || 'Fun Friday Group'}</h3>
          </div>
        </div>
        <div className="header-right">
          <div className="user-menu-container">
            <button className="user-button" onClick={toggleUserMenu}>
              <User size={20} />
            </button>
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {getUserInitials(user?.username || 'U')}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user?.username}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            <div className="date-separator">
              <span className="date-text">{date}</span>
            </div>
            {dayMessages.map((message, index) => (
              <div key={message.id} className="message-wrapper">
                <div className={`message ${isCurrentUser(message.username) ? 'own-message' : 'other-message'}`}>
                  {!isCurrentUser(message.username) && (
                    <div className="avatar">
                      <div className="avatar-circle small">
                        {getUserInitials(message.username)}
                      </div>
                    </div>
                  )}
                  <div className="message-content">
                    {!isCurrentUser(message.username) && (
                      <div className="username">{message.username}</div>
                    )}
                    <div className="message-bubble">
                      <span className="message-text">{message.message}</span>
                      <div className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {isCurrentUser(message.username) && (
                          <span className="message-status">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Special messages */}
        <div className="message-wrapper">
          <div className="message other-message highlighted">
            <div className="avatar">
              <div className="avatar-circle small">
                HG
              </div>
            </div>
            <div className="message-content">
              <div className="message-bubble highlight-message">
                <span className="message-text">Hi Guysss 😊</span>
                <div className="message-meta">
                  <span className="message-time">12:31 PM</span>
                  <span className="message-status">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="message-wrapper">
          <div className="message own-message special">
            <div className="message-content">
              <div className="message-bubble own-bubble">
                <span className="message-text">Maybe I am not attending this event!</span>
                <div className="message-meta">
                  <span className="message-time">1:36 PM</span>
                  <span className="message-status">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="message-input-container">
        <div className="input-wrapper">
          <button className="attachment-button">
            <Camera size={20} />
          </button>
          <button className="attachment-button">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-input"
            disabled={sending}
          />
          <button 
            onClick={sendMessage}
            className="send-button"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <div className="spinner small"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;