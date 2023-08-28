import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Input,
  Button,
  Textarea,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListIcon,
  Editable,
  EditableInput,
  EditablePreview,
  Text,
} from '@chakra-ui/react';
import { CheckCircleIcon, DeleteIcon, EditIcon, CheckIcon } from '@chakra-ui/icons';
import axios from 'axios';

const API_BASE_URL = 'https://todolist-backend-sxj6.onrender.com';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', completed: false });
  const [editTaskId, setEditTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', completed: false });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEdit = (taskId) => {
    setEditTaskId(taskId);
  };

  const endEdit = () => {
    setEditTaskId(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <ChakraProvider>
      <Container maxW="lg" mt={8}>
        <Heading mb={4}>Todo List</Heading>
        <Box>
          <Input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Textarea
            placeholder="Task description"
            mt={2}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <Button mt={2} colorScheme="blue" onClick={createTask}>
            Add Task
          </Button>
        </Box>
        <List mt={4}>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <Checkbox
                isChecked={task.completed}
                onChange={() => updateTask(task.id, { ...task, completed: !task.completed })}
                colorScheme={task.completed ? 'green' : 'gray'}
              >
                {task.completed ? 'Completed' : 'Not Completed'}
              </Checkbox>
              {editTaskId === task.id ? (
                <Editable
                  defaultValue={task.title}
                  onChange={(newTitle) => updateTask(task.id, { ...task, title: newTitle })}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              ) : (
                <Text>{task.title}</Text>
              )}
              <Text>{task.description}</Text>
              {editTaskId === task.id ? (
                <IconButton
                  icon={<CheckIcon />}
                  size="xs"
                  aria-label="Confirm Edit"
                  ml={2}
                  onClick={endEdit}
                />
              ) : (
                <IconButton
                  icon={<EditIcon />}
                  size="xs"
                  aria-label="Edit Task"
                  ml={2}
                  onClick={() => startEdit(task.id)}
                />
              )}
              <IconButton
                icon={<DeleteIcon />}
                size="xs"
                aria-label="Delete Task"
                ml={2}
                onClick={() => deleteTask(task.id)}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </ChakraProvider>
  );
}

export default App;
