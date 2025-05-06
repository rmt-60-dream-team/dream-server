# dream-server

## Architecture Documentation: 4+1 View Model for Authentication Feature

### 1. Logical View

The authentication system consists of the following components:

- **User Model**: Stores user credentials and profile information
- **AuthController**: Handles authentication logic (login/register)
- **TokenService**: Manages JWT token generation, validation, and refresh
- **PasswordService**: Handles password hashing and verification
- **ValidationService**: Validates input data format

#### Class Diagram

```
┌───────────────┐     ┌────────────────┐     ┌────────────────┐
│  User Model   │     │ AuthController  │     │  TokenService  │
├───────────────┤     ├────────────────┤     ├────────────────┤
│ id            │     │ register()     │     │ generateToken()│
│ username      │     │ login()        │     │ verifyToken()  │
│ email         │     │ logout()       │     │ refreshToken() │
│ password      │     └────────────────┘     └────────────────┘
│ created_at    │             │                      │
└───────────────┘             │                      │
        │                     ▼                      │
        │             ┌────────────────┐             │
        └────────────►│ValidationService│◄────────────┘
                      └────────────────┘
```

### 2. Process View

This view describes the system's dynamic behavior:

#### Login Process Flow

```
┌──────┐          ┌───────────────┐        ┌────────────┐        ┌────────────┐       ┌────────────┐
│Client│          │AuthController │        │UserModel   │        │TokenService│       │PasswordSvc │
└──┬───┘          └───────┬───────┘        └─────┬──────┘        └─────┬──────┘       └─────┬──────┘
   │ Login Request   │                           │                     │                    │
   │ (username/pwd)  │                           │                     │                    │
   │─────────────────►                           │                     │                    │
   │                 │ Validate                  │                     │                    │
   │                 │────────┐                  │                     │                    │
   │                 │        │                  │                     │                    │
   │                 │◄───────┘                  │                     │                    │
   │                 │ Find User                 │                     │                    │
   │                 │─────────────────────────►│                     │                    │
   │                 │                           │                     │                    │
   │                 │◄─────────────────────────│                     │                    │
   │                 │ Verify Password          │                     │                    │
   │                 │────────────────────────────────────────────────────────────────────►│
   │                 │                           │                     │                    │
   │                 │◄───────────────────────────────────────────────────────────────────│
   │                 │                           │                     │                    │
   │                 │ Generate Token            │                     │                    │
   │                 │─────────────────────────────────────────────────►                    │
   │                 │                           │                     │                    │
   │                 │◄────────────────────────────────────────────────                    │
   │ Response with   │                           │                     │                    │
   │ token           │                           │                     │
   │◄────────────────                           │                     │
```

#### Registration Process Flow

```
┌──────┐          ┌───────────────┐        ┌────────────┐        ┌────────────┐
│Client│          │AuthController │        │UserModel   │        │PasswordSvc │
└──┬───┘          └───────┬───────┘        └─────┬──────┘        └─────┬──────┘
   │ Register Request│                           │                     │
   │ (user data)     │                           │                     │
   │─────────────────►                           │                     │
   │                 │ Validate                  │                     │
   │                 │────────┐                  │                     │
   │                 │        │                  │                     │
   │                 │◄───────┘                  │                     │
   │                 │ Hash Password             │                     │
   │                 │────────────────────────────────────────────────►│
   │                 │                           │                     │
   │                 │◄───────────────────────────────────────────────│
   │                 │ Create User               │                     │
   │                 │─────────────────────────►│                     │
   │                 │                           │                     │
   │                 │◄─────────────────────────│                     │
   │ Response with   │                           │                     │
   │ success message │                           │                     │
   │◄────────────────                           │                     │
```

### 3. Development View

This view describes the system's organization from a programmer's perspective:

#### Package Structure

```
src/
├── controllers/
│   └── auth.controller.js
├── models/
│   └── user.model.js
├── services/
│   ├── token.service.js
│   └── password.service.js
├── middleware/
│   ├── auth.middleware.js
│   └── validation.middleware.js
├── config/
│   └── auth.config.js
├── routes/
│   └── auth.routes.js
└── utils/
    └── validation.utils.js
```

#### Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ORM
- JWT - JSON Web Token implementation
- bcrypt - Password hashing
- Joi - Request validation
- dotenv - Environment configuration

### 4. Physical View

This view describes the system's deployment and infrastructure:

#### Deployment Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Client App    │      │  API Gateway    │      │  Auth Service   │
│ (Web/Mobile)    │──────▶                 │──────▶                 │
└─────────────────┘      └─────────────────┘      └────────┬────────┘
                                                           │
                                                           │
                                                           ▼
                                              ┌─────────────────────────┐
                                              │                         │
                                              │    Database Server      │
                                              │    (MongoDB/Postgres)   │
                                              │                         │
                                              └─────────────────────────┘
```

#### Infrastructure Requirements

- **Web Server**: Node.js with Express
- **Database**: MongoDB or PostgreSQL
- **Caching**: Redis (optional, for token blacklisting)
- **Environment**: Docker containerization
- **Deployment**: Cloud service (AWS, GCP, Azure)
- **SSL/TLS**: For secure communication

### +1. Scenarios (Use Cases)

Key scenarios that the authentication system must support:

1. **User Registration**

   - User provides email, username, password
   - System validates input
   - System checks for existing users
   - System creates new user with hashed password
   - System sends confirmation email (optional)

2. **User Login**

   - User provides credentials
   - System validates credentials
   - System generates JWT token
   - System returns token to client

3. **Token Validation**

   - Client includes token in requests
   - System validates token signature and expiration
   - System grants access to protected resources

4. **Password Reset**

   - User requests password reset
   - System sends reset link via email
   - User sets new password
   - System updates password

5. **Account Logout**
   - User requests logout
   - System invalidates token (blacklisting or using short expiry)
   - Client clears local token storage
