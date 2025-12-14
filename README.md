# ft_transcendence

**Roles**:  
- Product Owner: alegrix
- Project Manager (PM): jguelen
- Technical Lead / Architect: abosc
- Developers: abosc, alegrix, ameduboi, bfiquet, jguelen

**Project idea**:

## Requirements

### Mandatory

>***Be advised*** :
> - <span style="font-size:21px;color:red">**⚠**</span> The project must have a frontend that is clear, responsive and accessible accross **all** devices.
> - <span style="font-size:21px;color:red">**⚠**</span> The project **must** include accessible **Privacy Policy** and **Terms of Service** pages with relevant content (footer links)... <span style="font-size:21px;color:red">**⚠**</span>
> -  <span style="font-size:21px;color:red">**⚠**</span> <ins>***No warnings***</ins> and errors in the browser console!!
> - For the backend HTPPS must be used everywhere.
- Containerization technology: Docker

**Used technologies**:
- Programming languages: TypeScript
- DataBase: SQLite3
- ORM: Prisma 6


### Modules: 

Uncertain: ❔  
Actively working on it: 🚧  
In progess: <progress max="100" value="10"> 10% </progress>   
Done: ✅  
Planned: 🕒


|Status|Grade|Title|Brief desc|Owner| 
|:----:|:----:|:----:|:----|:----:|
|🕒| Major | Front and back Frameworks | <ul><li>Use a frontend framework (React, Vue, Angular, Svelte, etc.).  </li><li>Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails, etc.). </li> <li>Full-stack frameworks (Next.js, Nuxt.js, SvelteKit) count as both if you use both their frontend and backend capabilities. </li> </ul>| |
|🕒| Major | Real-time features | Real-time features using WebSockets or similar technology: <ul><li>Real-time updates across clients.</li> <li>Handle connection/disconnection gracefully. </li> <li>Efficient message broadcasting. </li></ul>| |
|🕒| Major| User interactions | Minimum requirements: <ul><li> A basic chat system (send/receive messages between users).</li> <li> A profile system (view user information).</li> <li> A friends system (add/remove friends, see friends list).</li></ul> | bfiquet | 
| ❔❔  | Major | DataBase API | A public API to interact with the database with a secured API key, rate imiting, documentation, and at least 5 endpoints:<ul> <li> GET /api/{something}</li> <li> POST /api/{something}</li> <li> PUT /api/{something}</li> <li> DELETE /api/{something}</li> </ul>  | |
|🕒| Minor | ORM | Use an ORM for the database | |
| ❔❔| Minor | Notifications | A complete notification system for all creation, update, and deletion actions. | |
|🕒| Minor | SSR | Server-Side Rendering (SSR) for improved performance and SEO (Search Engine Optimization) | |
|🕒| Minor | Modular Design | Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components) | |
|🕒| Minor | File upload and management system  |<ul> <li> Support multiple file types (images, documents, etc.).</li> <li> Client-side and server-side validation (type, size, format).</li> <li> Secure file storage with proper access control.</li> <li> File preview functionality where applicable.</li> <li> Progress indicators for uploads.</li> <li> Ability to delete uploaded files.</li> </ul> | |
| ❔❔ | Minor | Multilanguage | Support for multiple languages (at least 3 languages): <ul> <li> Implement i18n (internationalization) system.</li> <li> At least 3 complete language translations.</li> <li> Language switcher in the UI.</li> <li> All user-facing text must be translatable.</li> </ul>| |
| ❔❔  |  Minor | Multi-browser support | Support for additional browsers: <ul> <li> Full compatibility with at least 2 additional browsers (Firefox, Safari, Edge, etc.).</li> <li> Test and fix all features in each browser.</li> <li> Document any browser-specific limitations.</li> <li> Consistent UI/UX across all supported browsers</li> </ul>| |
|🕒| Major | User management | Standard user management and authentication: <ul> <li> Users can update their profile information.</li> <li> Users can upload an avatar (with a default avatar if none provided).</li> <li> Users can add other users as friends and see their online status.</li> <li> Users have a profile page displaying their information</li> </ul>| alegrix |
|🕒| Minor | Game stats | Game statistics and match history (requires a game module): <ul> <li> Track user game statistics (wins, losses, ranking, level, etc.).</li> <li> Display match history (1v1 games, dates, results, opponents).</li> <li> Show achievements and progression.</li> <li> Leaderboard integration.</li> </ul> | |
|🕒| Minor | OAuth | Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.) | |
|🕒| Minor | 2FA | Implement a complete 2FA (Two-Factor Authentication) system for the users | |
| ❔❔ |   Minor | User analytics | User activity analytics and insights dashboard. | |
| ❔ | Major | AI opponent |  <ul> <li> The AI must be challenging and able to win occasionally.</li> <li> The AI should simulate human-like behavior (not perfect play).</li> <li> If you implement game customization options, the AI must be able to use them.</li> <li> You must be able to explain your AI implementation during evaluation.</li> </ul>| |
|🕒| Major | Game | Implement a complete web-based game where users can play against each other:  <ul> <li> The game can be real-time multiplayer (e.g., Pong, Chess, Tic-Tac-Toe, Card games, etc.).</li> <li> Players must be able to play live matches.</li> <li> The game must have clear rules and win/loss conditions.</li> <li> The game can be 2D or 3D.</li> </ul>| |
|🕒| Major | Remote Play | Remote players — Enable two players on separate computers to play the same game in real-time <ul> <li> Handle network latency and disconnections gracefully.</li> <li> Provide a smooth user experience for remote gameplay.</li> <li> Implement reconnection logic.</li> </ul> ||
| ❔❔| Major | Multiplayer | Multiplayer game (three or more players): <ul> <li> Support for three or more players simultaneously.</li> <li> Fair gameplay mechanics for all participants.</li> <li> Proper synchronization across all clients.</li> </ul>| |
|🕒| Minor | Advanced chat | Advanced chat features (enhances the basic chat from "User interaction" module): <ul> <li> Ability to block users from messaging you.</li> <li> Invite users to play games directly from chat.</li> <li> Game/tournament notifications in chat.</li> <li> Access to user profiles from chat interface.</li> <li> Chat history persistence.</li> <li> Typing indicators and read receipts.</li> </ul>| bfiquet |
|🕒| Minor | Tournament | Implement a tournament system: <ul> <li> Clear matchup order and bracket system.</li> <li> Track who plays against whom.</li> <li> Matchmaking system for tournament participants.</li> <li> Tournament registration and management.</li> </ul> | |
|🕒| Minor | Game customization | Game customization options:  <ul> <li> Power-ups, attacks, or special abilities.</li> <li> Different maps or themes.</li> <li> Customizable game settings.</li> <li> Default options must be available.</li> </ul>| |
|🕒| Minor | Gamification | A gamification system to reward users for their actions <ul> <li> Implement at least 3 of the following: achievements, badges, leaderboards, XP/level system, daily challenges, rewards</li> <li> System must be persistent (stored in database)</li> <li> Visual feedback for users (notifications, progress bars, etc.)</li> <li> Clear rules and progression mechanics</li> </ul>| |
| ❔❔ | Minor | Spectator mode | Implement spectator mode for games <ul> <li> Allow users to watch ongoing games.</li> <li> Real-time updates for spectators.</li> <li> Optional: spectator chat.</li> </ul>| |
|🕒| Major | Microservices | Backend as microservices <ul> <li> Design loosely-coupled services with clear interfaces.</li> <li> Use REST APIs or message queues for communication.</li> <li> Each service should have a single responsibility</li> </ul>| jguelen |
| ❔❔ | Major | Advanced analytics | Advanced analytics dashboard with data visualization <ul> <li> Interactive charts and graphs (line, bar, pie, etc.).</li> <li> Real-time data updates.</li> <li> Export functionality (PDF, CSV, etc.).</li> <li> Customizable date ranges and filters.</li> </ul>| |
|🕒| Minor | Data import/export | Data export and import functionality <ul> <li> Export data in multiple formats (JSON, CSV, XML, etc.).</li> <li> Import data with validation.</li> <li> Bulk operations support</li> </ul>| |
|Current estimation (work done): **0** |Provisionnal total (without ❔): **26** |||
