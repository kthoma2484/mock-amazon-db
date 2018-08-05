let inquirer = require("inquirer");
let mysql = require("mysql");
let cli = require("cli"),
    options = cli.parse();

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

    //  console.log("connected as id " + connection.threadId);
    loadInventory();
    // connection.end();

});

function loadInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //  console.log(res);
        console.log("Availalbe items for sale include:" + "\n\r" +
            "-----------------------------------------------")
        for (let i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " + res[i].item_id + "\n\r" +
                "Product Name: " + res[i].product_name + "\n\r" +
                "Department: " + res[i].department_name + "\n\r" +
                "Price: " + res[i].price + "\n\r" +
                "Stock Quantity: " + res[i].stock_quantity + "\n\r" +
                "-----------------------------------------------");
        };
        buyProduct();

    });
}

function buyProduct() {
    inquirer
        .prompt([{
                name: "item_id",
                type: "input",
                message: "What is the ID of the product you wish to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "number_purchased",
                type: "input",
                message: "How many of this item would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE item_id";
            connection.query(query, {
                item_id: answer.name
            }, function (err, res) {
                // console.log(typeof answer.item_id)
                //console.log(answer.item_id);

                // searches products database to match user item selection with database item id
                for (let i = 0; i < res.length; i++) {
                    let searchItemName = res[i].product_name;
                    let searchItemQuant = res[i].stock_quantity;
                    let searchItemId = res[i].item_id;
                    let searchItemTotalPrice = res[i].price * answer.number_purchased;

                    if (answer.item_id == searchItemId) {
                        if (searchItemQuant > answer.number_purchased) {
                        console.log(
                            "Confirmed! You have purchased " + answer.number_purchased +
                            searchItemName + " items!");
                        console.log("Your total purchase cost is $" + searchItemTotalPrice + "."); 
                        }else {
                            console.log("Insufficient Inventory: There are not enough of these items available for the quantity you've requested.");
                        };
                    }
                
                }
                console.log("Updating inventory....")
                setTimeout(loadInventory, 2000);
            });
        });

}