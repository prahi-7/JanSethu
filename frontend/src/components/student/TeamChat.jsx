import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaUsers,
  FaClock,
  FaImage,
  FaVideo,
  FaFile,
  FaSpinner
} from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import socketService from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TeamChat = () => {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [teamInfo, setTeamInfo] = useState({
    name: 'Loading...',
    members: [],
    online: []
  });

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // =========================================================
  // Scroll messages to bottom
  // =========================================================
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 50);
  };

  // =========================================================
  // Load Team + Message History
  // =========================================================
  useEffect(() => {
    let isMounted = true;

    const loadTeamData = async () => {
      if (!teamId || !user) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('jwt_token');

        if (!token) {
          toast.error('Please login again');
          setError('Not authenticated');
          return;
        }

        console.log('🔍 Loading team ID:', teamId);

        // -----------------------------------------------------
        // 1. GET TEAM
        // -----------------------------------------------------
        const teamResponse = await fetch(
          `http://localhost:5000/api/student/teams/${encodeURIComponent(teamId)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(
          '📡 Team response status:',
          teamResponse.status
        );

        let teamData = null;

        try {
          teamData = await teamResponse.json();
        } catch (jsonError) {
          console.error(
            '❌ Could not parse team response:',
            jsonError
          );
        }

        console.log('📥 Team response:', teamData);

        if (!teamResponse.ok) {
          if (teamResponse.status === 404) {
            throw new Error(
              'Team not found. Please go back to Teams and open the chat from your team.'
            );
          }

          throw new Error(
            teamData?.message ||
            `Failed to load team (${teamResponse.status})`
          );
        }

        if (!teamData?.success) {
          throw new Error(
            teamData?.message || 'Failed to load team'
          );
        }

        // Backend responses may be:
        // data.team
        // data.data
        // data
        const team =
          teamData?.data?.team ||
          teamData?.data?.data ||
          teamData?.data;

        if (!team) {
          throw new Error('Team information was not returned by the server');
        }

        console.log('✅ Loaded team:', team);
        console.log('🔑 Actual team ID:', team._id);

        if (!isMounted) return;

        // -----------------------------------------------------
        // 2. CHECK TEAM MEMBERSHIP
        // -----------------------------------------------------
        const teamMembers = team.members || [];

        const currentUserId = user?._id?.toString();

        const isMember = teamMembers.some((member) => {
          const memberId =
            typeof member === 'object'
              ? member?._id
              : member;

          return (
            memberId?.toString() === currentUserId
          );
        });

        const leaderId =
          typeof team.leader === 'object'
            ? team.leader?._id
            : team.leader;

        const isLeader =
          leaderId?.toString() === currentUserId;

        console.log('👤 Current user:', currentUserId);
        console.log('👥 Team members:', teamMembers);
        console.log('👑 Is leader:', isLeader);
        console.log('✅ Is member:', isMember);

        if (!isMember && !isLeader) {
          throw new Error(
            'You are not a member of this team. Join the team before opening the chat.'
          );
        }

        setTeamInfo({
          name: team.name || 'Team Chat',
          members: teamMembers,
          online: []
        });

        // -----------------------------------------------------
        // 3. GET MESSAGE HISTORY
        // -----------------------------------------------------
        console.log(
          '📜 Loading message history for team:',
          team._id || teamId
        );

        const messagesResponse = await fetch(
          `http://localhost:5000/api/chat/history/${encodeURIComponent(
            team._id || teamId
          )}?limit=50`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(
          '📡 History response status:',
          messagesResponse.status
        );

        if (messagesResponse.status === 404) {
          if (isMounted) {
            setMessages([]);
          }
        } else if (messagesResponse.ok) {
          let messagesData = null;

          try {
            messagesData = await messagesResponse.json();
          } catch (jsonError) {
            console.error(
              '❌ Could not parse message history:',
              jsonError
            );
          }

          console.log(
            '📥 Message history:',
            messagesData
          );

          if (messagesData?.success && isMounted) {
            const history =
              messagesData?.data?.messages ||
              messagesData?.data?.data ||
              messagesData?.data ||
              [];

            setMessages(
              Array.isArray(history) ? history : []
            );
          }
        }

        if (isMounted) {
          setError(null);
        }

      } catch (error) {
        console.error(
          '❌ Load team/chat error:',
          error
        );

        if (isMounted) {
          setError(
            error.message ||
            'Failed to load chat data'
          );

          toast.error(
            error.message ||
            'Failed to load chat'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTeamData();

    return () => {
      isMounted = false;
    };
  }, [teamId, user]);

  // =========================================================
  // Socket.IO
  // IMPORTANT:
  // Socket starts ONLY after team successfully loads.
  // =========================================================
  useEffect(() => {
    if (
      !teamId ||
      !user ||
      isLoading ||
      error
    ) {
      return;
    }

    const token = localStorage.getItem('jwt_token');

    if (!token) {
      return;
    }

    console.log(
      '🔌 Connecting socket for team:',
      teamId
    );

    try {
      socketService.connect(
        token,
        user._id
      );

      socketService.joinRoom(teamId);

      console.log(
        '🔍 Socket joined room:',
        teamId
      );

      // -----------------------------------------------------
      // RECEIVE MESSAGE
      // -----------------------------------------------------
      const messageHandler = (data) => {
        console.log(
          '📨 New message received:',
          data
        );

        const incomingTeamId =
          data?.teamId?.toString();

        if (
          incomingTeamId &&
          incomingTeamId !== teamId.toString()
        ) {
          return;
        }

        const newMsg = {
          ...data,
          isOwn:
            data?.sender?._id?.toString() ===
            user?._id?.toString()
        };

        setMessages((prev) => [
          ...prev,
          newMsg
        ]);

        scrollToBottom();
      };

      socketService.on(
        'receive-message',
        messageHandler
      );

      // -----------------------------------------------------
      // MESSAGE HISTORY
      // -----------------------------------------------------
      const historyHandler = (data) => {
        console.log(
          '📜 Socket message history:',
          data
        );

        const incomingTeamId =
          data?.teamId?.toString();

        if (
          incomingTeamId &&
          incomingTeamId !== teamId.toString()
        ) {
          return;
        }

        const msgs =
          data?.messages || [];

        if (Array.isArray(msgs)) {
          setMessages(msgs);
          scrollToBottom();
        }
      };

      socketService.on(
        'message-history',
        historyHandler
      );

      // -----------------------------------------------------
      // USER JOINED
      // -----------------------------------------------------
      const userJoinedHandler = (data) => {
        console.log(
          '👤 User joined:',
          data
        );

        setOnlineUsers((prev) => [
          ...prev.filter(
            (u) =>
              u.userId !== data.userId
          ),
          data
        ]);

        if (
          data?.userId?.toString() !==
          user?._id?.toString()
        ) {
          toast.success(
            `${data?.name || 'A user'} joined the chat`
          );
        }
      };

      socketService.on(
        'user-joined',
        userJoinedHandler
      );

      // -----------------------------------------------------
      // USER LEFT
      // -----------------------------------------------------
      const userLeftHandler = (data) => {
        console.log(
          '👋 User left:',
          data
        );

        setOnlineUsers((prev) =>
          prev.filter(
            (u) =>
              u.userId !== data.userId
          )
        );

        if (
          data?.userId?.toString() !==
          user?._id?.toString()
        ) {
          toast(
            `${data?.name || 'A user'} left the chat`
          );
        }
      };

      socketService.on(
        'user-left',
        userLeftHandler
      );

      // -----------------------------------------------------
      // TYPING
      // -----------------------------------------------------
      const typingHandler = (data) => {
        if (
          data?.userId?.toString() ===
          user?._id?.toString()
        ) {
          return;
        }

        if (data?.isTyping) {
          setTypingUsers((prev) => {
            const filtered =
              prev.filter(
                (u) =>
                  u.userId !== data.userId
              );

            return [
              ...filtered,
              {
                userId: data.userId,
                name:
                  data.name || 'Someone'
              }
            ];
          });
        } else {
          setTypingUsers((prev) =>
            prev.filter(
              (u) =>
                u.userId !== data.userId
            )
          );
        }
      };

      socketService.on(
        'user-typing',
        typingHandler
      );

      // -----------------------------------------------------
      // CLEANUP
      // -----------------------------------------------------
      return () => {
        console.log(
          '🔌 Leaving socket room:',
          teamId
        );

        socketService.off(
          'receive-message'
        );

        socketService.off(
          'message-history'
        );

        socketService.off(
          'user-joined'
        );

        socketService.off(
          'user-left'
        );

        socketService.off(
          'user-typing'
        );

        try {
          socketService.leaveRoom(teamId);
        } catch (socketError) {
          console.error(
            'Socket leave error:',
            socketError
          );
        }

        if (typingTimeoutRef.current) {
          clearTimeout(
            typingTimeoutRef.current
          );
        }
      };

    } catch (socketError) {
      console.error(
        '❌ Socket setup error:',
        socketError
      );

      toast.error(
        'Chat connection could not be established'
      );
    }

  }, [
    teamId,
    user,
    isLoading,
    error
  ]);

  // =========================================================
  // Scroll whenever messages change
  // =========================================================
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      isSending ||
      !teamId
    ) {
      return;
    }

    const content =
      newMessage.trim();

    setNewMessage('');
    setIsSending(true);

    try {
      console.log(
        '📤 Sending message to team:',
        teamId
      );

      socketService.sendMessage(
        teamId,
        content
      );

      try {
        socketService.setTyping(
          teamId,
          false
        );
      } catch (typingError) {
        console.warn(
          'Typing reset failed:',
          typingError
        );
      }

      setIsTyping(false);

    } catch (error) {
      console.error(
        '❌ Send message error:',
        error
      );

      setNewMessage(content);

      toast.error(
        'Failed to send message'
      );
    } finally {
      setIsSending(false);
    }
  };

  // =========================================================
  // TYPING
  // =========================================================
  const handleTyping = (e) => {
    const value = e.target.value;

    setNewMessage(value);

    if (
      value.length > 0 &&
      !isTyping
    ) {
      setIsTyping(true);

      try {
        socketService.setTyping(
          teamId,
          true
        );
      } catch (error) {
        console.warn(
          'Typing event failed:',
          error
        );
      }

    } else if (
      value.length === 0 &&
      isTyping
    ) {
      setIsTyping(false);

      try {
        socketService.setTyping(
          teamId,
          false
        );
      } catch (error) {
        console.warn(
          'Typing event failed:',
          error
        );
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {
        setIsTyping((currentTyping) => {
          if (currentTyping) {
            try {
              socketService.setTyping(
                teamId,
                false
              );
            } catch (error) {
              console.warn(
                'Typing timeout failed:',
                error
              );
            }

            return false;
          }

          return currentTyping;
        });
      }, 2000);
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================
  const formatTime = (timestamp) => {
    if (!timestamp) {
      return '';
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="student" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#FFCABE] mx-auto mb-4" />

            <p className="text-gray-500">
              Loading chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================
  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
        <Sidebar role="student" />

        <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center max-w-md">

            <div className="text-4xl mb-4">
              🔴
            </div>

            <p className="text-red-500 text-lg mb-2">
              {error}
            </p>

            <p className="text-gray-400 text-sm mb-4">
              Please open the chat from the
              team details page.
            </p>

            <button
              onClick={() =>
                navigate('/student/teams')
              }
              className="px-4 py-2 bg-[#FFCABE] text-[#8B5E5E] rounded-xl hover:shadow-lg transition-all"
            >
              ← Back to Teams
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // CHAT UI
  // =========================================================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">

      <Sidebar role="student" />

      <div className="flex-1 p-4 md:p-8 ml-0 md:ml-64">

        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl border border-gray-100 border-b-0 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Link
                  to={`/student/teams/${teamId}`}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaArrowLeft />
                </Link>

                <div>

                  <h2 className="text-lg font-bold text-gray-700">
                    {teamInfo.name}
                  </h2>

                  <p className="text-sm text-gray-400 flex items-center gap-2">

                    <FaUsers />

                    {teamInfo.members.length}
                    {' '}
                    members

                    <span className="text-xs text-green-400">
                      • {onlineUsers.length} online
                    </span>

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaClock className="text-pink-400" />
              </div>

            </div>

          </div>

          {/* Messages */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-b-2xl h-[450px] md:h-[500px] flex flex-col">

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {messages.length === 0 ? (

                <div className="text-center text-gray-400 mt-8">

                  <p>
                    No messages yet
                  </p>

                  <p className="text-sm">
                    Start the conversation! 💬
                  </p>

                </div>

              ) : (

                messages.map((msg, index) => {

                  const senderId =
                    msg?.sender?._id?.toString();

                  const currentUserId =
                    user?._id?.toString();

                  const isOwn =
                    senderId === currentUserId;

                  return (
                    <div
                      key={
                        msg?._id ||
                        `${index}-${msg?.createdAt || ''}`
                      }
                      className={`flex ${
                        isOwn
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >

                      <div
                        className={`max-w-[75%] ${
                          isOwn
                            ? 'items-end'
                            : 'items-start'
                        } flex flex-col`}
                      >

                        {!isOwn && (
                          <p className="text-xs text-gray-500 font-medium mb-1">
                            {msg?.sender?.name ||
                              'Unknown'}
                          </p>
                        )}

                        <div
                          className={`rounded-2xl p-3 ${
                            isOwn
                              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >

                          <p className="text-sm break-words">
                            {msg?.content}
                          </p>

                        </div>

                        <p
                          className={`text-xs text-gray-400 mt-1 ${
                            isOwn
                              ? 'text-right'
                              : ''
                          }`}
                        >
                          {formatTime(
                            msg?.createdAt
                          )}
                        </p>

                      </div>

                    </div>
                  );
                })

              )}

              {typingUsers.length > 0 && (
                <div className="text-xs text-gray-400 italic">

                  {typingUsers
                    .map((u) => u.name)
                    .join(', ')}

                  {' '}
                  is typing...

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* Online Users */}
            <div className="px-4 py-2 bg-[#FFF5F2]/50 border-t border-gray-100 flex flex-wrap items-center gap-2">

              <span className="text-xs text-gray-500 font-medium">
                Online:
              </span>

              {onlineUsers.length === 0 ? (

                <span className="text-xs text-gray-400">
                  No one online
                </span>

              ) : (

                onlineUsers.map((onlineUser, idx) => (

                  <span
                    key={
                      onlineUser.userId ||
                      idx
                    }
                    className="flex items-center gap-1 text-xs text-gray-600"
                  >

                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>

                    {onlineUser.name}

                    {idx <
                      onlineUsers.length - 1 &&
                      ','}

                  </span>

                ))

              )}

            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-100 p-4 bg-white/80 rounded-b-2xl"
            >

              <div className="flex gap-2">

                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
                  onClick={() =>
                    toast.info(
                      'Image upload coming soon!'
                    )
                  }
                >
                  <FaImage />
                </button>

                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
                  onClick={() =>
                    toast.info(
                      'Video upload coming soon!'
                    )
                  }
                >
                  <FaVideo />
                </button>

                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
                  onClick={() =>
                    toast.info(
                      'File upload coming soon!'
                    )
                  }
                >
                  <FaFile />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 text-sm"
                />

                <button
                  type="submit"
                  disabled={
                    isSending ||
                    !newMessage.trim()
                  }
                  className="px-4 py-2 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >

                  {isSending ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default TeamChat;