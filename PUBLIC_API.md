# 🚀 Transcendence Public API Documentation

Welcome to the Transcendence Public API. This interface allows users to interact with their account data programmatically using a secure API Key.

## 📌 General Information

* **Base URL**: `https://<your-domain>/api/public`
* **Data Format**: JSON (`application/json`)
* **Target Service**: Managed by the `database-service` via Caddy.

### 🔐 Authentication
All requests to the public API must include your API Key in the HTTP headers. 
* **Required Header**: `x-api-key: sk_your_api_key_here`
* **Note**: Unauthorized requests or invalid keys will return a `401 Unauthorized` response.

### ⏱️ Rate Limiting
To ensure service stability, the public API is restricted to:
* **Limit**: **3 requests per minute** per API Key.
* **Over-limit Error**: Exceeding this limit results in a `429 Too Many Requests` response.

---

## 🛣️ API Endpoints

### 1. Get Pending Friend Requests
Retrieve a list of friend requests currently waiting for your approval.

* **Method**: `GET`
* **Path**: `/friends/receive`
* **Logic**: Filters `Friend` records where `addresseeId` matches your pseudo and `status` is `PENDING`.
* **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "requester": { "pseudo": "Alice" },
          "status": "PENDING"
        }
      ]
    }
    ```

### 2. List Accepted Friends
Retrieve the list of users you are currently friends with.

* **Method**: `GET`
* **Path**: `/friends`
* **Logic**: Retrieves `Friend` records where `status` is `ACCEPTED`.
* **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        { "pseudo": "Bob" },
        { "pseudo": "Charlie" }
      ]
    }
    ```

### 3. Check if User Exists
Check if a specific username exists in the Transcendence database.

* **Method**: `POST`
* **Path**: `/user/exists`
* **Body**:
    ```json
    {
      "pseudo": "TargetUsername"
    }
    ```
* **Response (200 OK)**:
    ```json
    {
      "success": true,
      "exists": true
    }
    ```
```bash
curl -kX POST "https://localhost:8443/api/public/user/exists" \
     -H "x-api-key: sk_test" \
     -H "Content-Type: application/json" \
     -d '{"pseudo": "UserName"}'
```
### 4. Update Email Address
Modify the email address associated with your account.

* **Method**: `PUT`
* **Path**: `/user/email`
* **Body**:
    ```json
    {
      "email": "new.email@example.com"
    }
    ```
* **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Email updated successfully"
    }
    ```
```bash
curl -kX PUT "https://localhost:8443/api/public/user/email" \
     -H "x-api-key: sk_test" \
     -H "Content-Type: application/json" \
     -d '{"email": "newEmail"}'
```
