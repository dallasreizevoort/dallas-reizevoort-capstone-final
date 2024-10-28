-- @block 
SHOW DATABASES;

-- @block
USE DATABASE trackify;

-- @block
CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        spotify_user_id VARCHAR(255) NOT NULL UNIQUE,
        display_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        country VARCHAR(2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        browser VARCHAR(255) NOT NULL,
        os VARCHAR(255) NOT NULL,
        device VARCHAR(255) NOT NULL,
        ip_address VARCHAR(255) NOT NULL
    );

-- @block 
SHOW TABLES;

-- @block 
DESCRIBE users;