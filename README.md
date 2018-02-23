# Hazy Shade

Its a website.

# Importing DiscTypes into Mongo

  - Make sure a `DiscType` collection is defined in your Mongo instance
  - run `node ./scripts/loadCatalog.js` from the root directory

# Creating a user with remote access to the POS database
  - Choose a username and password to use
  - Log in as root to the POS database
  - Enter the following commands in the mysql command prompt:
    create user 'username'@'localhost' identified by 'password';
    create user 'username'@'*' identified by 'password';
    grant all on *.* to 'username'@'localhost';
    grant all on *.* to 'username'@'*';

[Library](./lib/README.md)


License
----

MIT
