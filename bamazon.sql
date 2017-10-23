DROP DATABASE IF EXISTS Bamazon;
CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products(
  item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(50) NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fifa 18", "Video Games", 49.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Haagen Dasz Vanilla", "Ice Cream", 5.50, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blenders", "Kitchen Appliances", 34.10, 33);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Uncharted", "Video Games", 59.99, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Towel", "Bath", 18.35, 68);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Comforters", "Bedding", 70.80, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blankets", "Bedding", 65.70, 167);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bread Makers", "Kitchen Appliances", 149.25, 87);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chair", "Furniture", 78.99, 99);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Backpacks", "Luggage", 20.99, 89);


