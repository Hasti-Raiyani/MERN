import React, { useState, useEffect } from 'react';
import API from '../api';

const emptyForm = { title: '', description: '', status: 'pending', dueDate: '' };

const Dashboard = () => {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [editId, setEditId]       = useState(null);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus !== 'all') params.status = filterStatus;
      const { data } = await API.get('/tasks', { params });
      setTasks(data);
      setError('');
    } catch {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [search, filterStatus]);

  const resetForm = () => { setForm(emptyForm); setEditId(null); setFormError(''); };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      if (editId) {
        await API.put(`/tasks/${editId}`, form);
      } else {
        await API.post('/tasks', form);
      }
      resetForm();
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch { alert('Failed to delete task'); }
  };

  const handleToggle = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        status: task.status === 'pending' ? 'completed' : 'pending',
      });
      fetchTasks();
    } catch { alert('Failed to update status'); }
  };

  return (
    <div className="container dashboard">

      {/* Task Form */}
      <div className="task-form-card">
        <h3>{editId ? '✏️ Edit Task' : '➕ Add New Task'}</h3>
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" style={{ width: 'auto' }} disabled={submitting}>
              {submitting ? 'Saving...' : editId ? 'Update Task' : 'Add Task'}
            </button>
            {editId && (
              <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Filter */}
      <div className="controls">
        <input
          placeholder="🔍 Search tasks by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">⏳ Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Add a new task above to get started!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className={`task-card ${task.status}`}>
              <div className="task-info">
                <h4 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                {task.description && <p>{task.description}</p>}
                <div className="task-meta">
                  <span className={`badge badge-${task.status}`}>{task.status}</span>
                  {task.dueDate && (
                    <span className="due-date">
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button
                  className={`btn btn-sm ${task.status === 'pending' ? 'btn-success' : 'btn-warning'}`}
                  onClick={() => handleToggle(task)}
                >
                  {task.status === 'pending' ? '✅ Done' : '↩️ Undo'}
                </button>
                <button className="btn btn-sm btn-edit" onClick={() => handleEdit(task)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
