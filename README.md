# mock-amazon-db

This is a mock storefront app that allows for user interface via the terminal to selec inventory items. It uses MySQL for database storage and updating.

The app first loads the full inventory then prompts user to select an item id # for the item being purchased and a quantity of the item.

The app uses validation to ensure that only valid numerical values are entered by the user within the inventery item id range.

If user enters invalid characters, then app will return error message and reload the inventory available for selection.

Once a valid item and quantity is selected, the app will search for the time and only allow purchase if there is sufficient quantity in inventory for purchase. If insufficient quantity, app will inform user of such and reload inventory.

If both item is valid and there is sufficient quantity, app will provide user with total price of purchase for quantity of item requested and update database to reflect new avaliable inventory. 

For a video of this app, please follow link: https://drive.google.com/file/d/15r0sO9ziVlrUomaWE-pH6kJCoKjpvcRT/view


