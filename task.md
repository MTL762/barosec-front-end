# 🚀 Frontend Integration Guide - New Verification & Marketing APIs

This document outlines the API specification for the newly added **Email & Phone Verification** endpoints and the **Bulk WhatsApp & Email Marketing** endpoint.

---

## 🔐 Global Authentication & Headers

All endpoints require Sanctum Bearer Token authentication and JSON response handling.

* **Headers:**
  ```http
  Authorization: Bearer <YOUR_SANCTUM_TOKEN>
  Accept: application/json
  ```

---

## 🛑 Verification Middleware (`verified.client`)

Routes protected by the `verified.client` middleware require the user's account to have both `email_verified_at` and `phone_verified_at` timestamps set.

If unverified, the API will respond with **`403 Forbidden`**:
```json
{
    "data": {
        "email_verified": false,
        "phone_verified": false
    },
    "message": "Your account must be verified by email and phone to access this resource.",
    "code": 403,
    "type": "error"
}
```

---

## 1. 📧 Email Verification APIs

### 1.1 Send Email Verification Code
Sends a 4-digit verification code to the authenticated user's email address.

* **Method:** `POST`
* **URL:** `/api/verification/send-email-code`
* **Headers:**
  * `Authorization: Bearer <token>`
  * `Accept: application/json`
* **Body:** None

#### 🟢 Success Response (`200 OK`)
```json
{
    "data": null,
    "message": "Verification email code sent successfully.",
    "type": "success",
    "code": 200
}
```

---

### 1.2 Verify Email Code
Validates the email OTP code provided by the user.

* **Method:** `POST`
* **URL:** `/api/verification/verify-email`
* **Headers:**
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
  * `Accept: application/json`
* **Body (JSON):**
  ```json
  {
      "code": "1234"
  }
  ```

#### 🟢 Success Response (`200 OK`)
```json
{
    "data": {
        "email_verified": true
    },
    "message": "Email verified successfully.",
    "type": "success",
    "code": 200
}
```

#### 🔴 Invalid/Expired Code Response (`422 Unprocessable Content`)
```json
{
    "data": null,
    "message": "The verification code is invalid or expired.",
    "code": 422,
    "type": "error"
}
```

---

## 📱 2. Phone Verification APIs

### 2.1 Send Phone Verification Code
Sends a 4-digit verification code to the authenticated user's phone via WhatsApp.

* **Method:** `POST`
* **URL:** `/api/verification/send-phone-code`
* **Headers:**
  * `Authorization: Bearer <token>`
  * `Accept: application/json`
* **Body:** None

#### 🟢 Success Response (`200 OK`)
```json
{
    "data": null,
    "message": "Verification phone code sent successfully.",
    "type": "success",
    "code": 200
}
```

---

### 2.2 Verify Phone Code
Validates the phone OTP code provided by the user.

* **Method:** `POST`
* **URL:** `/api/verification/verify-phone`
* **Headers:**
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
  * `Accept: application/json`
* **Body (JSON):**
  ```json
  {
      "code": "1234"
  }
  ```

#### 🟢 Success Response (`200 OK`)
```json
{
    "data": {
        "phone_verified": true
    },
    "message": "Phone verified successfully.",
    "type": "success",
    "code": 200
}
```

#### 🔴 Invalid/Expired Code Response (`422 Unprocessable Content`)
```json
{
    "data": null,
    "message": "The verification code is invalid or expired.",
    "code": 422,
    "type": "error"
}
```

---

## 📢 3. Bulk WhatsApp & Email Marketing API

### 3.1 Send Bulk WhatsApp & Mail to Clients
Dispatches queued WhatsApp and Email messages to target clients matching specified parameters. Supports optional image attachment.

* **Method:** `POST`
* **URL:** `/api/marketing/send-whatsapp-mail`
* **Headers:**
  * `Authorization: Bearer <token>`
  * `Accept: application/json`
* **Body Format:** `multipart/form-data`

#### 📋 Form-Data Parameters

| Key | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `send_to_all` | `boolean` / `numeric` | Optional | `1` to select all users, `0` when filtering by `client_ids`. Default: `0` |
| `subject` | `string` | **Required** | Subject title for Email notifications |
| `message` | `string` | **Required** | Main text body for WhatsApp & Email |
| `country` | `string` | Optional | Filter users by country name |
| `city` | `string` | Optional | Filter users by city name |
| `client_ids[]` | `array of integers` | Optional | Specific target user IDs (e.g. `client_ids[0]=1&client_ids[1]=2`) |
| `image` | `file` | Optional | Image attachment (`jpeg`, `png`, `webp`, max 10MB) |

#### 🟢 Success Response (`200 OK`)
```json
{
    "data": null,
    "message": "Messages sent successfully.",
    "type": "success",
    "code": 200
}
```

#### 🔴 Validation Error (`422 Unprocessable Content`)
```json
{
    "data": {
        "subject": [
            "The subject field is required."
        ],
        "message": [
            "The message field is required."
        ]
    },
    "message": "Resource Created Successfully",
    "code": 422,
    "type": "error"
}
```
