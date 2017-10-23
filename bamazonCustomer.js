var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "Bamazon"
});

function displayAll() {
	connection.query('SELECT * FROM products', function(error, response) {
		if (error) {
			console.log(error)
		};
		var theDisplayTable = new Table ({
			head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"],

			colWidths: [10, 30, 25, 10, 14]
		});

		for (i = 0; i < response.length; i++) {

			theDisplayTable.push(
				[response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
			);
		}

		console.log(theDisplayTable.toString());
		inquireForPurchase();
	});
};

function inquireForPurchase() {
	inquirer.prompt([

		{
			name: "ID",
			type: "input",
			message: "What is the item number of the product you would like to purchase?"
		},

		{
			name: "Quantity",
			type: "input",
			message: "How many would you like to buy?"
		},		
	]).then(function(answers) {

		var quantityDesired = answers.Quantity;
		var IDDesired = answers.ID;
		purchaseFromDatabase(IDDesired, quantityDesired);
	});
};

function purchaseFromDatabase(ID, quantityNeeded) {

	connection.query('SELECT * FROM products WHERE item_id = ' + ID, function(error, response) {
		if (error) {
			console.log(error)
		};

		if (quantityNeeded <= response[0].stock_quantity) {
			var totalCost = response[0].price * quantityNeeded;

			console.log("We have what you order! It will be coming out shortly!");
			console.log("Your total cost for " + quantityNeeded + " " + response[0].product_name + " is " + totalCost + ". Thank you!");
		
			connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantityNeeded + ' WHERE item_id = ' + ID);
		}
		else {
			console.log("Our apologies. We don't have enough " + response[0].product_name + " to meet your demand.");
		};
		displayAll();
	});
};

displayAll();