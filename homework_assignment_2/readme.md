# Task Description

### 1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

### 2. Users can log in and log out by creating or destroying a token.

### 3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).

### 4. A logged-in user should be able to fill a shopping cart with menu items

### 5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

### 6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

# How to use

### 1. First clone this repository and create folder named data and inside create more four folders: cart, payments, tokens, users.

### 2. Configure file config.js and replace your api keys

### 3. After that create your user at /users POST

Body should be like (JSON)

    {
    	"email": "your_email",
    	"name": "your_name",
    	"adress": "your_adress"
    }
    
### 4. Create a token at /tokens POST

Body should be like (JSON)

    {
        "email": "your_email"
    }
    
### 5. Create a cart at /cart POST

Body should be like (JSON)

    {
        "email": "your_email"
    }
    
* You have to provide your token on header

### 6. Check menu at /menu GET and add an item to cart /cart PUT
Body should be like (JSON)

    {
        "product": "product_name",
        "quantity": "quantity" // By default quantity is one
    }

* You have to provide your token on header
 
 ### 7. at /pay POST (create payment list)
 Body should be like (JSON)

    {
        "email": "your_email"
    }

* You have to provide your token on header

### 8. Finally at /pay PUT
 Body should be like (JSON)

    {
        "email": "your_email"
    }
    
* You have to provide your token on header

## Routes

### /users
* POST - Required fields name: string, email: string, adress: string
* GET - Query string email: string and token: string on header
* PUT - Required fields email: string and opitional fields name: string, adress and token: string on header
* DELETE - Required fields email: string and token: string on header

### /tokens
* POST - Required fields email: string
* GET - Required fields id: string
* PUT - Required fields id: string and optional fields extend: boolean
* DELETE - Required fields id: string

### /menu
* GET - No body

### /cart
* POST - Required fields email: string and token: string on header
* GET - No body just token: string on header
* PUT - Required fields product: string and optional fields quantity: float and token: string on header
* DELETE - Required fields id: string and optional fields quantity: float and token: string on header

### /pay
* POST - Required fields email: string and token: string on header
* GET - Token: string on header and optional query string by payment_id: string
* PUT - Required fields email: string and token on header