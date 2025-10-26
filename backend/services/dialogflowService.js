import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import dialogflow from '@google-cloud/dialogflow';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DialogFlowService {
    constructor() {
        console.log('🔧 Initializing DialogFlow Service...');
        
        this.projectId = process.env.DIALOGFLOW_PROJECT_ID || 'webstore-475312';
        
        const credentialsPath = path.join(
            __dirname, 
            '../config/google-credentials/webstore-475312-5398855b0616.json'
        );
        
        console.log(' Project ID:', this.projectId);
        console.log(' Credentials Path:', credentialsPath);
        console.log(' File exists:', fs.existsSync(credentialsPath));
        
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(`Credentials file not found: ${credentialsPath}`);
        }
        
        try {
            this.config = { keyFilename: credentialsPath };
            this.sessionClient = new dialogflow.SessionsClient(this.config);
            console.log('✅ DialogFlow client initialized successfully');
        } catch (error) {
            console.error('❌ DialogFlow client error:', error.message);
            throw error;
        }
    }

    async detectIntent(sessionId, message, languageCode = 'en') {
        console.log(` detectIntent: "${message}"`);
        
        try {
            const sessionPath = this.sessionClient.projectAgentSessionPath(
                this.projectId, 
                sessionId
            );

            const request = {
                session: sessionPath,
                queryInput: {
                    text: { text: message, languageCode: languageCode },
                },
            };

            console.log(' Sending to DialogFlow...');
            const responses = await this.sessionClient.detectIntent(request);
            const result = responses[0].queryResult;
            
            console.log('✅ Response:', result.fulfillmentText);
            
            return {
                success: true,
                intent: result.intent.displayName,
                confidence: result.intentDetectionConfidence,
                response: result.fulfillmentText,
                parameters: result.parameters.fields,
                hasOrderInfo: this.checkForOrderIntent(result)
            };
            
        } catch (error) {
            console.error('❌ DialogFlow API error:', error.message);
            return {
                success: false,
                error: error.message,
                response: 'Sorry, I am having technical issues. Please try again later.'
            };
        }
    }

    checkForOrderIntent(result) {
        const orderIntents = ['track.order', 'check.order.status', 'order.inquiry'];
        return orderIntents.includes(result.intent.displayName);
    }
}

const dialogflowService = new DialogFlowService();

