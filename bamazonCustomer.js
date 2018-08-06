//-------------------------------Reqired aps------------------------------------------------

let inquirer = require("inquirer");
let mysql = require("mysql");

//------------------------------MySQL database connection-----------------------------------

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
});


//-----------------------------------Utils---------------------------------------------------

// loads full inventory list
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
                // code to format price value
                "Price: " + (res[i].price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "\n\r" +
                "Stock Quantity: " + res[i].stock_quantity + "\n\r" +
                "-----------------------------------------------");
        };
        buyProduct();

    });
}

// user interface prompt to select product and quantity
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
                    console.log(" - Not valid. Please enter an Item ID # from the inventory available.");
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
                    console.log(" - Not valid. Please enter a numerical value."); }
            },
        ])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE item_id";
            connection.query(query, {
                item_id: answer.name
            }, function (err, res) {
          
                if (err) throw err;

                // checks if the item number provided is valid for the inventory available
                if (answer.item_id > res.length || answer.item_id < 1 || answer.number_purchased < 1 ) {
                    console.log("Please enter a valid inventory Item ID # and/or quantity.");
                } 
                // searches products database to match user item selection with database item id
                else {
                 
                    for (let i = 0; i < res.length; i++) {
                        let searchItemTotalPrice = 
                        (res[i].price * answer.number_purchased).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                        
                        let newQuantity = 0;

                        // if item number entered available and sufficient quantity available then item(s) purchased
                        if (answer.item_id == res[i].item_id) {
                            if (res[i].stock_quantity > answer.number_purchased) {
                                console.log(
                                    "Confirmed! You have purchased " + answer.number_purchased +
                                    res[i].product_name + " items!");
                                console.log("Your total purchase cost is $" + searchItemTotalPrice + ".");
                                newQuantity += res[i].stock_quantity - answer.number_purchased;
                                
                                // updates mysql database with new product quantity
                                connection.query(
                                    "UPDATE products SET ? Where ?", [{
                                            stock_quantity: newQuantity
                                        },
                                        {
                                            item_id: res[i].item_id
                                        }
                                    ],
                                    function (error) {
                                        if (error) throw error;
                                        console.log("Only " + newQuantity + res[i].product_name + " items left!");
                                    }
                                );
                                console.log("Updating inventory....")

                            } else {
                                console.log("Insufficient Inventory: There are not enough of these items available for the quantity you've requested.");
                            };
                        }

                    }
                }
                // delays inventory function by a few seconds
                setTimeout(loadInventory, 3500);
            });
        });

}