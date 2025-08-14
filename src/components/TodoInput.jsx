import React, { useState } from 'react';
import './TodoInput.css';

const TodoInput = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddTodo(text.trim(), dueDate || null);
        setText('');
        setDueDate('');
        setShowDatePicker(false);
      } catch (error) {
        console.error('Error submitting todo:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const clearDate = () => {
    setDueDate('');
    setShowDatePicker(false);
  };

  const resetForm = () => {
      setText('');
      setDueDate('');
      setShowDatePicker(false);
  };

  const isFormValid = text.trim().length > 0;

  return (
    <div className="todo-input-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="todo-input"
            disabled={isSubmitting}
            maxLength={255}
          />
          
          <div className="input-actions">
            <button
              type="button"
              onClick={toggleDatePicker}
              className={`date-toggle-btn ${dueDate ? 'has-date' : ''}`}
              title="Set due date"
              disabled={isSubmitting}
            >
              📅
            </button>
            
            <button
              type="submit"
              className="add-btn"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
        
        {showDatePicker && (
          <div className="date-picker-container">
            <input
              type="datetime-local"
              value={dueDate}
              onChange={handleDateChange}
              className="date-input"
              min={new Date().toISOString().slice(0, 16)}
              disabled={isSubmitting}
            />
            {dueDate && (
              <button
                type="button"
                onClick={clearDate}
                className="clear-date-btn"
                title="Clear date"
                disabled={isSubmitting}
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        {dueDate && (
          <div className="due-date-preview">
            Due: {new Date(dueDate).toLocaleString()}
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoInput;