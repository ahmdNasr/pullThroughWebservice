
# API Documentation

## Login


> *User login with basic authentication*


###### info


*POST api/login*

Authentication is NOT required!


###### params


* email
* password


###### queries


* SELECT user_id, email, firstname, lastname, username FROM users_by_email WHERE email = ? AND password = ?;


## Username Exists


> *Searching for users by their username.*


###### info


*GET api/usernameExists*

Authentication is NOT required!


###### params


* username


###### queries


* SELECT count(*) FROM user_by_username WHERE username = ?;


## Register


> *User registration accesspattern.*


###### info


*POST api/register*

Authentication is NOT required!


###### params


* email
* password
* firstname
* lastname
* username
* description
* birthdate
* isCompany


###### queries


* [object Object]
* [object Object]
* [object Object]


## Sphereview


> *The recommendations for a specific user, identified by user_id.*


###### info


*GET api/sphereview*

Authentication is required!


###### params


* user_id
* event_datetime


###### queries


* SELECT event_id, user_id, event_name, venue, type, event_datetime FROM recommendations_by_user_and_datetime WHERE user_id = ? AND event_datetime > ?;


## Profile


> *Profile of the Users, needs Authentication*


###### info


*GET api/profile*

Authentication is required!


###### params


* user_id


###### queries


* SELECT description, birthdate, username, isCompany, firstname, lastname FROM userdetails_by_user WHERE user_id = ?;


## Private Events


> *Private event per user beginning at a specific timestamp.*


###### info


*GET api/privateEvents*

Authentication is required!


###### params


* user_id
* event_datetime


###### queries


* SELECT event_id, is_creator, event_datetime FROM visible_events_by_user WHERE user_id = ? and event_datetime >= ?;


## Event Details


> *Details of one specific Event.*


###### info


*GET api/eventDetails*

Authentication is required!


###### params


* event_id


###### queries


* SELECT type, description, datetime, tags, prerequisites, firstname, lastname, email, username, user_id, venue, name FROM eventdetails_by_event_id WHERE event_id = ?;


## Timeline


> *Timeline of a logged in User, the timeline displays already visited events.*


###### info


*GET api/timeline*

Authentication is required!


###### params


* user_id
* event_datetime


###### queries


* SELECT event_name, event_id FROM timeline_by_user_and_datetime WHERE user_id = ? AND event_datetime >= ?;


## Notifications


> *Notifications for a specific user starting at a specific timestamp.*


###### info


*GET api/notifications*

Authentication is required!


###### params


* recipient_id
* timestamp


###### queries


* SELECT notification_type, content, event_name, venue, event_description, notification_id, event_id, sender_id FROM notifications_by_recipient WHERE recipient_id = ? AND timestamp >= ?;


## Advanced Sphere Search


> *Searching for EventSpheres by type, tags and from a specific datetime.*


###### info


*GET api/advancedSphereSearch*

Authentication is required!


###### params


* type
* tags
* event_datetime


###### queries


* SELECT event_id, event_name, venue, title_picture, event_datetime FROM event_by_tags_and_type_and_datetime WHERE type = ? AND tags CONTAINS ? AND event_datetime > ?;


## Primitive User Search


> *Searching for users by their username.*


###### info


*GET api/primitiveUserSearch*

Authentication is required!


###### params


* username


###### queries


* SELECT firstname, lastname, description, profile_picture FROM user_by_username WHERE username = ?;