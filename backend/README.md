# Mock Backend

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

Server runs on:

```text
http://localhost:3001
```

## Login Credentials

| Username | Password | Role |
| --- | --- | --- |
| hokimiyat | 12345 | hokimiyat |
| monitoring | 12345 | monitoring |

## Authorization Header

```http
Authorization: Bearer JWT_TOKEN
```

## Folder Structure

```text
backend
├── package.json
├── server.js
├── db.json
├── README.md
├── uploads/
├── middleware/
│   ├── auth.js
│   └── role.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   └── stages.js
└── utils/
    └── db.js
```

## API List

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | /api/login | Public |
| GET | /api/projects | hokimiyat, monitoring |
| GET | /api/projects/:id | hokimiyat, monitoring |
| POST | /api/projects | hokimiyat |
| PATCH | /api/projects/:id | hokimiyat |
| GET | /api/stages | hokimiyat, monitoring |
| POST | /api/stages | hokimiyat |
| PATCH | /api/stages/:id | hokimiyat |
| DELETE | /api/stages/:id | hokimiyat |
| GET | /uploads/:filename | Public |

## Example Login Request

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "username": "hokimiyat",
  "password": "12345"
}
```

## Example Login Response

```json
{
  "token": "JWT_TOKEN",
  "role": "hokimiyat"
}
```

## Example Create Project Request

```http
POST /api/projects
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data
```

Form fields:

```text
name=Project name
type=Infrastructure
year=2026
investmentType=Foreign
organization=Example organization
country=Uzbekistan
guarantorBank=Example bank
insuranceCompany=Example insurance
businessPlan=<file>
passportFile=<file>
```

## Example Create Project Response

```json
{
  "id": 1,
  "name": "Project name",
  "type": "Infrastructure",
  "year": "2026",
  "investmentType": "Foreign",
  "organization": "Example organization",
  "country": "Uzbekistan",
  "guarantorBank": "Example bank",
  "insuranceCompany": "Example insurance",
  "businessPlan": "/uploads/171111-business.pdf",
  "passportFile": "/uploads/171112-passport.pdf",
  "createdAt": "2026-07-05T10:00:00.000Z",
  "updatedAt": "2026-07-05T10:00:00.000Z"
}
```

## Example Create Stage Request

```http
POST /api/stages
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

```json
{
  "name": "Preparation",
  "startDate": "2026-07-01",
  "endDate": "2026-07-31",
  "projectId": 1
}
```

## Example Create Stage Response

```json
{
  "id": 1,
  "name": "Preparation",
  "startDate": "2026-07-01",
  "endDate": "2026-07-31",
  "projectId": 1,
  "createdAt": "2026-07-05T10:00:00.000Z",
  "updatedAt": "2026-07-05T10:00:00.000Z"
}
```
