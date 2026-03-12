*This project has been created as part of the 42 curriculum by abosc, alegrix, ameduboi, bfiquet, jguelen.*

# ft_transcendence

A full-stack, real-time multiplayer web application built with a microservices architecture. The project features a browser-based multiplayer game, a real-time chat system, user management with profiles and friends, and a public API — all containerized with Docker and served over HTTPS.

## Table of Contents

- [Team Information](#team-information)
- [Description](#description)
- [Features List](#features-list)
- [Modules](#modules)
- [Technical Stack](#technical-stack)
- [Database Schema](#database-schema)
- [Project Management](#project-management)
- [Instructions](#instructions)
- [Individual Contributions](#individual-contributions)
- [Resources](#resources)

---

## Team Information

| Login | Role(s) | Responsibilities |
|:---:|:---:|:---|
| **abosc** | Tech Lead / Developer | Designed the overall technical architecture of the project. Developed the game engine (Kong), including multiplayer and remote play functionality. Oversaw technical decisions and code quality. |
| **alegrix** | Product Owner / Developer | Defined project vision and feature priorities. Implemented database, user management, the public Database API, the ORM layer, and contributed to backend route development. |
| **ameduboi** | Developer | Set up the frontend frameworks (React). Built the modular UI design system, implemented multilanguage support (i18n), and ensured multi-browser compatibility. |
| **bfiquet** | Developer | Developed user interactions including the real-time chat system (WebSocket), the profile system, and the friends system. |
| **jguelen** | Project Manager / Developer | Managed project organization, task distribution, and team coordination. Designed and implemented the microservices architecture, Docker infrastructure, HTTPS configuration, Caddy reverse proxy setup, and CI tooling (Makefile, certificates). |

---

## Description

**ft_transcendence** is the final project of the 42 common core curriculum. It is a single-page web application that allows users to register, log in, play a real-time multiplayer game against other users (locally or remotely), chat in real time, manage their profile and friends list, and interact with a public API.

### Key Features

- **Real-time multiplayer game** — A browser-based game ("Kong") supporting 2+ players simultaneously, with remote play over WebSockets.
- **Microservices backend** — Six independently deployed services (frontend, auth, chat, database, user-management, kong/game), each with a single responsibility, communicating over HTTPS.
- **Real-time chat** — WebSocket-powered direct messaging between users.
- **User management** — Registration, login (including GitHub OAuth), profile pages, avatar upload, friend requests, and online status.
- **Public API** — A secured, rate-limited REST API with API key authentication for external access to user and friend data.
- **Multilanguage UI** — Full interface translations in English, French, and German with a language switcher.
- **Responsive & accessible** — Works across Chrome, Firefox, and other modern browsers with dark/light theme support.
- **Fully containerized** — Docker Compose orchestration with auto-generated self-signed TLS certificates for all inter-service communication.

---

## Features List

| Feature | Description | Contributor(s) |
|:---|:---|:---:|
| User Registration & Login | Create an account with pseudo/email/password; JWT-based authentication | alegrix, bfiquet |
| User Profiles | View and edit profile information (avatar, email); view other users' profiles | alegrix, ameduboi |
| Avatar Upload | Upload a custom avatar image; default avatar provided | alegrix, ameduboi |
| Friends System | Send, accept, refuse, and remove friend requests; view friends list | bfiquet, alegrix |
| Real-time Chat | WebSocket-based direct messaging with conversation history | ameduboi, alegrix |
| Multiplayer Game (Kong) | Browser-based real-time game with 2+ player support | abosc |
| Remote Play | Play against opponents on separate computers in real time | abosc |
| Public REST API | Secured API with key-based auth, rate limiting, and CRUD endpoints | alegrix |
| Multilanguage (i18n) | Full UI in English, French, and German with runtime switching | ameduboi |
| Dark / Light Theme | User-selectable theme persisted in local storage | ameduboi |
| 404 Page | Custom not-found page with localized text | ameduboi |
| Terms of Service Page | Accessible legal/ToS page | ameduboi |
| Microservices Infrastructure | Docker Compose, Caddy reverse proxy, auto-TLS certificates, health checks | jguelen |
| Modular UI Components | 10+ reusable React components with consistent design system | ameduboi |
| Multi-browser Support | Tested and compatible with Chrome, Firefox, and additional browsers | ameduboi |

---

## Modules

### Summary

| # | Grade | Title | Owner(s) | Points | Module Type |
|:-:|:---:|:---|:---:|:---:|:---:|
| 1 | Major | Front and back Frameworks | ameduboi, alegrix | 2 | Mandatory |
| 2 | Major | Real-time Features | abosc, bfiquet, alegrix, ameduboi | 2 | Mandatory |
| 3 | Major | User Interactions | bfiquet, alegrix | 2 | Mandatory |
| 4 | Major | Database API | alegrix | 2 | Mandatory |
| 5 | Major | User Management | alegrix, bfiquet, ameduboi | 2 | Mandatory |
| 6 | Major | Game | abosc | 2 | Bonus |
| 7 | Major | Remote Play | abosc | 2 | Bonus |
| 8 | Major | Multiplayer | abosc | 2 | Bonus |
| 9 | Major | Microservices | jguelen | 2 | Mandatory |
| 10 | Minor | ORM | alegrix | 1 | Mandatory |
| 11 | Minor | Modular Design | ameduboi | 1 | Mandatory |
| 12 | Minor | Multilanguage | ameduboi | 1 | Bonus |
| 13 | Minor | Multi-browser Support | ameduboi | 1 | Bonus |
| | | | **Total** | **22** |

### Module Details

#### 1. Front and back Frameworks (Major) — *ameduboi, alegrix, bfiquet*

**Justification:** Required to build a modern, maintainable web application with clear separation between client and server.

**Implementation:** The frontend uses **React 19** with **Vite** as the build tool and **Tailwind CSS** for styling. The backend services all use **Fastify** (Node.js/TypeScript). This combination provides fast hot-reload development, type safety across the stack, and high-performance HTTP serving.

#### 2. Real-time Features (Major) — *abosc, alegrix, bfiquet, ameduboi*

**Justification:** Essential for live gameplay and instant messaging — both core features of the project.

**Implementation:** WebSockets are used in two places: the **chat-service** for real-time direct messaging between users (connection/disconnection handling, message broadcasting), and the **kong-service** for real-time game state synchronization between players. A heartbeat (ping) mechanism keeps connections alive.

#### 3. User Interactions (Major) — *bfiquet, alegrix*

**Justification:** Core social features required by the project specification.

**Implementation:** Includes a chat system (send/receive DMs via WebSocket), a profile system (view user info, avatar, creation date), and a friends system (send/accept/refuse/remove friend requests, view friends list). All data is persisted via the database service.

#### 4. Database API (Major) — *alegrix*

**Justification:** Provides external programmatic access to user data, enabling third-party integrations.

**Implementation:** A public REST API secured with per-user API keys (`x-api-key` header) and rate limiting (3 requests/minute). Endpoints include:
- `GET /api/public/friends` — List accepted friends
- `GET /api/public/friends/receive` — List pending friend requests
- `POST /api/public/user/exists` — Check if a user exists
- `PUT /api/public/user/email` — Update email
- `DELETE /api/public/user` — Delete account

#### 5. User Management (Major) — *alegrix, ameduboi*

**Justification:** Standard authentication and profile management are fundamental to any multi-user application.

**Implementation:** Users can register, log in, update their profile (email, avatar), generate API keys, and manage friends. Default avatars are provided via an `avatar-copier` init container. Profile pages display user information and are accessible to other logged-in users.

#### 6. Game (Major) — *abosc*

**Justification:** The game is the central feature of ft_transcendence.

**Implementation:** A complete browser-based game ("Kong") rendered on an HTML5 Canvas, integrated into React via a wrapper component (`KongGameComponent`). The game supports real-time multiplayer with clear rules, win/loss conditions, and distinct player colors. It can be played in fullscreen mode.

#### 7. Remote Play (Major) — *abosc*

**Justification:** Allows players on different computers to compete, which is a key requirement.

**Implementation:** The kong-service runs a WebSocket server that synchronizes game state between remote clients. Network latency is handled through server-authoritative game logic. Connection tokens are validated via the auth-service.

#### 8. Multiplayer (Major) — *abosc*

**Justification:** Extends the game beyond 1v1 to support three or more simultaneous players.

**Implementation:** The game engine supports multiple concurrent players with fair mechanics and proper state synchronization. Each player is assigned a unique color for visual distinction.

#### 9. Microservices (Major) — *jguelen*

**Justification:** Improves modularity, independent deployability, and separation of concerns compared to a monolithic backend.

**Implementation:** The backend is split into 6 Docker containers, each with a single responsibility:
| Service | Port | Responsibility |
|:---|:---:|:---|
| `frontend` | 3000 | React SPA (Vite dev server) |
| `auth-service` | 3001 | Authentication (JWT, OAuth) |
| `user-management-service` | 3003 | Profile, avatar, friend routes |
| `chat-service` | 3004 | Real-time chat (WebSocket) |
| `database-service` | 5000 | Prisma ORM, data persistence |
| `kong-service` | 3000 | Game server (WebSocket) |

All inter-service communication uses HTTPS with self-signed certificates. **Caddy** acts as the reverse proxy, routing requests by path prefix. Docker secrets manage sensitive credentials.

#### 10. ORM (Minor) — *alegrix*

**Justification:** Provides type-safe, maintainable database access without raw SQL.

**Implementation:** **Prisma 7.1** with the `better-sqlite3` adapter. The schema is defined declaratively in `schema.prisma`, and migrations are managed via `prisma migrate`.

#### 11. Modular Design (Minor) — *ameduboi*

**Justification:** Ensures UI consistency and reduces code duplication.

**Implementation:** A custom design system with 10+ reusable components including: `Button`, `MyButton`, `RegisterButton`, `RegisterInput`, `SwitchButton`, `Img`, `Friend`, `Main` (layout), `SearchBar`, `Bottombar`, and more. A consistent color palette is defined via CSS custom properties (`--background`, `--contrast`, `--button`, etc.) with dark/light theme variants.

#### 12. Multilanguage (Minor) — *ameduboi*

**Justification:** Makes the application accessible to a wider audience.

**Implementation:** A custom i18n system via `LangProvider` (React Context). All user-facing text is stored in language JSON objects. The UI provides a language switcher supporting **French 🇫🇷**, **English 🇬🇧**, and **German 🇩🇪**. The selected language persists across sessions.

#### 13. Multi-browser Support (Minor) — *ameduboi*

**Justification:** Ensures all users have a consistent experience regardless of browser choice.

**Implementation:** The application is tested and fully compatible with **Google Chrome**, **Mozilla Firefox**, and other Chromium-based browsers (Edge, etc.). Tailwind CSS and standard web APIs are used to maximize cross-browser compatibility.

---

## Technical Stack

### Frontend

| Technology | Purpose |
|:---|:---|
| **React 19** | UI framework (component-based SPA) |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **TypeScript** | Type-safe JavaScript |
| **React Router** | Client-side routing |

### Backend

| Technology | Purpose |
|:---|:---|
| **Fastify** | High-performance Node.js HTTP framework |
| **TypeScript** | Type-safe server-side code |
| **WebSocket (ws)** | Real-time communication (chat + game) |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT authentication |

### Database

| Technology | Purpose |
|:---|:---|
| **SQLite3** | Lightweight, file-based relational database |
| **Prisma 7.2** | ORM with type-safe queries and migrations |

**Why SQLite?** SQLite was chosen for its simplicity, zero-configuration setup, and suitability for a containerized project with a single write process. It requires no separate database server, which aligns well with the Docker-based deployment and keeps the infrastructure lightweight.

### Infrastructure

| Technology | Purpose |
|:---|:---|
| **Docker & Docker Compose** | Container orchestration |
| **Caddy** | Reverse proxy with automatic HTTPS |
| **OpenSSL** | Self-signed TLS certificate generation |
| **Make** | Build automation |
| **Docker Secrets** | Secure credential management |

### Justification for Major Technical Choices

- **Microservices over monolith:** Allows independent development and deployment of each service, clear boundaries, and better fault isolation.
- **Caddy over Nginx:** Caddy provides automatic HTTPS, simpler configuration syntax, and built-in TLS certificate management.
- **Fastify over Express:** Fastify offers better performance, built-in schema validation, and a robust plugin system.
- **Prisma over raw SQL:** Provides type safety, auto-generated client, and declarative schema management.
- **React over vanilla JS:** Component-based architecture scales well for a multi-page SPA with shared state.

---

## Database Schema

The database uses **SQLite3** managed through **Prisma ORM**. Below is the schema structure:

### Entity Relationship Diagram

```
┌─────────────────────┐
│        User          │
├─────────────────────┤
│ pseudo    (PK)       │  ◄─────────────────────────────────────────┐
│ email     (UNIQUE)   │                                            │
│ password  (nullable) │                                            │
│ avatar               │                                            │
│ apiKey    (nullable) │                                            │
│ createdAt            │                                            │
│ updatedAt            │                                            │
└────┬───┬───┬────────┘                                            │
     │   │   │                                                      │
     │   │   │  1..*                                                │
     │   │   └───────────┐                                          │
     │   │               ▼                                          │
     │   │   ┌───────────────────────────┐                          │
     │   │   │ ConversationParticipant   │                          │
     │   │   ├───────────────────────────┤                          │
     │   │   │ id              (PK)      │                          │
     │   │   │ conversationId  (FK)──────┼──┐                      │
     │   │   │ userId          (FK)      │  │                      │
     │   │   │ role                      │  │                      │
     │   │   │ joinedAt                  │  │                      │
     │   │   └───────────────────────────┘  │                      │
     │   │                                  │                      │
     │   │  1..*                            │                      │
     │   └──────────┐                      │                      │
     │              ▼                      ▼                      │
     │   ┌──────────────────┐   ┌──────────────────┐              │
     │   │     Message      │   │  Conversation    │              │
     │   ├──────────────────┤   ├──────────────────┤              │
     │   │ id          (PK) │   │ id         (PK)  │              │
     │   │ conversationId   │──▶│ name             │              │
     │   │ senderId    (FK) │   │ isGroup          │              │
     │   │ content          │   │ createdAt        │              │
     │   │ createdAt        │   │ updatedAt        │              │
     │   └──────────────────┘   └──────────────────┘              │
     │                                                              │
     │  1..*                                                        │
     └──────────┐                                                  │
                ▼                                                  │
     ┌───────────────────────┐                                     │
     │       Friend          │                                     │
     ├───────────────────────┤                                     │
     │ id            (PK)    │                                     │
     │ requesterId   (FK)────┼─────────────────────────────────────┘
     │ addresseeId   (FK)────┼─────────────────────────────────────┘
     │ status                │  (PENDING / ACCEPTED)
     │ createdAt             │
     └───────────────────────┘
     UNIQUE(requesterId, addresseeId)
```

### Tables

| Table | Description | Key Fields |
|:---|:---|:---|
| **User** | Stores user accounts | `pseudo` (PK, String), `email` (Unique, String), `password` (String, nullable for OAuth users), `avatar` (String, default: "default.png"), `apiKey` (String, nullable), `createdAt` / `updatedAt` (DateTime) |
| **Conversation** | Represents a chat conversation | `id` (PK, Int, auto-increment), `name` (String, nullable), `isGroup` (Boolean, default: false), `createdAt` / `updatedAt` (DateTime) |
| **ConversationParticipant** | Links users to conversations (many-to-many) | `id` (PK, Int), `conversationId` (FK → Conversation), `userId` (FK → User.pseudo), `role` (String, default: "member"). Unique constraint on `(conversationId, userId)` |
| **Message** | Stores individual chat messages | `id` (PK, Int), `conversationId` (FK → Conversation), `senderId` (FK → User.pseudo), `content` (String), `createdAt` (DateTime) |
| **Friend** | Tracks friend relationships and requests | `id` (PK, Int), `requesterId` (FK → User.pseudo), `addresseeId` (FK → User.pseudo), `status` (String, default: "PENDING"). Unique constraint on `(requesterId, addresseeId)` |

### Relationships

- A **User** can participate in many **Conversations** (via `ConversationParticipant`).
- A **Conversation** has many **Participants** and many **Messages**.
- A **Message** belongs to one **Conversation** and one **User** (sender).
- A **Friend** record links two **Users** (requester and addressee) with a status.
- Cascade delete is enabled on Conversation → Participants and Conversation → Messages.

---

## Project Management

### Work Organization

The team organized work through **regular in-person meetings** to discuss progress, plan tasks, and resolve blockers. Each team member was assigned ownership of specific modules (see [Modules](#modules)), allowing parallel development with clear boundaries.

### Tools

| Tool | Usage |
|:---|:---|
| **Figma** | UI/UX design and mockups |
| **Discord** | Primary remote communication channel |
| **In-person meetings** | Task planning, code reviews, and coordination |
| **Git / GitHub** | Version control and collaboration |

### Communication

The team communicated primarily through **Discord** for day-to-day discussions and coordination, complemented by **in-person meetings** for planning sessions and collaborative debugging.

---

## Instructions

### Prerequisites

| Software | Minimum Version |
|:---|:---|
| **Docker** | 24.0+ |
| **Docker Compose** | v2.20+ |
| **Make** | Any recent version |
| **OpenSSL** | Any recent version (for certificate generation) |

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/achille-bsc/transcendence.git
   cd transcendence
   ```

2. **Create the `.env` file** at the project root with the following variables:

   ```env
   DATABASE_URL="file:./data/dev.db"
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

3. **Create the secrets directory** and populate it with the required secret files:

   ```bash
   mkdir -p secrets
   ```

   Create the following files inside `secrets/`, each containing the corresponding secret value (plain text, no trailing newline):

   | File | Description |
   |:---|:---|
   | `secrets/api_internal_key` | Internal API passphrase for inter-service auth |
   | `secrets/db_password` | Database password |
   | `secrets/jwt_secret` | JWT signing secret |

   > **Note:** To use GitHub OAuth login, you must create a [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) with the callback URL set to `https://localhost:8443/oauth/callback`.

4. **Build and run** (production mode):

   ```bash
   make
   ```

   Or for **development mode** (with hot-reload / file watching):

   ```bash
   make dev
   ```

5. **Access the application:** Open your browser and navigate to:

   ```
   https://localhost:8443
   ```

   > ⚠️ Your browser will show a certificate warning because the TLS certificates are self-signed. This is expected — accept the warning to proceed.

### Available Make Commands

| Command | Description |
|:---|:---|
| `make` / `make up` | Build and start all services (production) |
| `make dev` | Build and start with hot-reload (development) |
| `make down` | Stop all services (production) |
| `make ddown` | Stop all services (development) |
| `make clean` | Stop and remove local images |
| `make fclean` | Stop, remove all images, volumes, and certificates |
| `make re` | Clean rebuild (production) |
| `make red` | Clean rebuild (development) |
| `make certs` | Generate TLS certificates only |

---

## Individual Contributions

### abosc (Tech Lead / Developer)

I developed the entire game, both the visual aspect (front-end) and the server aspect (back-end), from WebSocket communication to game state management.

### alegrix (Product Owner / Developer)

I do the backend, all routes, instances API and the database, its schema and its implementation. I choose feature priority too. I was challenged on the use of typescript which I had never used before, as well as all its modules.

### ameduboi (Developer)

I started using AI after acquiring a good comprehension of what I am doing, like that I'm sure of what the AI do and I can modify it if necessary. It helps me a lot with the translation in each file and it takes make less time to do things.

### bfiquet (Developer)

Frontend Development
Implemented several frontend components including the friends management system, navigation bar, and profile page.
Learned and applied React and frontend development practices, studying the official documentation to quickly adapt to the project’s architecture.
Features Development
Implemented the chat system, Two-Factor Authentication (2FA), and OAuth authentication modules.
Challenges and Solutions
Faced challenges due to the need to quickly learn frontend technologies (React) while contributing to the project.
Addressed this by studying the documentation and integrating best practices during development.
Encountered some coordination difficulties related to product ownership.

### jguelen (Project Manager / Developer)

I took care of the planning regarding microservices and the splitting of a monolith code into microservices. I planned ahead for future problems I saw as likely to appear, such problems included: restoring or creating new package.json and package-lock.json from a docker container based on existing code to avoid having to work on a VM, the hot-reload of work done outside containers inside them. I realised the architecture of said microservices and their network connection including HTTPS for all transmissions. I also took care of the coordination of rebase and merges and resolving of git mishaps. 
I faced difficulties mainly regarding certain aspects of the use of a reverse-proxy and designing the general architecture and with the caddy documentation not been very clear and everything being buried or not up to date. I resolved such difficulties either by reading more documentation or sometimes peer learning or by using AI as a documentary aid.
---

## Resources

### Documentation & References

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [shell scripting](https://abs.traduc.org/abs-5.3-fr/ch07.html)
- [Node](https://nodejs.org/dist/latest-v20.x/docs/)
- [Docker images](https://hub.docker.com/)

### AI Usage

AI tools (such as ChatGPT and GitHub Copilot) were used by team members to varying degrees throughout the project. Below is a summary of how AI was used:

**jguelen:**
- Used AI as a **documentary aid** — to look up and summarize technical documentation.
- Used AI to **analyse long logs** during debugging sessions, helping identify errors faster.
- Occasionally used AI to **assess architectural decisions** for the overall program structure and to understand infrastructure concepts not fully covered in official documentation.
- Used AI sparingly for **Docker-related work**, primarily as a sounding board to validate plans and think through container architecture more rigorously.

**abosc:**

I used AI to improve the visual aspect of the game and assist with debugging.

**alegrix:**

I use AI to debbuging, do test and win time with fatidious task. I use it for the documentation too.

**ameduboi:**

I started using AI after acquiring a good comprehension of what I am doing, like that I'm sure of what the AI do and I can modify it if necessary. It helps me a lot with the translation in each file and it takes make less time to do things. 

**bfiquet:**

Used AI as a documentary aid — to look up and summarize technical documentation.
Used AI to analyse logs,  helping identify errors faster.
Used AI to analyse architecture and make better decisions for the overall structure.

---

## Known Limitations

- TLS certificates are self-signed, which causes browser warnings on first access.
- The application is designed to run on `localhost` and private networks; additional configuration would be needed for deployment to a public server.

---

## License

This project was developed as part of the [42 school](https://42.fr/) curriculum and is intended for educational purposes.