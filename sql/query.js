const findUser = {
  findByUsername: "SELECT * FROM users WHERE username = $1",
  findById: "SELECT * FROM users WHERE id = $1",
  findAll: "SELECT * FROM users",
  findByRole: "SELECT * FROM users WHERE role = $1",
  findByStatus: "SELECT * FROM users WHERE status = $1",
};

const findTask = {
  findByUserId: "SELECT * FROM tasks WHERE user_id = $1",
  findById: "SELECT * FROM tasks WHERE id = $1",
  findAll: "SELECT * FROM tasks",
  findByStatus: "SELECT * FROM tasks WHERE status = $1",
  findByExpiresAt: "SELECT * FROM tasks WHERE expires_at = $1",
  findUserIdANDTitle: "SELECT * FROM tasks WHERE user_id = $1 AND title = $2",
};

const insertUser = {
  createUser:
    "INSERT INTO users (name, username, password, created_at, status, role) VALUES ($1, $2, $3, $4, $5, $6)",
  updateUser:
    "UPDATE users SET name = $1, username = $2, password = $3, status = $4, role = $5 WHERE id = $6",
  updateUserStatus: "UPDATE users SET status = $1 WHERE id = $2",
  deleteUser: "DELETE FROM users WHERE id = $1",
  deleteByUsername: "DELETE FROM users WHERE username = $1",
};

const insertTask = {
  createTask:
    "INSERT INTO tasks (user_id, title, task, created_at, expires_at, status) VALUES ($1, $2, $3, $4, $5, $6)",
  updateTask:
    "UPDATE tasks SET title = $1, task = $2, expires_at = $3, status = $4 WHERE id = $5",
  updateTaskDetails: "UPDATE tasks SET task = $1 WHERE id = $2",
  updateTaskStatus: "UPDATE tasks SET status = $1 WHERE id = $2",
  deleteTask: "DELETE FROM tasks WHERE id = $1",
  deleteByTitle: "DELETE FROM tasks WHERE title = $1",
};

module.exports = {
  findUser,
  findTask,
  insertUser,
  insertTask,
};
