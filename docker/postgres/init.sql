CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(40) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   
);

--INSERTING SAMPLE VALUES FOR TESTING PURPOSE--
INSERT INTO users (email,name) VALUES
    ('examplarycitizen@gmail.com','Aditya Rikhari'), 
    ('ordinarysinger@gmail.com','Alex Warren'), 
    ('bandakaamka@gmail.com','Chaar Diwari');

INSERT INTO products (name,description,price,category) VALUES
    ('iPhone 15', 'Latest Apple smartphone', 90000, 'electronics'),
    ('MacBook Pro', 'Professional laptop', 145000, 'electronics'),
    ('AirPods Pro', 'Wireless earbuds', 25000, 'electronics');
    
INSERT INTO orders (user_id,product_id, quantity, total_amount, status) VALUES
    (1,1,1,90000,'completed'),
    (2,3,2,50000,'pending');
