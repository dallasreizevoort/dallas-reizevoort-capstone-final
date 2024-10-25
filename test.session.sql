ALTER TABLE users
ADD COLUMN country VARCHAR(2) NOT NULL;



-- @block 

ALTER TABLE users 
ADD COLUMN location VARCHAR(255) NOT NULL,
ADD COLUMN last_login DATETIME NOT NULL,
ADD COLUMN created_at DATETIME NOT NULL,
ADD COLUMN browser VARCHAR(255) NOT NULL,
ADD COLUMN os VARCHAR(255) NOT NULL,
ADD COLUMN device VARCHAR(255) NOT NULL,
ADD COLUMN ip_address VARCHAR(255) NOT NULL;

-- @block 
ALTER TABLE users
ADD COLUMN last_login DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;






-- @block 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spotify_user_id VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(2) NOT NULL
);
-- @block 
INSERT INTO users (spotify_user_id, display_name, email, country)
VALUES ('?', '?', '?', '?');
-- @block 
SELECT *
FROM users;


-- @block 
ALTER TABLE users
MODIFY COLUMN created_at DATETIME NOT NULL,
MODIFY COLUMN last_login DATETIME NOT NULL;


-- @block 
ALTER TABLE users
MODIFY COLUMN last_login DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
MODIFY COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- @block 
ALTER TABLE users
DROP COLUMN last_login,
DROP COLUMN created_at;