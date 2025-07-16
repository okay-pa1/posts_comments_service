# 🗃️ Post & Comment Service

A cleanly structured backend REST API that enables users to register, authenticate, post content, and add rich-text comments — all built using **Node.js**, **Express**, and **MongoDB**. This project is fully Dockerized and supports both **local development** and **containerized deployment**.

---

## 🚀 Features

- 🔐 **JWT Authentication** with login & register flow
- 📝 **Post creation & retrieval**
- 💬 **Commenting with rich-text (Markdown) support**
- 📚 **Pagination** for efficient data browsing
- ✅ **Centralized request validation** with custom validators
- 🐳 **Dockerized setup** with MongoDB and Mongo Express UI
- 🛡️ **Middleware-based authorization**
- 🗑️ **Soft-delete support** for posts and comments
- 📦 Following modern practices in project structure and modularity

---

## 📦 Tech Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| Runtime       | Node.js                    |
| Web Framework | Express.js                 |
| Database      | MongoDB (Mongoose ODM)     |
| Auth          | JWT                        |
| Validation    | Express Middleware         |
| Container     | Docker, Docker Compose     |
| UI (optional) | Mongo Express (port: 8081) |

---

## 🧠 Project Structure

```
├── controllers/         # Logic for posts, comments, auth
├── models/              # Mongoose schemas
├── middlewares/         # Auth + request validation
├── routes/              # Modular Express routes
├── db.js                # MongoDB connection setup
├── server.js            # App entry point
├── Dockerfile           # Express app Docker config
├── docker-compose.yml   # Mongo + Express + Mongo Express
├── .env                 # Environment variables
```

---

## 💡 Rich Text Support (Bonus Feature)

This project implements **rich text formatting in comments** via **Markdown**.

### 🛠 How it works:

- Users send raw **Markdown strings** in the `comment` field.
- Example:
  ```json
  {
    "comment": "This is **bold**, this is _italic_, and this is a [link](https://example.com)."
  }
  ```
- The backend stores this **raw Markdown** without altering it.
- A frontend or consumer app can render this as rich HTML.

🎉 This satisfies the bonus requirement of implementing formatted comments.

---

## ⚙️ Setup Options

---

### 🐳 Docker-Based Setup (Recommended)

> Run the entire stack using Docker & Docker Compose

#### 🔧 Step 1: Clone the Repository

```bash
git clone https://github.com/okay-pa1/posts_comments_service.git
cd posts_comments_service
```

#### 🧱 Step 2: Start Services

```bash
docker compose up --build
```

#### 📍 Services will be available at:

- Express API: `http://localhost:8383`
- MongoDB: `localhost:27017`
- Mongo Express UI: `http://localhost:8081` (admin/admin)

> MongoDB data is persisted in the `mongo_data` volume.

---

### 🖥️ Local Machine Setup (without Docker)

> Run MongoDB and Node.js directly on your system.

#### 🔧 Step 1: Install Dependencies

```bash
npm install
```

#### 🔐 Step 2: Create `.env` File

```env
PORT=8383
MONGO_URL=mongodb://localhost:27017/PostAndCommentService
JWT_SECRET=your-secure-key
```

#### ▶️ Step 3: Start Server

```bash
npm start
```

Express will run at: `http://localhost:8383`

Make sure MongoDB is running locally on port `27017`.

---

## 📬 API Endpoints

All protected routes require an `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### 🔐 Auth Routes

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register a new user  |
| POST   | `/api/auth/login`    | Login and return JWT |

**🧾 Sample Request:**

```json
{
  "username": "johndoe",
  "password": "secure123"
}
```

---

### 📝 Post Routes

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/api/posts`         | Create a new post (Auth required) |
| GET    | `/api/posts`         | Get all posts (Paginated)         |
| GET    | `/api/posts/user`    | Get all posts by logged-in user   |
| GET    | `/api/posts/:postId` | Get a single post by ID           |
| PUT    | `/api/posts/:postId` | Update a post                     |
| DELETE | `/api/posts/:postId` | Delete a post                     |

**🧾 Sample Request (Create):**

```json
{
  "title": "My First Post",
  "description": "This is a simple blog-style post."
}
```

---

### 💬 Comment Routes

| Method | Endpoint                      | Description                            |
| ------ | ----------------------------- | -------------------------------------- |
| POST   | `/api/comments/:postId`       | Add a Markdown-formatted comment       |
| GET    | `/api/comments`               | Get all comments by logged-in user     |
| GET    | `/api/comments/under/:postId` | Get all comments under a specific post |
| GET    | `/api/comments/:commentId`    | Get a specific comment                 |
| PUT    | `/api/comments/:commentId`    | Update a comment                       |
| DELETE | `/api/comments/:commentId`    | Delete a comment                       |

**🧾 Sample Request (Markdown):**

```json
{
  "comment": "This is **bold**, _italic_, and [a link](https://example.com)."
}
```

---

## 🔄 Pagination & Sorting Support

All GET routes that retrieve multiple items (like all posts or all comments) support the following query parameters:

- `page` – Page number (default: 1)
- `limit` – Items per page (default: 10)
- `sortBy` – Field to sort by (e.g., `createdAt`)
- `order` – Sorting order (`asc` or `desc`)

### ✅ Supported in:

- `GET /api/posts`
- `GET /api/posts/user`
- `GET /api/comments`
- `GET /api/comments/under/:postId`

**Example:**

```
GET /api/posts?page=2&limit=5&sortBy=createdAt&order=desc
```

---

## ✅ Validation Middleware

All incoming data is validated using modular middlewares:

- `registerValidator`, `loginValidator`
- `createPostValidator`, `editPostValidator`
- `createCommentValidator`, `updateCommentValidator`

If invalid, `422 Unprocessable Entity` is returned with error details.

---

## 🐳 Docker Reference Commands

```bash
docker compose up         # Start everything
docker compose up --build # Rebuild and start
docker compose down       # Stop and remove containers
docker compose down -v    # Also remove MongoDB volume
docker compose logs -f    # Live logs
```
