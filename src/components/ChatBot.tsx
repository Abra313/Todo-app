import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatBotProps {
  addTask: (task: string) => void;
  removeTask: (task: string) => void;
  tasks: string[];
}

const ChatBot: React.FC<ChatBotProps> = ({ addTask, removeTask, tasks }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Hello! How can I assist you with your to-do list today?', sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState<string>('');

  // Handle input change
  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  // Send message
  const handleSendMessage = () => {
    if (!userInput.trim()) return; // Don't send empty messages

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, sender: 'user' }
    ]);

    const lowerInput = userInput.toLowerCase();

    // Handle commands
    if (lowerInput.includes('add') && lowerInput.includes('task')) {
      const task = lowerInput.replace(/add task|add|task/i, '').trim();
      if (task) {
        addTask(task);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Task "${task}" added!`, sender: 'bot' }
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Please provide a task to add.', sender: 'bot' }
        ]);
      }
    } else if (lowerInput.includes('show tasks') || lowerInput.includes('list tasks')) {
      const taskList = tasks.length > 0 ? tasks.join('\n') : 'You have no tasks yet.';
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Here are your tasks:\n${taskList}`, sender: 'bot' }
      ]);
    } else if (lowerInput.includes('delete') && lowerInput.includes('task')) {
      const taskToRemove = lowerInput.replace(/delete task|remove task/i, '').trim();
      if (taskToRemove && tasks.includes(taskToRemove)) {
        removeTask(taskToRemove);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Task "${taskToRemove}" deleted!`, sender: 'bot' }
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Could not find that task to delete. Please try again.', sender: 'bot' }
        ]);
      }
    } else if (lowerInput.includes('set reminder')) {
      const reminderText = lowerInput.replace(/set reminder/i, '').trim();
      if (reminderText) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Reminder set for: ${reminderText}.`, sender: 'bot' }
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Please specify what you want to be reminded about.', sender: 'bot' }
        ]);
      }
    } else if (lowerInput.includes('help') || lowerInput.includes('commands')) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Here are some things I can help you with:\n- Add task [task]\n- Show tasks\n- Delete task [task]\n- Set reminder for [task]', sender: 'bot' }
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Sorry, I didn\'t understand that. Try asking "Help" for a list of commands.', sender: 'bot' }
      ]);
    }

    setUserInput(''); // Clear the input field
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 20, right: 20, width: 350, maxHeight: '400px', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}>
        <Typography variant="h6">ChatBot</Typography>
      </Box>

      <Box sx={{ padding: 2, overflowY: 'auto', flexGrow: 1, maxHeight: '300px' }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: message.sender === 'bot' ? 'row' : 'row-reverse', marginBottom: 1 }}>
            <Box
              sx={{
                maxWidth: '80%',
                backgroundColor: message.sender === 'bot' ? '#f1f1f1' : '#1976d2',
                color: message.sender === 'bot' ? '#000' : '#fff',
                padding: 1.5,
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="body2">{message.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ padding: 1, display: 'flex', alignItems: 'center' }}>
        <TextField
          value={userInput}
          onChange={handleUserInput}
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          size="small"
          sx={{ marginRight: 1 }}
        />
        <Button
          onClick={handleSendMessage}
          variant="contained"
          color="primary"
          size="large"
          sx={{ padding: '10px 15px' }}
        >
          <Send />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBot;
