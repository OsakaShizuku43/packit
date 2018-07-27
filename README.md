# Pack and Find
📦A handy app that helps you to track your items packed in your boxes when you move to another place :)

# API Documentation
## User
### Registration
URL
- `/api/user/register`

Method:
- `POST`

Params:
| Name | Required? | Type |
| --- | --- | --- | --- |
| username | yes | string |
| password | yes | string |

Success Response:
```JSON
{
    "error": false
}
```

Failure Response:
```JSON
{
    "error": true,
    "message": "Incomplete registration info"
}
```

### Login
URL
- `api/user/login`

Method:
- `POST`

Params:
| Name | Required? | Type |
| --- | --- | --- | --- |
| username | yes | string |
| password | yes | string |

Success Response:
```JSON
{
    "error": false,
    "token": "<access_token_here>"
}
```

Failure Response:
```JSON
{
    "error": true,
    "message": "Invalid credentials"
}
```