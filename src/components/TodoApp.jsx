import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { useFetch } from '../hooks/useFetch';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get, post, put, delete: deleteTodo } = useFetch();

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await get('/todos');
      setTodos(data || []);
    } catch (error) {
      console.error('Error loading todos:', error);
      setError('Failed to load todos. Please try again.');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text, dueDate = null) => {
    try {
      setError(null);
      const newTodo = {
        text,
        completed: false,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };
      
      const savedTodo = await post('/todos', newTodo);
      setTodos(prevTodos => [...prevTodos, savedTodo]);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  const toggleTodo = async (id) => {
    try {
      setError(null);
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      const savedTodo = await put(`/todos/${id}`, updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t => t.id === id ? savedTodo : t)
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  const updateTodo = async (id, text, dueDate = null) => {
    try {
      setError(null);
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        text,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      const savedTodo = await put(`/todos/${id}`, updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t => t.id === id ? savedTodo : t)
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  const deleteTodoItem = async (id) => {
    try {
      setError(null);
      await deleteTodo(`/todos/${id}`);
      setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const clearCompleted = async () => {
    try {
      setError(null);
      await deleteTodo('/todos/clear-completed');
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      console.error('Error clearing completed todos:', error);
      setError('Failed to clear completed todos. Please try again.');
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const completedCount = todos ? todos.filter(todo => todo.completed).length : 0;
  const totalCount = todos ? todos.length : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your todos...</p>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <Navigation
        filter={filter}
        setFilter={setFilter}
        clearCompleted={clearCompleted}
        completedCount={completedCount}
        totalCount={totalCount}
      />
      
      <main className="main-content">
        <div className="todo-container">
          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button onClick={() => setError(null)} className="error-dismiss">×</button>
            </div>
          )}
          
          <TodoInput onAddTodo={addTodo} />
          <TodoList
            todos={getFilteredTodos()}
            onToggleTodo={toggleTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodoItem}
          />
          
          {todos.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No todos yet</h3>
              <p>Add your first todo above to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoApp;