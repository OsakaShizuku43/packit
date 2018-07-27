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

| Name     | Required? | Type   |
| -------- | --------- | ------ |
| username | yes       | string |
| password | yes       | string |

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

| Name     | Required? | Type   |
| -------- | --------- | ------ |
| username | yes       | string |
| password | yes       | string |

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

## Box
### All boxes for current user
URL
- `api/box`

Method:
- `GET`

Params:
- Authentication required
- No params

Success Response:
```JSON
{
    "error": false,
    "boxes": [
        {
            "_id": "3a89s4fvbj390sd0",
            "name": "Books",
            "itemsCount": 10,
            "imageURL": "imgur.com/xxxx"
        }, {
            "_id": "3a89s4fvbj390sd1",
            "name": "Clothes",
            "itemsCount": 2,
            "imageURL": null
        }
    ]
}
```

Failure Response:
```JSON
{
    "error": true,
    "message": "Database error"
}
```

### Create a new box
URL
- `api/box`

Method:
- `POST`

Params:
- Authentication required

| Name     | Required? | Type   |
| -------- | --------- | ------ |
| name     | yes       | string |
| imageURL | no        | string |

Success Response:
```JSON
{
    "error": false,
    "boxId": "3a89s4fvbj390sd0"
}
```

Failure Response:
```JSON
{ 
    "error": true, 
    "message": "New box requires a name" 
}
```

### TODO: Get information of a box

### TODO: Get all items in a box

