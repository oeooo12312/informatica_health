import dotenv from 'dotenv';
import Stripe from 'stripe';
import fs from 'fs';
dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY);

async function fetchProductsAndPrices() {
    try {
      // Fetch all products
      const products = await stripe.products.list();
  
      // Fetch all prices
      const prices = await stripe.prices.list();
  
      // Map productId to description and priceId
      const productMap = {};
  
      products.data.forEach(product => {
        // Find the corresponding price for the product
        const price = prices.data.find(p => p.product === product.id);
  
        if (price) {
          productMap[product.id] = {
            description: product.description,
            priceId: price.id,
          };
        }
      });
  
      // Now productMap has the productId as the key and (description, priceId) as the value
      console.log(JSON.stringify(productMap, null, 2));
  
      // Optionally, you can write the result to a JSON file
      fs.writeFileSync('../../assets/products_prices.json', JSON.stringify(productMap, null, 2));
  
      return productMap;
    } catch (error) {
      console.error('Error fetching products and prices from Stripe:', error);
    }
}

// return a payment link
export async function createPaymentLink(line_items) {
  try {
    console.log("Line items:", line_items); // Log the line items
    const paymentLink = await stripe.paymentLinks.create({
      line_items: line_items,
    
    });

    console.log("Payment link created successfully:", paymentLink.url); // Log the successful creation

    return paymentLink.url;
  } catch (error) {
    console.error("Error creating payment link:", error); // Log the error message
    if (error.response) {
      console.error("Stripe error response:", error.response); // Log the error response from Stripe
    }
  }
}