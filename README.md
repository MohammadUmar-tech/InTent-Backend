# InTent Backend

## Project overview

InTent is an intent-based platform that helps people connect around activities they want to do at a similar time. A user describes an activity and when they are available; the platform can then find other people with compatible plans and help them form a temporary group. The goal is to make it easier to turn shared interests and plans into real-world experiences.

For example, someone looking to play cricket can find others who want to play during the same time period, organize a group, and meet for a match.

## Intended product flow

1. **Submit an intent** — A user describes the activity they want to do and when.
2. **Create the intent** — The platform records the activity, time, and relevant details.
3. **Find compatible people** — Intents are matched by activity and compatible time periods.
4. **Form a temporary group** — A person can join a proposed group or create one.
5. **Confirm participation** — Group members confirm that they plan to take part.
6. **Create an activity** — Once the group is ready, it becomes an organized activity.
7. **Meet in real life** — The group carries out the activity, such as playing a cricket match.
8. **Share feedback and memories** — Participants can rate the experience and save memories.
9. **Update reputation** — Ratings and completed activities contribute to each user's reputation.

This flow describes the product direction. The backend sections below document the current code; some intent routes and matching/group workflow pieces are not yet fully connected.

## Backend implementation

This document also describes how authentication and the user and intent models are currently implemented, and how their controllers and routes are connected.

## Authentication and users

### User model

The Mongoose schema is defined in [`src/models/user.model.js`](./src/models/user.model.js) and exported as `userModel`. It stores:

- Required name, phone, email, and password. Phone and email are unique; email is trimmed and lowercased.
- A GeoJSON-style location and the time it was last updated.
- Skills, matching preferences, and current goals.
- Reputation statistics, optional OTP data, verification status, and an optional socket ID.
- `createdAt` and `updatedAt` timestamps.

The model does not hash passwords itself. Hashing is performed by the signup controller.

### Authentication controller

[`src/controller/auth.controller.js`](./src/controller/auth.controller.js) exports `signup` and `login`.

- **Signup** requires `name`, `email`, `password`, and `phone`; checks for an existing email; hashes the password with bcrypt (10 rounds); creates the user with `isVerified: true`; then signs a JWT containing the user's ID with a seven-day expiry.
- **Login** looks up the user by email and compares the submitted password with the stored bcrypt hash. Missing users and incorrect passwords receive the same `401` response.
- Both handlers set the JWT in an HTTP-only `token` cookie. It is marked `secure` in production, uses `sameSite: "lax"`, and has a seven-day max age. Both also include the token and user in their JSON response.

### Authentication middleware

[`src/middlewares/auth.middleware.js`](./src/middlewares/auth.middleware.js) reads the `token` cookie, verifies it using `JWT_SECRET`, loads the corresponding user, and attaches that user to `req.user`. The database query excludes `password`, `otp`, and `otpExpiry`. Missing or unknown users are rejected as unauthorized.

The middleware is not currently applied to any route in the app entry point or the intent routes, so those routes do not currently enforce this authentication check.

### Auth routes and app connection

[`src/routes/auth.routes.js`](./src/routes/auth.routes.js) maps:

| Method | Path | Handler |
| --- | --- | --- |
| `POST` | `/signUp` | `signup` |
| `POST` | `/login` | `login` |

[`index.js`](./index.js) mounts this router at `/api/auth`, so the full paths are `POST /api/auth/signUp` and `POST /api/auth/login`. It also enables JSON and URL-encoded request parsing and cookie parsing before mounting the router.

## Intents

### Intent model

[`src/models/intent.model.js`](./src/models/intent.model.js) defines an `Intent` schema with a default export. An intent belongs to a user through `userId` and can store:

- Activity text, optional raw text, and a category.
- A date, start/end time window, and GeoJSON-style location.
- Search radius, group-size limits, skill level, budget, and notes.
- Status (`active`, `matched`, `expired`, or `cancelled`), expiry, matched user IDs, and a matched group ID.
- `createdAt` and `updatedAt` timestamps.

The model adds a `2dsphere` index on location for geospatial queries, plus indexes on status/activity/date and user/status.

### Intent controller

[`src/controller/intent.controller.js`](./src/controller/intent.controller.js) currently defines:

- `createIntent`: creates an intent using `req.user._id` and `activity`, `date`, `timeWindow`, and `location` from the request body.
- `getAllIntent`: attempts to retrieve intents for the current user.
- `getsingleIntent`: attempts to retrieve one intent by ID.
- `updateController`: updates radius, budget, skill level, and time window using an ID in the request body.

These handlers are written to use `req.user`, but the intent router does not attach `authMiddleware`; callers therefore need some other middleware to populate it for create/list operations.

### Intent routes and current wiring

[`src/routes/intent.routes.js`](./src/routes/intent.routes.js) declares the following paths:

| Method | Path | Referenced handler |
| --- | --- | --- |
| `POST` | `/` | `createIntent` |
| `GET` | `/mine` | `getAllIntent` |
| `GET` | `/:id` | `getsingleIntent` |
| `PATCH` | `/:id` | `updateController` |
| `DELETE` | `/:id` | `deleteIntent` |
| `POST` | `/parse` | `aiController` |

The intent router is **not mounted** in [`index.js`](./index.js), so none of these paths are currently reachable through the running app. If mounted under `/api/intents`, for example, the full paths would be `/api/intents/`, `/api/intents/mine`, and so on.

There are also implementation gaps to resolve before the declared intent routes can run reliably:

- The router references `updateController`, `deleteIntent`, and `aiController` but does not import them; only the create, list, and single-item handlers are imported.
- The controller imports `intentModel` as a named export, while the model exports it as the default export.
- The list handler calls `findAll`, which is not a standard Mongoose model query method.

These notes describe the current code; the intent route table is not a claim that those endpoints are operational.