// executed function webhook from Dialogflow
export const handleWebhook = async (req, res) => {
  try {
    const { queryResult } = req.body;
    const intent = queryResult.intent.displayName;
    const parameters = queryResult.parameters;

    console.log(' Webhook received:', { 
        intent, 
        parameters,
        rawFields: parameters.fields,
     });

    let fulfillmentText = '';

    switch (intent) {
      case 'price.inquiry':
        fulfillmentText = await handlePriceInquiry(parameters);
        break;
        case 'stock.inquiry': 
        fulfillmentText = await handleStockInquiry(parameters);
        break;
      case 'product.category':
        fulfillmentText = await handleProductCategory(parameters);
        break;
      case 'product.inquiry':
        fulfillmentText = await handleProductInquiry(parameters);
        break;
      case 'shipping.info':
        fulfillmentText = await handleShippingInfo(parameters);
        break;
        case 'discount.inquiry':  
        fulfillmentText = await handleDiscountInquiry(parameters);
        break;
      case 'help':
        fulfillmentText = await handleHelp(parameters);
        break;
        case 'discount.inquiry':
            fulfillmentText = await handleDiscountInquiry(parameters);
            break;
          case 'order.tracking':
            fulfillmentText = await handleOrderTracking(parameters);
            break;
          case 'return.policy':
            fulfillmentText = await handleReturnPolicy(parameters);
            break;
          case 'payment.method':
            fulfillmentText = await handlePaymentMethods(parameters);
            break;
      default:
        fulfillmentText = queryResult.fulfillmentText || "I'm not sure how to help with that. Can you try asking differently?";
    }

    res.json({
      fulfillmentText,
      source: 'webstore-backend'
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.json({
      fulfillmentText: 'Sorry, I encountered an error. Please try again later.'
    });
  }
};

const handlePriceInquiry = async (parameters) => {
    console.log('🔍 Raw parameters received:', parameters);
    
    const productName = parameters.fields?.product_name?.stringValue || 
                       parameters.product_name || 
                       parameters.fields?.product_name;
    
    console.log('🎯 Extracted product name:', productName);
  
    if (!productName) {
      return "Which product would you like to know the price of?";
    }
  
    console.log('🔍 Searching database for:', productName);
  
    const products = await Product.find({
      $or: [
        { name: { $regex: productName, $options: 'i' } },
        { brand: { $regex: productName, $options: 'i' } }
      ]
    }).limit(5);
  
    console.log('📦 Products found:', products.length);
  
    if (products.length === 0) {
      return `I couldn't find "${productName}" in our store. Try searching for "Macbook Air M1", "iPhone", or "Samsung Galaxy".`;
    }
  
    if (products.length === 1) {
      const product = products[0];
      const stockStatus = product.countInStock > 0 
        ? `✅ ${product.countInStock} units in stock` 
        : '❌ Currently out of stock';
      return ` Yes, we have ${product.name}. The price of its product is $${product.price}. There are ${stockStatus} quantities in our store. And here is the ratings of other users: ${product.rating}`;
    }
  
    let response = `🔍 Found ${products.length} matching products:\n\n`;
    products.forEach((product, index) => {
      const stockIcon = product.countInStock > 0 ? '✅' : '❌';
      response += `${index + 1}. **${product.name}** - $${product.price} ${stockIcon}\n`;
    });
    response += "\nWhich specific model are you interested in?";
    
    return response;
  };

const handleProductCategory = async (parameters) => {
  const categoryName = parameters.fields?.product_category?.stringValue || parameters.product_category;
  
  const category = await Category.findOne({
    name: { $regex: categoryName, $options: 'i' }
  });

  if (!category) {
    return `Sorry, we don't have a "${categoryName}" category. Available categories are: phones, laptops, tablets, watches, and accessories.`;
  }

  const products = await Product.find({ category: category._id })
    .limit(6)
    .select('name price image');

  if (products.length === 0) {
    return `The ${category.name} category is currently empty.`;
  }

  const productList = products.map(p => 
    `• ${p.name} - $${p.price}`
  ).join('\n');

  return `Here are our ${category.name}:\n${productList}\n\nWould you like more details about any of these?`;
};

const handleProductInquiry = async (parameters) => {
  const productName = parameters.fields?.product_name?.stringValue || parameters.product_name;
  
  const product = await Product.findOne({
    name: { $regex: productName, $options: 'i' }
  }).populate('category');

  if (!product) {
    return `Sorry, I couldn't find information about "${productName}".`;
  }

  return `Here's information about ${product.name}:
• Price: $${product.price}
• Brand: ${product.brand}
• Category: ${product.category?.name || 'N/A'}
• Description: ${product.description.substring(0, 150)}...
• Status: ${product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}`;
};


const extractParameter = (parameters, paramName) => {
    const fields = parameters.fields || parameters;
    
    if (fields[paramName] && fields[paramName].stringValue) {
      return fields[paramName].stringValue;
    }
    if (fields[paramName] && typeof fields[paramName] === 'string') {
      return fields[paramName];
    }
    if (parameters[paramName] && parameters[paramName].stringValue) {
      return parameters[paramName].stringValue;
    }
    if (parameters[paramName] && typeof parameters[paramName] === 'string') {
      return parameters[paramName];
    }
    return null;
  };
  

  const handleShippingInfo = async (parameters) => {
    const location = extractParameter(parameters, 'location');
    const shippingMethod = extractParameter(parameters, 'shipping_method');
  
    console.log('🚚 Shipping info inquiry:', { location, shippingMethod });
  
    let response = "Our shipping information:\n\n";
  
    if (location && shippingMethod) {
      if (shippingMethod.toLowerCase().includes('express')) {
        response += `For express shipping to ${location}, the estimated delivery time is 1-2 business days. The shipping cost is $15.`;
      } else if (shippingMethod.toLowerCase().includes('standard')) {
        response += `For standard shipping to ${location}, the estimated delivery time is 3-5 business days. The shipping cost is $5.`;
      } else {
        response += `For ${shippingMethod} shipping to ${location}, the estimated delivery time is 2-3 business days. The shipping cost ranges from $8 to $12.`;
      }
    } else if (location) {
      response += `For shipping to ${location}, we offer:\n• Standard Shipping: 3-5 business days ($5)\n• Express Shipping: 1-2 business days ($15)\n• Free Shipping: 5-7 business days (on orders over $50)`;
    } else if (shippingMethod) {
      response += `For ${shippingMethod} shipping:\n• Delivery Time: 2-4 business days\n• Cost: $8-12\n• Available for most locations in Vietnam`;
    } else {
      response += "We offer the following shipping options:\n\n• **Standard Shipping**: 3-5 business days ($5)\n• **Express Shipping**: 1-2 business days ($15) \n• **Free Shipping**: 5-7 business days (for orders over $50)\n• **International Shipping**: 7-14 business days (cost varies)\n\nAll orders are processed within 24 hours during business days.";
    }
  
    response += "\n\nDo you have a specific location or shipping method you'd like to know more about?";
    return response;
  };


const handleHelp = async (parameters) => {
  const feature = parameters.fields?.system_feature?.stringValue || parameters.system_feature;
  
  if (feature) {
    return `I can help you with ${feature}. What specific issue are you experiencing?`;
  } else {
    return "I can help you with product information, pricing, shipping details, order tracking, and account issues. What do you need help with?";
  }
};


const handleStockInquiry = async (parameters) => {
    const productName = parameters.fields?.product_name?.stringValue || parameters.product_name;
    
    if (!productName) {
      return "Which product would you like to check stock for?";
    }
  
    console.log('📦 Checking stock for product:', productName);
  
    const products = await Product.find({
      name: { $regex: productName, $options: 'i' }
    }).limit(3);
  
    if (products.length === 0) {
      return `Sorry, I couldn't find "${productName}" in our inventory. Please check the product name.`;
    }
  
    if (products.length === 1) {
      const product = products[0];
      if (product.countInStock > 0) {
        return `✅ We have **${product.countInStock} units** of ${product.name} in stock!`;
      } else {
        return `❌ Sorry, ${product.name} is currently **out of stock**. We'll restock soon!`;
      }
    }
  
    let response = `I found ${products.length} products matching "${productName}":\n\n`;
    products.forEach((product, index) => {
      const stockStatus = product.countInStock > 0 
        ? `✅ ${product.countInStock} in stock` 
        : '❌ Out of stock';
      response += `${index + 1}. **${product.name}**: ${stockStatus}\n`;
    });
    
    return response;
  };

const handleDiscountInquiry = async (parameters) => {
    console.log('💰 Discount inquiry parameters:', parameters);
    
    const productName = parameters.fields?.product_name?.stringValue || parameters.product_name;
    const categoryName = parameters.fields?.product_category?.stringValue || parameters.product_category;
    const brandName = parameters.fields?.brand?.stringValue || parameters.brand;
    const priceRange = parameters.fields?.price_range?.stringValue || parameters.price_range;
    const ratingRange = parameters.fields?.rating_range?.stringValue || parameters.rating_range;
  
    console.log('🎯 Extracted parameters:', { 
      productName, 
      categoryName, 
      brandName, 
      priceRange, 
      ratingRange 
    });
  
    try {
      let query = {};
      let searchDescription = "current promotions";
      
      if (productName) {
        query.name = { $regex: productName, $options: 'i' };
        searchDescription = `deals on ${productName}`;
      }
      
      if (brandName && !productName) {
        query.brand = { $regex: brandName, $options: 'i' };
        searchDescription = `deals on ${brandName} products`;
      }
      
      if (categoryName) {
        const category = await Category.findOne({
          name: { $regex: categoryName, $options: 'i' }
        });
        if (category) {
          query.category = category._id;
          searchDescription = `deals on ${categoryName}`;
        }
      }
  
      if (priceRange) {
        const priceMatch = priceRange.match(/\$?(\d+)/);
        if (priceMatch) {
          const maxPrice = parseInt(priceMatch[1]);
          query.price = { $lte: maxPrice };
          searchDescription += ` under $${maxPrice}`;
        }
      }
  
      if (ratingRange) {
        const ratingMatch = ratingRange.match(/(\d+(?:\.\d+)?)/);
        if (ratingMatch) {
          const minRating = parseFloat(ratingMatch[1]);
          query.rating = { $gte: minRating };
          searchDescription += ` with ${minRating}+ stars`;
        }
      }
  
      if (Object.keys(query).length === 0) {
        query.rating = { $gte: 4.0 };
        searchDescription = "best deals";
      }
  
      console.log('🔍 Final query:', query);
      console.log('📝 Search description:', searchDescription);
  
      const discountProducts = await Product.find(query)
        .limit(10)
        .select('name price brand countInStock rating description images')
        .populate('category', 'name')
        .sort({ rating: -1, price: 1 });
  
      console.log('📦 Products found:', discountProducts.length);
  
      if (discountProducts.length === 0) {
        let noResultsMessage = `I couldn't find any ${searchDescription} at the moment.`;
        
        if (productName || brandName || categoryName) {
          noResultsMessage += "\n\nTry searching for:";
          if (!productName && !brandName) {
            noResultsMessage += "\n• Specific brands like Apple, Samsung, Huawei";
          }
          if (!categoryName) {
            noResultsMessage += "\n• Categories like laptops, phones, watches";
          }
          noResultsMessage += "\n• Or browse our general promotions";
        }
        
        return noResultsMessage;
      }
  
      if (discountProducts.length === 1) {
        const product = discountProducts[0];
        const originalPrice = Math.round(product.price * 1.2); // pretend discounting 20%
        const saveAmount = originalPrice - product.price;
        const savePercent = Math.round((saveAmount / originalPrice) * 100);
        
        return `🎉 Great deal found!\n\n**${product.name}**\n• Brand: ${product.brand}\n• Original: $${originalPrice} → **Now: $${product.price}**\n• You save: $${saveAmount} (${savePercent}% off!)\n• Rating: ${product.rating}/5 ⭐\n• Stock: ${product.countInStock > 0 ? `${product.countInStock} available ✅` : 'Out of stock ❌'}\n\nPerfect time to buy! Would you like more details?`;
      }
  
      let response = `🎯 Found ${discountProducts.length} ${searchDescription}:\n\n`;
      
      discountProducts.forEach((product, index) => {
        const originalPrice = Math.round(product.price * 1.15); // pretend discounting 15%
        const saveAmount = originalPrice - product.price;
        const stockIcon = product.countInStock > 0 ? '✅' : '❌';
        
        response += `${index + 1}. **${product.name}**\n`;
        response += `   Price: $${product.price} (Save $${saveAmount})\n`;
        response += `   Brand: ${product.brand} | Rating: ${product.rating}/5 ⭐\n`;
        response += `   Stock: ${stockIcon}\n\n`;
      });
  
      if (discountProducts.length >= 5) {
        response += "💡 **Tip**: Use filters like \"under $500\" or \"4+ stars\" to narrow down results!\n\n";
      }
  
      response += "Which product interests you most? I can provide detailed information!";
      
      return response;
  
    } catch (error) {
      console.error('❌ Discount inquiry error:', error);
      return "I'm having trouble accessing our promotion database right now. 😔\n\nPlease try again in a moment or visit our website for current deals. You can also ask about specific products like \"iPhone deals\" or \"laptop discounts\".";
    }
  };

const handleOrderTracking = async (parameters) => {
    const orderNumber = parameters.fields?.order_number?.stringValue || parameters.order_number;
    
    if (!orderNumber) {
      return "Please provide your order number to track your order. You can find it in your order confirmation email or in your account order history.";
    }
  
    console.log('📦 Tracking order:', orderNumber);
  
    try {
      // GIẢ ĐỊNH - Thay bằng Order model thực tế của bạn
      // const order = await Order.findById(orderNumber).populate('user', 'name email');
      
      // Tạm thời dùng mock data
      const mockOrders = {
        '68e905bb3ab8efbac2e3db15': {
          status: 'processing',
          customer: 'john',
          total: 969,
          isPaid: false,
          orderDate: '2024-10-20'
        },
        '68e905bb3ab8efbac2a3db15': {
          status: 'shipped', 
          customer: 'hieu',
          total: 629,
          isPaid: true,
          orderDate: '2024-10-19'
        }
      };
  
      const order = mockOrders[orderNumber];
      
      if (!order) {
        return `I couldn't find order "${orderNumber}" in our system. Please check your order number and try again. Make sure to include the full order ID.`;
      }
  
      const statusMap = {
        'pending': 'is being processed and will be confirmed shortly',
        'processing': 'is being prepared for shipment', 
        'shipped': 'has been shipped and is on its way to you',
        'delivered': 'has been delivered successfully',
        'cancelled': 'was cancelled'
      };
  
      const statusText = statusMap[order.status] || 'is being processed';
      const paidStatus = order.isPaid ? 'Paid' : 'Not paid yet';
      
      return `I found your order ${orderNumber}. Your order ${statusText}. \n\nOrder Details:\n- Customer: ${order.customer}\n- Total Amount: $${order.total}\n- Payment Status: ${paidStatus}\n- Order Date: ${order.orderDate}\n\nThank you for shopping with us! Would you like information about shipping or returns?`;
  
    } catch (error) {
      console.error('❌ Order tracking error:', error);
      return "I'm having trouble accessing order information right now. Please try again later or contact our customer support team for assistance.";
    }
  };

const handleReturnPolicy = async (parameters) => {
    const productCategory = parameters.fields?.product_category?.stringValue || parameters.product_category;
    const brandName = parameters.fields?.brand?.stringValue || parameters.brand;
  
    console.log('🔄 Return policy inquiry for:', { productCategory, brandName });
  
    let specificInfo = '';
    
    if (productCategory) {
      specificInfo = `For ${productCategory} products, `;
    } else if (brandName) {
      specificInfo = `For ${brandName} products, `;
    }
  
    return `${specificInfo}our return policy is as follows:\n\n• You can return any item within 30 days of purchase for a full refund.\n• Products must be in original condition with all packaging and accessories.\n• Electronics items have a 14-day return period for opened products.\n• Shipping costs for returns are the responsibility of the customer unless the item is defective.\n• Refunds are processed within 5-7 business days after we receive the returned item.\n\nDo you have a specific product you'd like to know more about regarding returns?`;
  };


  const handlePaymentMethods = async (parameters) => {
    console.log('💳 Payment methods parameters:', parameters);
    
    const paymentMethod = parameters.fields?.payment_method?.stringValue || 
                         parameters.payment_method;
    
    console.log('🎯 Requested payment method:', paymentMethod);
  
    if (paymentMethod) {
      const method = paymentMethod.toLowerCase();
      
      if (method.includes('paypal')) {
        return `Yes! We accept PayPal. You can use your PayPal account or pay with credit/debit cards through PayPal. It's secure and processes instantly with no extra fees.`;
      } else if (method.includes('credit') || method.includes('debit')) {
        return `Yes! We accept all major credit and debit cards (Visa, MasterCard, American Express). All transactions are SSL encrypted for security with no additional fees.`;
      } else if (method.includes('bank')) {
        return `Yes! Bank transfers are accepted. We'll provide our bank details after order confirmation. Processing takes 1-2 business days.`;
      } else if (method.includes('cash')) {
        return `Yes! Cash on Delivery is available in selected areas. You pay when you receive your order. No extra fees.`;
      } else if (method.includes('digital') || method.includes('apple') || method.includes('google')) {
        return `Yes! We support digital wallets including Apple Pay and Google Pay for fast, secure checkout.`;
      } else {
        return `We accept PayPal, Credit/Debit Cards, Bank Transfer, Cash on Delivery, and Digital Wallets. You can use ${paymentMethod} through one of these methods.`;
      }
    }
  
    return `We accept:\n\n• **Credit/Debit Cards** (Visa, MasterCard, Amex)\n• **PayPal** \n• **Bank Transfer**\n• **Cash on Delivery**\n• **Digital Wallets** (Apple Pay, Google Pay)\n\nAll payments are secure. Which method would you like details about?`;
  };

// Export cho frontend chat
export const detectIntent = async (sessionId, message) => {
  return await dialogflowService.detectIntent(sessionId, message);
};


export default dialogflowService;