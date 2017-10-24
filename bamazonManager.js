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

var managerPrompt = function() {
    inquirer.prompt({

        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add a new product", "Quit"]
        },
    }).then(function(answer) {
        switch (answer.action) {
            case "View products for sale":
                viewInven(function() {
                    managerPrompt();
                });
                break;

            case "View low inventory":
                viewLowInven(function() {
                    managerPrompt();
                });
                break;

            case "Add to inventory":
                addToInven();
                break;

            case "Add a new product":
                addNewProd();
                break;

            case "Quit":
                connection.end();
                break;
        }
    })
};

var viewInven = function(invent) {
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
        invent();
    })
}

function viewLowInven(invent) {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if (err)
            throw err;

        if (res.length === 0) {
            console.log("There are currently no items with low inventory")
            invent();
        }
        else {
            var theDisplayTable = new Table ({
            head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"],

            colWidths: [10, 30, 25, 10, 14]
        });

        for (var i = 0; i < res.length; i++) {

            theDisplayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(theDisplayTable.toString());
        console.log("These are all the items that are low.")
        invent();
        }
    });
}

function addToInven() {
    var items = [];

    connection.query('SELECT product_name FROM products', function(err, res) {
        if (err)
            throw err;
        
        for (var i = 0; i < res.length; i++) {
            items.push(res[i].product_name)
        }

        inquirer.prompt ({
            {
            name: "choices",
            type: "checkbox",
            message: "Which product would you like to add inventory for?",
            choices: items
            },
        }).then(function(user) {

            if (user.choices.length === 0) {
                console.log("You did not select anything!");
                managerPrompt();
            }
            else {
                addToInven2(user.choices);
            }
        });   
    });
}


function addToInven2(itemNames) {
    var item = itemNames.shift();
    var itemStock;

    connection.query('SELECT stock_quantity FROM products WHERE ?', {product_name: item}, function(err, res) {
       if (err)
            throw err;
        
        itemStock = res[0].stock_quantity;
        itemStock = parseInt(itemStock) 
    });

    inquirer.prompt ({
            {
            name: "amount",
            type: "text",
            message: "How many " + item + " would you like to add?",
            validate: function(str) {
                if (isNaN(parseInt(str))) {
                    console.log("Sorry that is not a valid number.");
                    return false;
                }
                else {
                    return true;
                }
            }
        },
}   }).then(function(user) {
    var amount = user.amount
    amount = parseInt(amount);

    connection.query('UPDATE products SET ? WHERE ?', [{stock_quantity: itemStock += amount}, {product_name: item}], function(err) {
        if (err)
            throw err; 
    });

    if (itemNames.length != 0) {
        addToInven2(itemNames);
    }
    else {
        console.log("Thank you. Your inventory has been updated.");
        managerPrompt();
    }
});
}

function addNewProd() {
    var departments = [];

    connection.query('SELECT department_name FROM departments' function(err, res) {
        if (err)
            throw err;

        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].department_name);
        }
    });

    inquirer.prompt ({
            {
            name: "item",
            type: "text",
            message: "Please enter the product's name"
            },
            {
            name: "department",
            type: "list",
            message: "Please choose the department of your product"
            choices: departments
            },
            {
            name: "price",
            type: "text",
            message: "Please enter the price for this product"
            },
            {
            name: "stock",
            type: "text",
            message: "Please enter the stock quantity"
            },
        }).then(function(user) {
            var item = {
                product_name: user.item,
                department_name: user.department,
                price: user.price,
                stock_quantity: user.stock
            }
            connection.query('INSERT INTO products SET ?', item, function(err) {
                if (err)
                    throw err;

                console.log(item.product_name + ' has been added to your inventory');

                managerPrompt();
            });
        });
}
