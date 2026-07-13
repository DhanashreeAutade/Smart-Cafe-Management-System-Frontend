import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: `👋 Welcome to The Daily Grind!

How can I help you?
☕ Recommend coffees
🥪 Suggest sandwiches
🧋 Find drinks under your budget
🍰 Recommend desserts`
        }
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    const sendMessage = async (text = message) => {
        if (!text.trim()) return;

        setMessages(prev => [
            ...prev,
            {
                sender: 'user',
                text
            }
        ]);

        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:6100/api/chat/createchat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: text
                    })
                }
            );

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: data.reply
                }
            ]);
        } catch (err) {
            console.error(err);

            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: '❌ Sorry, I could not connect to the assistant.'
                }
            ]);
        }

        setLoading(false);
    };

    const quickQuestions = [
        {
            label: '☕ Coffee',
            query: 'Recommend a coffee'
        },
        {
            label: '🥪 Sandwiches',
            query: 'Recommend a sandwich'
        },
        {
            label: '🧋 Cold Drinks',
            query: 'Suggest a cold drink'
        },
        {
            label: '🍰 Desserts',
            query: 'Recommend a dessert'
        }
    ];

    const [isMobile, setIsMobile] = useState(
        window.innerWidth < 500
    );

    useEffect(() => {
        const handleResize = () =>
            setIsMobile(window.innerWidth < 500);

        window.addEventListener('resize', handleResize);

        return () =>
            window.removeEventListener(
                'resize',
                handleResize
            );
    }, []);

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setOpen(!open)}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(-4px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                }}
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    border: '3px solid #C8A800',
                    background:
                        'linear-gradient(135deg,#2C1200,#4A2000)',
                    color: '#FAF6EC',
                    fontSize: 30,
                    cursor: 'pointer',
                    zIndex: 9999,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    boxShadow:
                        '0 15px 35px rgba(44,18,0,0.35), 0 0 0 8px rgba(200,168,0,0.12)',

                    transition: 'all 0.3s ease'
                }}
            >
                ☕
            </button>

            {open && (
                <>
                    {/* Overlay */}
                    <div
                        onClick={() => setOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(2px)',
                            zIndex: 9998
                        }}
                    />

                    {/* Chat Window */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'fixed',
                            bottom: isMobile ? 90 : 105,
                            right: isMobile ? 8 : 24,

                            width: isMobile
                                ? 'calc(100vw - 16px)'
                                : 400,

                            height: '600px',
                            maxHeight: 'calc(100vh - 140px)',

                            background: '#FFFFFF',
                            borderRadius: 24,
                            overflow: 'hidden',

                            zIndex: 9999,

                            border: '1px solid #E8E0D5',

                            boxShadow:
                                '0 25px 80px rgba(44,18,0,0.25)',

                            display: 'flex',
                            flexDirection: 'column',

                            animation: 'fadeIn 0.25s ease'
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background:
                                    'linear-gradient(135deg,#2C1200,#4A2000)',
                                color: '#FAF6EC',
                                padding: '18px 20px',
                                flexShrink: 0,
                                boxShadow:
                                    '0 2px 10px rgba(0,0,0,0.08)'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontFamily:
                                                "'Playfair Display', serif",
                                            fontSize: 20,
                                            fontWeight: 700
                                        }}
                                    >
                                        ☕ Daily Grind Concierge
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 12,
                                            opacity: 0.8,
                                            marginTop: 4
                                        }}
                                    >
                                        Your personal cafe guide
                                    </div>
                                </div>

                                <button
                                    onClick={() => setOpen(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#FAF6EC',
                                        fontSize: 22,
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Quick Buttons */}
                        <div
                            style={{
                                padding: 12,
                                background: '#FAF6EC',
                                borderBottom: '1px solid #E8E0D5',
                                display: 'flex',
                                gap: 8,
                                flexWrap: 'wrap',
                                flexShrink: 0
                            }}
                        >
                            {quickQuestions.map((btn) => (
                                <button
                                    key={btn.label}
                                    onClick={() => sendMessage(btn.query)}
                                    style={{
                                        border: '1px solid #E8E0D5',
                                        background: '#FFF',
                                        borderRadius: 20,
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        transition: '0.2s'
                                    }}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>


                        {/* Messages */}
                        <div
                            style={{
                                flex: 1,
                                minHeight: 0,
                                overflowY: 'auto',
                                padding: 16,
                                background: '#FAF6EC'
                            }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            msg.sender === 'user'
                                                ? 'flex-end'
                                                : 'flex-start',
                                        marginBottom: 12
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: '80%',
                                            padding: '12px 14px',
                                            lineHeight: 1.6,
                                            fontSize: 14,
                                            fontFamily: "'Inter', sans-serif",

                                            background:
                                                msg.sender === 'user'
                                                    ? '#2C1200'
                                                    : '#FFFFFF',

                                            color:
                                                msg.sender === 'user'
                                                    ? '#FAF6EC'
                                                    : '#2C1200',

                                            border:
                                                msg.sender === 'bot'
                                                    ? '1px solid #E8E0D5'
                                                    : 'none',

                                            borderRadius:
                                                msg.sender === 'user'
                                                    ? '18px 18px 4px 18px'
                                                    : '18px 18px 18px 4px'
                                        }}
                                    >
                                        {index === 0 ? (
                                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                                {msg.text}
                                            </div>
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    ul: ({ children }) => (
                                                        <ul
                                                            style={{
                                                                paddingLeft: 20,
                                                                margin: '8px 0'
                                                            }}
                                                        >
                                                            {children}
                                                        </ul>
                                                    ),

                                                    li: ({ children }) => (
                                                        <li
                                                            style={{
                                                                marginBottom: 6
                                                            }}
                                                        >
                                                            {children}
                                                        </li>
                                                    ),

                                                    p: ({ children }) => (
                                                        <p
                                                            style={{
                                                                margin: '6px 0'
                                                            }}
                                                        >
                                                            {children}
                                                        </p>
                                                    ),

                                                    strong: ({ children }) => (
                                                        <strong
                                                            style={{
                                                                color: '#A06B00'
                                                            }}
                                                        >
                                                            {children}
                                                        </strong>
                                                    )
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div>
                                    <div
                                        style={{
                                            background: '#FFF',
                                            border: '1px solid #E8E0D5',
                                            padding: 12,
                                            borderRadius: '18px 18px 18px 4px',
                                            width: 'fit-content'
                                        }}
                                    >
                                        ☕ Assistant is typing...
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer */}
                        <div
                            style={{
                                padding: 12,
                                borderTop: '1px solid #E8E0D5',
                                display: 'flex',
                                gap: 8,
                                background: '#FFFFFF',
                                flexShrink: 0
                            }}
                        >
                            <input
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === 'Enter' &&
                                        !loading
                                    ) {
                                        sendMessage();
                                    }
                                }}
                                placeholder="Ask about our menu..."
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: 12,
                                    border: '1px solid #E8E0D5',
                                    outline: 'none',
                                    fontSize: 14
                                }}
                            />

                            <button
                                onClick={() => sendMessage()}
                                disabled={loading}
                                style={{
                                    background:
                                        'linear-gradient(135deg,#2C1200,#4A2000)',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '0 18px',
                                    cursor: loading
                                        ? 'not-allowed'
                                        : 'pointer',
                                    fontWeight: 600,
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}