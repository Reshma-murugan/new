import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : ''
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (editText.trim() && !isUpdating) {
      setIsUpdating(true);
      try {
        await onUpdate(todo.id, editText.trim(), editDueDate || null);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating todo:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleToggle = async () => {
    if (!isUpdating) {
      setIsUpdating(true);
      try {
        await onToggle();
      } catch (error) {
        console.error('Error toggling todo:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete();
      } catch (error) {
        console.error('Error deleting todo:', error);
        setIsDeleting(false);
      }
    }
  };

  const startEditing = () => {
    if (!isUpdating && !isDeleting) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const handleDateChange = (e) => {
    setEditDueDate(e.target.value);
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  const isDueToday = () => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return (
      dueDate.toDateString() === today.toDateString() &&
      dueDate > today
    );
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `Due ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const isFormDisabled = isUpdating || isDeleting;

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''} ${isDueToday() ? 'due-today' : ''} ${isFormDisabled ? 'updating' : ''}`}>
      <div className="todo-content">
        <button
          className="toggle-btn"
          onClick={handleToggle}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          disabled={isFormDisabled}
        >
          {isUpdating ? '⟳' : (todo.completed ? '✓' : '○')}
        </button>

        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editText}
              onChange={handleTextChange}
              onKeyDown={handleKeyPress}
              className="edit-input"
              autoFocus
              disabled={isFormDisabled}
              maxLength={255}
            />
            <input
              type="datetime-local"
              value={editDueDate}
              onChange={handleDateChange}
              className="edit-date-input"
              min={new Date().toISOString().slice(0, 16)}
              disabled={isFormDisabled}
            />
            <div className="edit-actions">
              <button 
                onClick={handleSave} 
                className="save-btn"
                disabled={isFormDisabled || !editText.trim()}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={handleCancel} 
                className="cancel-btn"
                disabled={isFormDisabled}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="todo-info">
            <span className="todo-text">{todo.text}</span>
            {todo.dueDate && (
              <div className={`due-date ${isOverdue() ? 'overdue' : ''} ${isDueToday() ? 'due-today' : ''}`}>
                {formatDueDate(todo.dueDate)}
              </div>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button
            onClick={startEditing}
            className="edit-btn"
            aria-label="Edit todo"
            disabled={isFormDisabled}
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="delete-btn"
            aria-label="Delete todo"
            disabled={isFormDisabled}
          >
            {isDeleting ? '⟳' : '🗑️'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;