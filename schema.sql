DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id int(11) NOT NULL AUTO_INCREMENT,
  product_name varchar(255) DEFAULT NULL,
  department_name varchar(255) DEFAULT NULL,
  price decimal(10,2) DEFAULT NULL,
  stock_quantity decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;