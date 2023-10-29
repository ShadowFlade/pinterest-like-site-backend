# pinterest-like-site-backend

Backend built with express and mongodb + separate storage for pictures (cloudinary)

Currently **not available** on any platoform, because my mongodb cluster got deleted (locally this will not work for the same reason, also no `.env` file for you). Fix is coming soon.

## Table schemas
**pins**
_id
img
title
description
authorId
keywords
DATE_INSERT
DATE_TO_PUBLISH
DATE_PUBLISHED

**users**
id
email
password

**sesseions**
?
## Journal

29.10.2023
started writing migraiton from mongodb to postgresql, realized that we really need typescript for this,
because i think we need schemas for tables, with typescript its easier.
