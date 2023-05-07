# The tshirt store

Backend app to sell tshirts online.

## Tech Stack

Javascript, Nodejs, Swagger api

## Instructions:

1. Clone the repo.

```
git clone https://github.com/abhin1509/tshirtstore.git
```

2. Go to the clonned directory.

```
cd tshirtstore
```

3. Install dependencies

```
npm install
```

4. Create .env file in root directory and set the following environment variable

`PORT=4000`

`MONGODB_URL=<mongodb connection url>`


`JWT_SECRET=<secret message>`

`JWT_EXPIRY=3d`

`COOKIE_TIME=3`


**CLOUDINARY**

`CLOUD_NAME=abhin`

`API_KEY=412969711852543`

`API_SECRET=EDRGwQZmj6546----this-is-a-test-key----------546d8SqV_9gXF8ct0aR0U`


**MAILTRAP**

`SMTP_HOST=smtp.mailtrap.io`

`SMTP_PORT=252f5`

`SMTP_USER=23441abgfgf3cbf----this-is-a-test-key----------7d2`

`SMTP_PASS=481907567----this-is-a-test-key----------05a7db449`


**STRIPE**

`STRIPE_API_KEY=pk_test_51L----this-is-a-test-key----------Hhq6UNFVVpk0CV1L6UPpZh00lz0JX0QW`

`STRIPE_SECRET=sk_test_51LhoyfSE41296971185254----this-is-a-test-key----------3KtfiYCVrEHRgAVWYc06IyoL00ZOggcbSx`

**RAZORPAY**

`RAZORPAY_API_KEY=rzp_test_T----this-is-a-test-key----------k9cfQFrftiyIy`

`RAZORPAY_SECRET=efgfgZhG8gdI----this-is-a-test-key----------2yh6tRzjMyghghANwwRx`



5. Start the server locally

```
npm run dev
```

6. Swagger api

```
http://localhost:4000/api-docs/
```

#### Payment docs references:

1. https://razorpay.com/docs/payments/orders/create
2. https://razorpay.com/docs/api/orders/#create-an-order/
3. https://razorpay.com/integrations/

4. https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements
5. https://stripe.com/docs/api/payment_intents/object?lang=node
